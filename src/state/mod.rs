use std::collections::HashMap;

use ppm_models::client::data::{ConversationMessage, Person};
use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::{JsValue, UnwrapThrowExt};

#[derive(Clone, Deserialize, Serialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct SidebarPerson<'a> {
	pub user_id: &'a str,
	pub display_name: &'a str,
	pub unread_count: usize,
}

impl<'a> SidebarPerson<'a> {
	pub fn new(user_id: &'a str, display_name: &'a str, unread_count: &usize) -> Self {
		Self {
			user_id,
			display_name,
			unread_count: *unread_count,
		}
	}

	pub fn from_people_arr(people: &'a HashMap<String, Person>) -> Vec<Self> {
		people
			.iter()
			.map(|(_, person)| Self::new(&person.user_id, &person.display_name, &person.unread_pointer.1))
			.collect::<Vec<_>>()
	}
}

#[derive(Clone, Deserialize, Serialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct OpenUserInfo<'a> {
	pub user_id: &'a str,
	pub display_name: &'a str,
}

impl<'a> OpenUserInfo<'a> {
	pub fn new(user_id: &'a str, display_name: &'a str) -> Self {
		Self { user_id, display_name }
	}
}

pub struct StateFunctions {
	// update the general conversations (the ones displayed on the sidebar, not open)
	update_gc: js_sys::Function,
	// update the open user info state
	update_open_user: js_sys::Function,
	// refresh the messages state
	update_messages: js_sys::Function,
	// display an error at the top of the page when something goes wrong
	display_err: js_sys::Function,
}

impl StateFunctions {
	pub fn new(
		update_gc: js_sys::Function,
		update_open_user: js_sys::Function,
		update_messages: js_sys::Function,
		display_err: js_sys::Function,
	) -> Self {
		Self {
			update_gc,
			update_open_user,
			update_messages,
			display_err,
		}
	}

	pub fn update_gc(&self, arg: &[SidebarPerson]) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg).expect_throw("update_gc serde err");
		Ok(self
			.update_gc
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or(JsValue::UNDEFINED))
	}

	pub fn update_user_info(&self, arg: &OpenUserInfo) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg).expect_throw("update usr info serde err");
		Ok(self
			.update_open_user
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or(JsValue::UNDEFINED))
	}

	pub fn update_messages(&self, arg: &[ConversationMessage]) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg).expect_throw("update msgs serde err");
		Ok(self
			.update_messages
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or(JsValue::UNDEFINED))
	}

	pub fn display_errr(&self, arg: &str) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg).expect_throw("display err serde err");
		Ok(self
			.display_err
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or(JsValue::UNDEFINED))
	}
}
