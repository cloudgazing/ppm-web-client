use ed25519_dalek::Signature;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;
use x25519_dalek::PublicKey;

#[derive(Serialize, Deserialize)]
pub struct OTSet {
	pub id: [u8; 32],
	pub prekey: PublicKey,
}

#[derive(Serialize, Deserialize)]
pub struct InitialSet {
	pub identity_key: PublicKey,
	pub signed_prekey: PublicKey,
	pub signature: Signature,
	pub ot_sets: Vec<OTSet>,
}

// pub struct BobBundle {
// 	pub identity_key: PublicKey,
// 	pub signed_prekey: PublicKey,
// 	pub signature: Signature,
// 	pub ot_set: Option<OTSet>,
// }

// pub struct AliceMessage {
// 	pub identity_key: PublicKey,
// 	pub ephemeral_key: PublicKey,
// 	pub identifier: Option<[u8; 32]>,
// 	pub cyphertext: Vec<u8>,
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginData {
	pub access_key: String,
	pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SentMessage {
	pub access_token: String,
	pub user_id: String,
	// change to encrypted message
	pub content: String,
}

#[derive(Serialize, Deserialize)]
pub enum ClientMessage {
	LoginData(LoginData),
	SentMessage(SentMessage),
}

impl ClientMessage {
	pub fn login_data_string(access_key: String, password: String) -> Result<String, JsValue> {
		let login_data = LoginData { access_key, password };

		let client_message = Self::LoginData(login_data);

		let message_string = serde_json::to_string(&client_message).unwrap();

		Ok(message_string)
	}

	pub fn sent_message_string(user_id: String, message: String) -> Result<String, JsValue> {
		let content = message.clone();

		//get the access token from local storage
		let access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6Im15LWtleSJ9.eyJleHAiOjE3MjI2MjA3NTAsIm5iZiI6MTcyMTc1Njc1MCwiaWF0IjoxNzIxNzU2NzUwLCJ1c2VyX2lkIjoidGVzdC11c2VyLWlkIn0.MUl3YKD2CwyYil7QFTr34g26SMevJH4ITUbMCaxlVfU".to_string();

		let sent_message = SentMessage {
			access_token,
			user_id,
			content,
		};

		let client_message = Self::SentMessage(sent_message);

		let message_string = serde_json::to_string(&client_message).unwrap();

		Ok(message_string)
	}
}

#[derive(Serialize, Deserialize)]
pub struct NewMessage {
	pub user_id: String,
	pub content: String,
}

#[derive(Serialize, Deserialize)]
pub enum ServerMessage {
	NewMessage(NewMessage),
}
