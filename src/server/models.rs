use ed25519_dalek::Signature;
use serde::{Deserialize, Serialize};
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

#[derive(Serialize, Deserialize)]
pub struct MessagePackage {
	pub sender_id: String,
	pub receiver_id: String,
	pub message: String,
}
