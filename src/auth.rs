use std::time::Duration;

use ppm_models::client::auth::{LoginData, SignupData};
use ppm_models::server::auth::{BasicResponse, LoginConfirmation, SignupConfirmation};
use reqwest::header::{HeaderName, ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue, UnwrapThrowExt};
use wasm_cookies::CookieOptions;

#[derive(serde::Deserialize, serde::Serialize)]
struct JSResponse<'a> {
	ok: bool,
	message: &'a str,
}

#[wasm_bindgen(js_name = getCsrf)]
pub async fn get_csrf() -> Result<(), JsError> {
	let req = reqwest::Client::new()
		.get("https://ppm.cloudgazing.dev/auth")
		.fetch_credentials_include();

	match req.send().await {
		Ok(_) => Ok(()),
		Err(e) => Err(JsError::new(e.status().expect_throw("Server request failed").as_str())),
	}
}

#[wasm_bindgen(js_name = sendLogin)]
pub async fn send_login(username: &str, password: &str) -> Result<JsValue, JsError> {
	let token = wasm_cookies::get("__Secure-Csrf-Token")
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let login_data = LoginData::new(username, password);

	let req = reqwest::Client::new()
		.post("https://ppm.cloudgazing.dev/auth/login")
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
			Ok(LoginConfirmation::Success(data)) => {
				let options = CookieOptions::default()
					.with_domain(".cloudgazing.dev")
					.expires_after(Duration::from_secs(86400)) // 10 days
					.secure()
					.with_same_site(wasm_cookies::SameSite::None);

				wasm_cookies::set("AT", &data.jwt, &options);

				let js_resp = JSResponse {
					ok: true,
					message: "Login successful",
				};

				Ok(serde_wasm_bindgen::to_value(&js_resp)?)
			}
			Ok(LoginConfirmation::Failure(message)) => {
				let js_resp = JSResponse { ok: false, message };

				Ok(serde_wasm_bindgen::to_value(&js_resp)?)
			}
			Err(_) => Err(JsError::new("Bad server response")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}

#[wasm_bindgen(js_name = sendSignup)]
pub async fn send_signup(username: &str, password: &str, display_name: &str) -> Result<JsValue, JsError> {
	let token = wasm_cookies::get("__Secure-Csrf-Token")
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let signup_data = SignupData::new(username, password, display_name);

	let req = reqwest::Client::new()
		.post("https://ppm.cloudgazing.dev/auth/signup")
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
			Ok(SignupConfirmation::Success(data)) => {
				let options = CookieOptions::default()
					.with_domain(".cloudgazing.dev")
					.expires_after(Duration::from_secs(86400)) // 10 days
					.secure()
					.with_same_site(wasm_cookies::SameSite::None);

				wasm_cookies::set("AT", &data.jwt, &options);

				let js_resp = JSResponse {
					ok: true,
					message: "Signup successful",
				};

				Ok(serde_wasm_bindgen::to_value(&js_resp)?)
			}
			Ok(SignupConfirmation::Failure(message)) => {
				let js_resp = JSResponse { ok: false, message };

				Ok(serde_wasm_bindgen::to_value(&js_resp)?)
			}
			Err(_) => Err(JsError::new("Bad server response")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}

#[wasm_bindgen(js_name = sendValidate)]
pub async fn send_validate() -> Result<bool, JsError> {
	let token = wasm_cookies::get("__Secure-Csrf-Token")
		.expect_throw("Secure token missing!!")
		.expect_throw("Token encoding error");

	let jwt = match wasm_cookies::get("AT") {
		Some(Ok(jwt)) => jwt,
		_ => return Ok(false),
	};

	let req = reqwest::Client::new()
		.post("https://ppm.cloudgazing.dev/auth/validate")
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
		Ok(text) => match serde_json::from_str::<BasicResponse<bool>>(&text) {
			Ok(data) => match data {
				BasicResponse::Ok(resp) => Ok(resp),
				BasicResponse::Err => Err(JsError::new("Invalid sent data")),
			},
			Err(_) => Err(JsError::new("Bad server response")),
		},
		Err(_) => Err(JsError::new("Bad server response")),
	}
}
