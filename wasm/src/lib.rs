pub mod auth;
pub mod chat;
pub mod dev;
pub mod state;

use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsError;

const CMW_URL: &str = env!("CMW_URL");

#[wasm_bindgen(start)]
pub async fn start() -> Result<(), JsError> {
	let req = reqwest::Client::new().get(CMW_URL).fetch_credentials_include();

	match req.send().await {
		Ok(_) => Ok(()),
		Err(e) => Err(JsError::new(
			e.status()
				.and_then(|s| s.canonical_reason())
				.unwrap_or("CMW request failed"),
		)),
	}
}
