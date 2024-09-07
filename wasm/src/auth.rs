use std::time::Duration;

use ppm_models::client::auth::{LoginData, SignupData};
use ppm_models::server::auth::{LoginConfirmation, SignupConfirmation, VerifyResponse};
use reqwest::header::{HeaderName, ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use tsify_next::Tsify;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, UnwrapThrowExt};
use wasm_cookies::CookieOptions;

const CMW_URL: &str = env!("CMW_URL");
const LOGIN_URL: &str = env!("LOGIN_URL");
const SIGNUP_URL: &str = env!("SIGNUP_URL");
const VERIFY_URL: &str = env!("VERIFY_URL");
const CSRF_TOKEN_NAME: &str = env!("CSRF_TOKEN_NAME");

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

#[wasm_bindgen(js_name = getCsrf)]
pub async fn get_csrf_middleware() -> Result<(), JsError> {
	let req = reqwest::Client::new().get(CMW_URL).fetch_credentials_include();

	match req.send().await {
		Ok(_) => Ok(()),
		Err(e) => Err(JsError::new(e.status().expect_throw("Server request failed").as_str())),
	}
}

#[wasm_bindgen(js_name = sendAuthLogin)]
pub async fn send_auth_login(username: &str, password: &str) -> Result<AuthResponse, JsError> {
	let token = wasm_cookies::get(CSRF_TOKEN_NAME)
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let login_data = LoginData::new(username, password);

	let req = reqwest::Client::new()
		.post(LOGIN_URL)
		.header(CONTENT_TYPE, "application/json")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(serde_json::to_string(&login_data)?)
		.fetch_credentials_include();

	let resp = match req.send().await {
		Ok(r) => r,
		Err(e) => return Err(JsError::new(e.status().expect_throw("Server request failed").as_str())),
	};

	match resp.text().await {
		Ok(text) => match serde_json::from_str::<LoginConfirmation>(&text) {
			Ok(LoginConfirmation::Success(token)) => {
				let options = CookieOptions::default()
					.with_domain(".cloudgazing.dev")
					.expires_after(Duration::from_secs(86400)) // 10 days
					.secure()
					.with_same_site(wasm_cookies::SameSite::None);

				wasm_cookies::set("AT", token, &options);

				let js_resp = AuthResponse::new(true, "Login successful".to_string());

				Ok(js_resp)
			}
			Ok(LoginConfirmation::Error(e)) => {
				let js_resp = AuthResponse::new(false, e.as_str().to_string());

				Ok(js_resp)
			}
			Err(_) => Err(JsError::new("Bad server response")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}

#[wasm_bindgen(js_name = sendAuthSignup)]
pub async fn send_auth_signup(username: &str, password: &str, display_name: &str) -> Result<AuthResponse, JsError> {
	let token = wasm_cookies::get(CSRF_TOKEN_NAME)
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let signup_data = SignupData::new(username, password, display_name);

	let req = reqwest::Client::new()
		.post(SIGNUP_URL)
		.header(CONTENT_TYPE, "application/json")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(serde_json::to_string(&signup_data)?)
		.fetch_credentials_include();

	let resp = match req.send().await {
		Ok(r) => r,
		Err(e) => return Err(JsError::new(e.status().expect_throw("Server request failed").as_str())),
	};

	match resp.text().await {
		Ok(text) => match serde_json::from_str::<SignupConfirmation>(&text) {
			Ok(SignupConfirmation::Success(token)) => {
				let options = CookieOptions::default()
					.with_domain(".cloudgazing.dev")
					.expires_after(Duration::from_secs(86400)) // 10 days
					.secure()
					.with_same_site(wasm_cookies::SameSite::None);

				wasm_cookies::set("AT", token, &options);

				let js_resp = AuthResponse::new(true, "Signup successful".to_string());

				Ok(js_resp)
			}
			Ok(SignupConfirmation::Error(e)) => {
				let js_resp = AuthResponse::new(false, e.as_str().to_string());

				Ok(js_resp)
			}
			Err(_) => Err(JsError::new("Bad server response")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}

#[wasm_bindgen(js_name = sendValidate)]
pub async fn verify_auth() -> Result<bool, JsError> {
	let token = wasm_cookies::get(CSRF_TOKEN_NAME)
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let jwt = match wasm_cookies::get("AT") {
		Some(Ok(jwt)) => jwt,
		_ => return Ok(false),
	};

	let req = reqwest::Client::new()
		.post(VERIFY_URL)
		.header(CONTENT_TYPE, "application/text")
		.header(ACCEPT, "application/json")
		.header(AUTHORIZATION, "Bearer {token}")
		.header(HeaderName::from_bytes(b"Csrf-Token")?, token)
		.body(jwt)
		.fetch_credentials_include();

	let resp = match req.send().await {
		Ok(resp) => resp,
		Err(e) => {
			return Err(JsError::new(
				e.status().expect_throw("JWT check request failed").as_str(),
			))
		}
	};

	match resp.text().await {
		Ok(text) => match serde_json::from_str::<VerifyResponse>(&text) {
			Ok(data) => match data {
				VerifyResponse::Ok => Ok(true),
				VerifyResponse::Err(e) => Err(JsError::new(e.as_str())),
			},
			Err(_) => Err(JsError::new("Bad client request")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}
