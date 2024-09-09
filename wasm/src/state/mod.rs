use std::collections::HashMap;

use ppm_models::client::data::{ConversationMessage, Person};
use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::JsValue;

#[derive(Clone, Deserialize, Serialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi)]
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
#[tsify(into_wasm_abi)]
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
	// update the sidebar prop data
	update_sidebar: js_sys::Function,
	// update the selected user
	update_selected: js_sys::Function,
	// update selected user messages
	update_messages: js_sys::Function,
	// display a banner at the top of the page
	display_banner: js_sys::Function,
}

impl StateFunctions {
	pub fn new(
		update_sidebar: js_sys::Function,
		update_selected: js_sys::Function,
		update_messages: js_sys::Function,
		display_banner: js_sys::Function,
	) -> Self {
		Self {
			update_sidebar,
			update_selected,
			update_messages,
			display_banner,
		}
	}

	pub fn update_sidebar(&self, arg: &[SidebarPerson]) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg)?;
		Ok(self.update_sidebar.call1(&JsValue::NULL, &js_value).unwrap_or_default())
	}

	pub fn update_selected(&self, arg: &OpenUserInfo) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg)?;
		Ok(self
			.update_selected
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or_default())
	}

	pub fn update_messages(&self, arg: &[ConversationMessage]) -> Result<JsValue, serde_wasm_bindgen::Error> {
		let js_value = serde_wasm_bindgen::to_value(arg)?;
		Ok(self
			.update_messages
			.call1(&JsValue::NULL, &js_value)
			.unwrap_or_default())
	}

	pub fn display_banner(&self, s: &str) -> JsValue {
		let js_value = JsValue::from_str(s);
		self.display_banner.call1(&JsValue::NULL, &js_value).unwrap_or_default()
	}
}
