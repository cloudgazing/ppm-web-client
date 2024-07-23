use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// stored data
#[derive(Serialize, Deserialize)]
pub struct OwnMessage {
	pub message_id: String,
	pub text: String,
	pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserMessage {
	pub message_id: String,
	pub text: String,
}

#[derive(Serialize, Deserialize)]
pub enum Message {
	OwnMessage(OwnMessage),
	UserMessage(UserMessage),
}

pub struct StorageMetadata {
	pub secret_data_key: String,
	pub own_data_key: OwnDataContext,
	pub messages_key: HashMap<String, Message>,
	pub last_user_key: UserContext,
}

// context data
pub type SidebarContext = Vec<SidebarButton>;

#[derive(Serialize, Deserialize)]
pub struct SidebarButton {
	pub user_id: String,
	pub display_name: String,
	pub new_messages: u32,
}

#[derive(Serialize, Deserialize)]
pub struct UserContext {
	pub user_id: String,
	pub display_name: String,
	pub new_messages: u32,
	pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct ConversationContext {
	pub user: UserContext,
	pub messages: Vec<Message>,
}

#[derive(Serialize, Deserialize)]
pub struct OwnDataContext {
	pub user_id: String,
	pub display_name: String,
}
