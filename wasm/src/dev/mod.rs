mod macros;

pub use macros::*;

use std::collections::HashMap;

use ppm_models::client::data::{ConversationMessage, OtherMessage, OwnMessage, Person, UserData};
use uuid::Uuid;

pub fn mock_user_data(own_user_id: &str) -> UserData {
	let own_display_name = "Miles C".to_string();

	let person_user_id_1 = Uuid::new_v4().to_string();

	let person_user_id_2 = Uuid::new_v4().to_string();

	let messages_1 = vec![
		ConversationMessage::from(OwnMessage::new(
			Uuid::new_v4().to_string(),
			"hi how are you".to_string(),
		)),
		ConversationMessage::from(OtherMessage::new(
			Uuid::new_v4().to_string(),
			"I'm great! Been a while since I've heard from you.".to_string(),
		)),
		ConversationMessage::from(OwnMessage::new(
			Uuid::new_v4().to_string(),
			"Yeah... I had to unplug for a while".to_string(),
		)),
		ConversationMessage::from(OtherMessage::new(
			Uuid::new_v4().to_string(),
			"Something happened?".to_string(),
		)),
	];

	let messages_2 = vec![
		ConversationMessage::from(OwnMessage::new(
			Uuid::new_v4().to_string(),
			"Yo! Are you still down to meet tomorrow?".to_string(),
		)),
		ConversationMessage::from(OtherMessage::new(
			Uuid::new_v4().to_string(),
			"Yea, just got done with work. Do you need me to prep something?".to_string(),
		)),
		ConversationMessage::from(OwnMessage::new(
			Uuid::new_v4().to_string(),
			"I got everything taken care off.".to_string(),
		)),
		ConversationMessage::from(OtherMessage::new(
			Uuid::new_v4().to_string(),
			"Alright. I have to finish something but I'll call you tomorrow".to_string(),
		)),
	];

	let person_1 = Person {
		user_id: person_user_id_1.clone(),
		display_name: "Friend One".to_string(),
		own_msg_map: HashMap::new(),
		unread_pointer: ("".to_string(), 0),
		messages: messages_1,
	};

	let person_2 = Person {
		user_id: person_user_id_2.clone(),
		display_name: "Friend Two".to_string(),
		own_msg_map: HashMap::new(),
		unread_pointer: ("".to_string(), 0),
		messages: messages_2,
	};

	let mut people = HashMap::new();

	people.insert(person_user_id_1, person_1);
	people.insert(person_user_id_2, person_2);

	UserData {
		own_user_id: own_user_id.to_string(),
		own_display_name,
		people,
	}
}

pub fn mock_user_data_str(own_user_id: &str) -> Result<String, serde_json::Error> {
	let user_data = mock_user_data(own_user_id);

	serde_json::to_string(&user_data)
}
