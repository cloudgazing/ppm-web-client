use crate::dev;
use crate::state;

use std::cell::RefCell;
use std::collections::HashMap;
use std::ptr;
use std::rc::Rc;

use ppm_models::client::data::{ConversationMessage, OtherMessage, OwnMessage, Person, UserData};
use ppm_models::client::message::{ClientMessage, UserMessage};
use ppm_models::server::message::{Notification, ServerMessage, Status};
use state::{OpenUserInfo, SidebarPerson, StateFunctions};
use uuid::Uuid;
use wasm_bindgen::prelude::{wasm_bindgen, Closure};
use wasm_bindgen::{JsCast, JsError, JsValue, UnwrapThrowExt};
use web_sys::{MessageEvent, WebSocket};

const WS_URL: &str = env!("WS_URL");
const AUTH_TOKEN_NAME: &str = env!("AUTH_TOKEN_NAME");

fn create_web_socket(
	people: Rc<RefCell<HashMap<String, Person>>>,
	open: Rc<RefCell<*mut Person>>,
	state_fn: Rc<StateFunctions>,
) -> Result<WebSocket, &'static str> {
	let token = wasm_cookies::get(AUTH_TOKEN_NAME)
		.ok_or_else(|| "Secure token missing")
		.and_then(|res| res.map_err(|_| "Token encoding error"))?;

	let ws = WebSocket::new(&format!("{WS_URL}?token={token}")).map_err(|_| "Failed to create WebSocket")?;

	let state = state_fn.clone();

	let on_message = Closure::wrap(Box::new(move |e: MessageEvent| {
		let state_fn = state.clone();

		let Some(message) = e.data().as_string() else { return };

		let Ok(server_message) = serde_json::from_str(&message) else {
			return;
		};

		match server_message {
			ServerMessage::Notification(n) => match n {
				Notification::NewMessage(msg) => {
					// decrypt the message

					let mut people = people.borrow_mut();
					if let Some(person) = people.get_mut(msg.user_id) {
						let message_id = Uuid::new_v4().to_string();
						let new_message = OtherMessage::new(message_id, msg.content);

						person.messages.push(ConversationMessage::from(new_message));

						let open = open.borrow();
						if !(*open).is_null() && (unsafe { &*(*open) }).user_id == person.user_id {
							dev::log!(&person.messages);

							state_fn.update_messages(&person.messages).unwrap_throw();
						}
					}
				}
				Notification::MessageStatus(update) => match update.status {
					Status::Success => {
						let mut people = people.borrow_mut();
						if let Some(person) = people.get_mut(update.message_id) {
							person.change_msg_to_sent(update.message_id);

							let open = open.borrow();
							if !(*open).is_null() && (unsafe { &*(*open) }).user_id == person.user_id {
								state_fn.update_messages(&person.messages).unwrap_throw();
							}
						}
					}
					Status::Error(e) => {
						//
						state_fn.display_banner(&e.as_str());
					}
				},
			},
			ServerMessage::KeepAlive(_) => {}
		}
	}) as Box<dyn FnMut(MessageEvent)>);

	ws.set_onmessage(Some(on_message.as_ref().unchecked_ref()));
	on_message.forget();

	let on_close = Closure::wrap(Box::new(move |_| {
		state_fn.display_banner("Connection closed. Refresh the page to reconnect.");

		dev::log!("WebSocket connection closed");
	}) as Box<dyn FnMut(MessageEvent)>);
	ws.set_onclose(Some(on_close.as_ref().unchecked_ref()));
	on_close.forget();

	Ok(ws)
}

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
	/// This constructor returns a rust result and thus should to be wrapped in a try-catch inside JS.
	#[wasm_bindgen(constructor)]
	pub fn new(
		update_sidebar: js_sys::Function,
		update_selected: js_sys::Function,
		update_messages: js_sys::Function,
		display_banner: js_sys::Function,
	) -> Result<WasmState, JsError> {
		// replace with get request
		let Ok(fetched_data) = dev::mock_user_data_str(&Uuid::new_v4().to_string()) else {
			return Err(JsError::new("Failed to fetch data"));
		};

		let Ok(user_data) = serde_json::from_str::<UserData>(&fetched_data) else {
			return Err(JsError::new("Failed to deserialize data"));
		};

		let own_user_id = user_data.own_user_id;

		let own_display_name = user_data.own_display_name;

		let state_fn = Rc::new(StateFunctions::new(
			update_sidebar,
			update_selected,
			update_messages,
			display_banner,
		));

		let people = Rc::new(RefCell::new(user_data.people));

		let open: Rc<RefCell<*mut Person>> = Rc::new(RefCell::new(ptr::null_mut()));

		let ws = match create_web_socket(people.clone(), open.clone(), state_fn.clone()) {
			Ok(ws) => ws,
			Err(e) => return Err(JsError::new(e)),
		};

		dev::log!("Creating state...");

		Ok(Self {
			own_user_id,
			own_display_name,
			state_fn,
			people,
			open,
			ws,
		})
	}

	#[wasm_bindgen(getter, js_name = "ownDisplayName")]
	pub fn own_display_name(&self) -> String {
		self.own_display_name.to_owned()
	}

	/// Sets the initial value for the sidebar state.
	/// This should be called right after the constructor, wrapped in a JS try-catch.
	#[wasm_bindgen(js_name = initState)]
	pub fn init_state(&self) -> Result<(), JsError> {
		let people = self.people.borrow();

		let value = SidebarPerson::from_people_arr(&people);

		match self.state_fn.update_sidebar(&value) {
			Ok(_) => {
				dev::log!("State init SUCCESS");

				Ok(())
			}
			Err(_) => Err(JsError::new("WASM state init error")),
		}
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

			self.state_fn.update_selected(&open_user_info).unwrap_throw();
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
