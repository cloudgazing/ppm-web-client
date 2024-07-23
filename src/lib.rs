use wasm_bindgen::prelude::*;
use web_sys::{MessageEvent, WebSocket};

mod server;
mod storage;

// change to wss !!!
const WEB_SOCKET_URL: &str = "ws://127.0.0.1:3030";

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
}

#[wasm_bindgen]
pub struct WebSocketClient {
	ws: WebSocket,
}

#[wasm_bindgen]
impl WebSocketClient {
	#[wasm_bindgen(constructor)]
	pub fn new() -> WebSocketClient {
		let ws = WebSocket::new(WEB_SOCKET_URL).expect("Failed to create WebSocket");
		let client = WebSocketClient { ws };

		let onmessage_callback = Closure::wrap(Box::new(move |e: MessageEvent| {
			if let Some(text) = e.data().as_string() {
				match serde_json::from_str::<server::ServerMessage>(&text) {
					Ok(server::ServerMessage::NewMessage(data)) => {
						// decrypt the message
						// store the message
						// display the message
					}
					Err(_) => {
						println!("Onmessage error");
					}
				}
			}
		}) as Box<dyn FnMut(MessageEvent)>);

		client
			.ws
			.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));
		onmessage_callback.forget();

		client
	}

	#[wasm_bindgen(js_name = sendMessage)]
	pub fn send_message(&self, user_id: String, message: String) -> Result<(), JsValue> {
		let message_string = server::ClientMessage::sent_message_string(user_id, message).unwrap();

		let result = self.ws.send_with_str(&message_string);

		result
	}

	#[wasm_bindgen(js_name = sendLogin)]
	pub fn send_login(&self, access_key: String, password: String) -> Result<(), JsValue> {
		let message_string = server::ClientMessage::login_data_string(access_key, password).unwrap();

		let result = self.ws.send_with_str(&message_string);

		result
	}
}

// setting the initial context
#[wasm_bindgen(js_name = getContextSidebar)]
pub fn get_context_sidebar() -> Result<JsValue, JsValue> {
	// gets data from local storage and decrypts it
	// reads it into a vector of conversations

	use storage::{SidebarButton, SidebarContext};

	let buttons: SidebarContext = vec![
		SidebarButton {
			user_id: "user1".to_string(),
			display_name: "User 1".to_string(),
			new_messages: 0,
		},
		SidebarButton {
			user_id: "user2".to_string(),
			display_name: "User 2".to_string(),
			new_messages: 0,
		},
		SidebarButton {
			user_id: "user3".to_string(),
			display_name: "User 3".to_string(),
			new_messages: 0,
		},
	];

	Ok(serde_wasm_bindgen::to_value(&buttons)?)
}

#[wasm_bindgen(js_name = getContextConversation)]
pub fn get_context_conversation() -> Result<JsValue, JsValue> {
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

	Ok(serde_wasm_bindgen::to_value(&conversation)?)
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
