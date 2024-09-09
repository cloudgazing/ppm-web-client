use std::time::Duration;

use ppm_models::client::auth::{LoginData, SignupData};
use ppm_models::server::auth::{LoginConfirmation, SignupConfirmation, VerifyResponse};
use reqwest::header::{HeaderName, ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use tsify_next::Tsify;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsError;
use wasm_cookies::CookieOptions;

const LOGIN_URL: &str = env!("LOGIN_URL");
const SIGNUP_URL: &str = env!("SIGNUP_URL");
const VERIFY_URL: &str = env!("VERIFY_URL");
const CSRF_TOKEN_NAME: &str = env!("CSRF_TOKEN_NAME");
const COOKIE_DOMAIN: &str = env!("COOKIE_DOMAIN");

#[derive(serde::Deserialize, serde::Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct AuthResponse {
	ok: bool,
	message: String,
}

impl AuthResponse {
	pub fn new(ok: bool, message: String) -> Self {
		Self { ok, message }
	}
}

#[wasm_bindgen(js_name = sendAuthLogin)]
pub async fn send_auth_login(username: &str, password: &str) -> Result<AuthResponse, JsError> {
	let Some(token) = wasm_cookies::get(CSRF_TOKEN_NAME).transpose()? else {
		return Err(JsError::new("Secure token missing."));
	};

	let login_data = LoginData::new(username, password);

	let req = reqwest::Client::new()
		.post(LOGIN_URL)
		.header(CONTENT_TYPE, "application/json")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(serde_json::to_string(&login_data)?)
		.fetch_credentials_include();

	let resp = req.send().await?;
	let text = resp.text().await?;
	let login_confirmation: LoginConfirmation = serde_json::from_str(&text)?;

	match login_confirmation {
		LoginConfirmation::Success(token) => {
			let options = CookieOptions::default()
				.with_domain(COOKIE_DOMAIN)
				.expires_after(Duration::from_secs(86400)) // 10 days
				.secure()
				.with_same_site(wasm_cookies::SameSite::None);

			wasm_cookies::set("AT", token, &options);

			Ok(AuthResponse::new(true, "Login successful".to_string()))
		}
		LoginConfirmation::Error(e) => Ok(AuthResponse::new(false, e.as_str().to_string())),
	}
}

#[wasm_bindgen(js_name = sendAuthSignup)]
pub async fn send_auth_signup(username: &str, password: &str, display_name: &str) -> Result<AuthResponse, JsError> {
	let Some(token) = wasm_cookies::get(CSRF_TOKEN_NAME).transpose()? else {
		return Err(JsError::new("Secure token missing."));
	};

	let signup_data = SignupData::new(username, password, display_name);

	let req = reqwest::Client::new()
		.post(SIGNUP_URL)
		.header(CONTENT_TYPE, "application/json")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(serde_json::to_string(&signup_data)?)
		.fetch_credentials_include();

	let resp = req.send().await?;
	let text = resp.text().await?;
	let signup_confirmation: SignupConfirmation = serde_json::from_str(&text)?;

	match signup_confirmation {
		SignupConfirmation::Success(token) => {
			let options = CookieOptions::default()
				.with_domain(COOKIE_DOMAIN)
				.expires_after(Duration::from_secs(86400)) // 10 days
				.secure()
				.with_same_site(wasm_cookies::SameSite::None);

			wasm_cookies::set("AT", token, &options);

			Ok(AuthResponse::new(true, "Signup successful".to_string()))
		}
		SignupConfirmation::Error(e) => Ok(AuthResponse::new(false, e.as_str().to_string())),
	}
}

#[wasm_bindgen(js_name = sendVerification)]
pub async fn verify_auth() -> Result<(), JsError> {
	let Some(token) = wasm_cookies::get(CSRF_TOKEN_NAME).transpose()? else {
		return Err(JsError::new("secure token missing."));
	};

	let Some(jwt) = wasm_cookies::get("AT").transpose()? else {
		return Err(JsError::new("auth token missing."));
	};

	let req = reqwest::Client::new()
		.post(VERIFY_URL)
		.header(CONTENT_TYPE, "application/text")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(jwt)
		.fetch_credentials_include();

	let resp = req.send().await?;
	let text = resp.text().await?;
	let verify_response: VerifyResponse = serde_json::from_str(&text)?;

	match verify_response {
		VerifyResponse::Ok => Ok(()),
		VerifyResponse::Err(e) => Err(JsError::new(e.as_str())),
	}
}
