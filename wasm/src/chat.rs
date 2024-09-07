use crate::dev;
use crate::state;

use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use ppm_models::client::data::{ConversationMessage, OtherMessage, Person};
use ppm_models::server;
use ppm_models::server::message::{Notification, ServerMessage};
use uuid::Uuid;
use wasm_bindgen::prelude::Closure;
use wasm_bindgen::JsCast;
use wasm_bindgen::UnwrapThrowExt;
use web_sys::{MessageEvent, WebSocket};

const WS_URL: &str = env!("WS_URL");
const AUTH_TOKEN_NAME: &str = env!("AUTH_TOKEN_NAME");

pub fn create_web_socket(
	people: Rc<RefCell<HashMap<String, Person>>>,
	open: Rc<RefCell<*mut Person>>,
	state_fn: Rc<state::StateFunctions>,
) -> WebSocket {
	let token = wasm_cookies::get(AUTH_TOKEN_NAME)
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let ws = WebSocket::new(&format!("{WS_URL}?token={token}")).expect_throw("Failed to create WebSocket");

	let on_message = Closure::wrap(Box::new(move |e: MessageEvent| {
		let message = match e.data().as_string() {
			Some(message) => message,
			None => return,
		};

		let server_message: ServerMessage = match serde_json::from_str(&message) {
			Ok(message) => message,
			Err(_) => return,
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
					server::message::Status::Success => {
						let mut people = people.borrow_mut();
						if let Some(person) = people.get_mut(update.message_id) {
							person.change_msg_to_sent(update.message_id);

							let open = open.borrow();
							if !(*open).is_null() && (unsafe { &*(*open) }).user_id == person.user_id {
								state_fn.update_messages(&person.messages).unwrap_throw();
							}
						}
					}
					server::message::Status::Error(e) => {
						//
						state_fn.display_errr(&e.as_str()).unwrap_throw();
					}
				},
			},
			ServerMessage::KeepAlive(_) => {}
		}
	}) as Box<dyn FnMut(MessageEvent)>);

	ws.set_onmessage(Some(on_message.as_ref().unchecked_ref()));
	on_message.forget();

	let on_close = Closure::wrap(Box::new(move |_| {
		dev::log!("Connection closed");
	}) as Box<dyn FnMut(MessageEvent)>);
	ws.set_onclose(Some(on_close.as_ref().unchecked_ref()));
	on_close.forget();

	ws
}
