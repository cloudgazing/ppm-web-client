pub mod auth;
pub mod chat;
pub mod dev;
pub mod state;

use std::cell::RefCell;
use std::collections::HashMap;
use std::ptr;
use std::rc::Rc;

use chat::create_web_socket;
use ppm_models::client::data::{ConversationMessage, OwnMessage, Person, UserData};
use ppm_models::client::message::{ClientMessage, UserMessage};
use state::{OpenUserInfo, SidebarPerson, StateFunctions};
use uuid::Uuid;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue, UnwrapThrowExt};
use web_sys::WebSocket;

#[wasm_bindgen]
pub struct WasmState {
	own_user_id: String,
	own_display_name: String,
	state_fn: Rc<StateFunctions>,
	people: Rc<RefCell<HashMap<String, Person>>>,
	open: Rc<RefCell<*mut Person>>,
	ws: WebSocket,
}

#[wasm_bindgen]
impl WasmState {
	#[wasm_bindgen(constructor)]
	pub fn new(
		update_general_state: js_sys::Function,
		update_user_info: js_sys::Function,
		update_messages: js_sys::Function,
		display_err: js_sys::Function,
	) -> Self {
		let fetched_data = dev::mock_user_data_str(&Uuid::new_v4().to_string()).unwrap(); // replace with get request
		let user_data: UserData = serde_json::from_str(&fetched_data).unwrap_throw();

		let own_user_id = user_data.own_user_id;

		let own_display_name = user_data.own_display_name;

		let state_fn = Rc::new(StateFunctions::new(
			update_general_state,
			update_user_info,
			update_messages,
			display_err,
		));

		let people = Rc::new(RefCell::new(user_data.people));

		let open = Rc::new(RefCell::new(ptr::null_mut()));

		let ws = create_web_socket(people.clone(), open.clone(), state_fn.clone());

		dev::log!("Creating state...");

		Self {
			own_user_id,
			own_display_name,
			state_fn,
			people,
			open,
			ws,
		}
	}

	#[wasm_bindgen(getter, js_name = "ownDisplayName")]
	pub fn own_display_name(&self) -> String {
		self.own_display_name.to_owned()
	}

	#[wasm_bindgen(js_name = initState)]
	pub fn init_state(&self) {
		let people = self.people.borrow();

		let value = SidebarPerson::from_people_arr(&people);

		self.state_fn.update_gc(&value).expect_throw("General state update");

		dev::log!("State init SUCCESS");
	}

	#[wasm_bindgen(js_name = changeConversation)]
	pub fn change_conversation(&self, user_id: String) {
		let mut people = self.people.borrow_mut();

		if let Some(person) = people.get_mut(&user_id) {
			let mut open = self.open.borrow_mut();

			*open = ptr::addr_of_mut!(*person);

			let user_id = unsafe { &(*(*open)).user_id };
			let display_name = unsafe { &(*(*open)).display_name };
			let messages = unsafe { &(*(*open)).messages };

			let open_user_info = OpenUserInfo::new(user_id, display_name);

			self.state_fn.update_user_info(&open_user_info).unwrap_throw();
			self.state_fn.update_messages(&messages).unwrap_throw();

			dev::log!(&format!("Changed open to {display_name}"));
		}
	}

	#[wasm_bindgen(js_name = sendMessage)]
	pub fn send_message(&self, text: String) -> Result<(), JsValue> {
		let open = self.open.borrow();
		match !(*open).is_null() {
			true => {
				let jwt = wasm_cookies::get("AT")
					.expect_throw("Secure token missing!!")
					.expect_throw("Token encoding error");

				let message_id = Uuid::new_v4();
				let own_message = OwnMessage::new(&message_id.to_string(), &text);

				dev::log!(&own_message);

				let messages = unsafe { &mut (*(*open)).messages };
				messages.push(ConversationMessage::from(own_message));

				dev::log!(&messages.len());

				self.state_fn.update_messages(messages).unwrap_throw();

				let user_message = UserMessage::new(&jwt, &self.own_user_id, message_id.as_bytes(), text.as_bytes());
				let client_message = ClientMessage::from(user_message);

				self.ws.send_with_str(&client_message.serialize().unwrap_throw())
			}
			false => Err(JsError::new("Open is NULL!").into()),
		}
	}
}
