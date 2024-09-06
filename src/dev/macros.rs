#[macro_export]
macro_rules! log {
	($val:expr) => {
		#[cfg(debug_assertions)]
		{
			let js_value = match serde_wasm_bindgen::to_value($val) {
				Ok(js_value) => js_value,
				Err(_) => format!("{}: {:?}", stringify!($val), $val).into(),
			};

			web_sys::console::log_1(&js_value);
		}
	};
}

pub use log;
