use rand::rngs::OsRng;
use sha2::{Digest, Sha256};
use x25519_dalek::{PublicKey, StaticSecret};

pub struct KeyPair {
	pub public: PublicKey,
	pub private: StaticSecret,
}

pub struct OTPair {
	pub id: [u8; 32],
	pub public: PublicKey,
	pub private: StaticSecret,
}

pub struct UserKeys {
	pub identity: KeyPair,
	pub signed_p: Box<KeyPair>,
	pub ot_p: Vec<OTPair>,
}

impl KeyPair {
	pub fn new() -> Self {
		let priv_key = StaticSecret::random_from_rng(OsRng);
		let pub_key = PublicKey::from(&priv_key);

		Self {
			public: pub_key,
			private: priv_key,
		}
	}
}

impl OTPair {
	pub fn new() -> Self {
		let priv_key = x25519_dalek::StaticSecret::random_from_rng(OsRng);
		let pub_key = x25519_dalek::PublicKey::from(&priv_key);

		let id = Sha256::digest(pub_key.as_bytes()).into();

		Self {
			public: pub_key,
			private: priv_key,
			id,
		}
	}
}
