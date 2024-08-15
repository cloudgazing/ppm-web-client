pub mod auth;
mod storage;

use ppm_models::client;
use ppm_models::server;
use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::{wasm_bindgen, Closure, JsValue};
use wasm_bindgen::JsCast;
use web_sys::{MessageEvent, WebSocket};

const WEB_SOCKET_URL: &str = "wss://ppm.cloudgazing.dev/ws";

#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_name = onMessageReceived)]
	fn on_message_received(message: String);

	#[wasm_bindgen(js_name = sbAddButton)]
	fn sb_add_button(conversation: JsValue);

	#[wasm_bindgen(js_name = sbRemoveButton)]
	fn sb_remove_button(conversation: JsValue);

	#[wasm_bindgen(js_name = newConversationMessage)]
	fn new_conversation_message(message: JsValue);

	#[wasm_bindgen(js_name = sendMessage)]
	fn send_message(message: JsValue);

	#[wasm_bindgen(js_name = confirmLogin)]
	fn confirm_login(token: &str);
}

#[wasm_bindgen]
pub struct WebSocketClient {
	ws: WebSocket,
	_client: Arc<Mutex<Option<Arc<WebSocketClient>>>>,
}

#[wasm_bindgen]
impl WebSocketClient {
	#[wasm_bindgen]
	pub fn new() -> *const WebSocketClient {
		let ws = WebSocket::new(WEB_SOCKET_URL).expect("Failed to create WebSocket");

		let client = Arc::new(Mutex::new(None));
		let ws_client = Arc::new(WebSocketClient {
			ws,
			_client: client.clone(),
		});

		{
			let ws_client = ws_client.clone();
			*client.lock().unwrap() = Some(ws_client);
		}

		let keep_alive_timer = Arc::new(Mutex::new(45_u8)); // 5 seconds leeway

		let on_message = Closure::wrap(Box::new(move |e: MessageEvent| {
			let message = match e.data().as_string() {
				Some(message) => message,
				None => return,
			};

			let server_message: server::message::Message = match serde_json::from_str(&message) {
				Ok(message) => message,
				Err(_) => return,
			};

			match server_message {
				server::message::Message::Notification(data) => {
					match data {
						server::message::Notification::NewMessage(_data) => {
							// decrypt the message
							// store the message
							// display the message
						}
					}
				}
				server::message::Message::KeepAlive(_) => {
					let mut keep_alive_timer = keep_alive_timer.lock().unwrap();
					*keep_alive_timer = 45;
				}
				server::message::Message::Welcome(data) => {
					let client = client.lock().unwrap();
					let client = client.as_ref().unwrap().clone();

					// get the token from local storage
					let token = "temp_token".to_string();

					let client_message = client::message::Message::welcome_response(data.signed_key, token);

					let _ = client.ws.send_with_str(&client_message.serialize().unwrap());
				}
			}
		}) as Box<dyn FnMut(MessageEvent)>);

		ws_client.ws.set_onmessage(Some(on_message.as_ref().unchecked_ref()));
		on_message.forget();

		Arc::into_raw(ws_client)
	}

	#[wasm_bindgen(js_name = sendMessage)]
	pub fn send_message(&self, user_id: String, message_text: String) {
		//get the access token from local storage
		let access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6Im15LWtleSJ9.eyJleHAiOjE3MjI2MjA3NTAsIm5iZiI6MTcyMTc1Njc1MCwiaWF0IjoxNzIxNzU2NzUwLCJ1c2VyX2lkIjoidGVzdC11c2VyLWlkIn0.MUl3YKD2CwyYil7QFTr34g26SMevJH4ITUbMCaxlVfU".to_string();

		let client_message = client::message::Message::user_message(access_token, user_id, message_text);

		let _ = self.ws.send_with_str(&client_message.serialize().unwrap());
	}
}

// setting the initial context
#[wasm_bindgen(js_name = getContextSidebar)]
pub fn get_context_sidebar() -> Result<JsValue, JsValue> {
	use storage::SidebarButton;

	// gets data from local storage and decrypts it
	// reads it into a vector of conversations

	let buttons = vec![
		SidebarButton {
			user_id: "user1".to_string(),
			display_name: "User 1".to_string(),
			new_messages: 2,
		},
		SidebarButton {
			user_id: "user2".to_string(),
			display_name: "User 2".to_string(),
			new_messages: 0,
		},
		SidebarButton {
			user_id: "user3".to_string(),
			display_name: "User 3".to_string(),
			new_messages: 10,
		},
	];

	Ok(serde_wasm_bindgen::to_value(&buttons)?)
}

#[wasm_bindgen(js_name = getContextConversation)]
pub fn get_context_conversation() -> Result<js_sys::Array, JsValue> {
	// gets data from local storage and decrypts it
	// reads the current user into a currentuser struct
	// reads the messages into a vec

	use storage::{Message, OwnMessage, UserMessage};

	let messages = vec![
		Message::OwnMessage(OwnMessage {
			message_id: "message1".to_string(),
			text: "Hello world!".to_string(),
			status: "sent".to_string(),
		}),
		Message::UserMessage(UserMessage {
			message_id: "message2".to_string(),
			text: "Hello world!".to_string(),
		}),
	];

	let conversation = storage::ConversationContext {
		user: storage::UserContext {
			user_id: "user1".to_string(),
			display_name: "User 1".to_string(),
			new_messages: 0,
			status: "online".to_string(),
		},
		messages,
	};

	let js_user = serde_wasm_bindgen::to_value(&conversation.user)?;
	let js_messages = serde_wasm_bindgen::to_value(&conversation.messages)?;

	Ok(js_sys::Array::of2(&js_user, &js_messages))
}

#[wasm_bindgen(js_name = getContextOwnData)]
pub fn get_context_own_data() -> Result<JsValue, JsValue> {
	// gets data from local storage and decrypts it
	// reads it into a owndata struct

	let data = storage::OwnDataContext {
		user_id: "user1".to_string(),
		display_name: "User 1".to_string(),
	};

	Ok(serde_wasm_bindgen::to_value(&data)?)
}
