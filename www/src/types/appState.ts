import type { ConversationMessage, OpenUserInfo, SidebarPerson, WasmState } from 'wasm-module';

export interface AppState {
	generalState: SidebarPerson[];
	openUserInfo: OpenUserInfo | null;
	messages: ConversationMessage[];
	wasmState: WasmState;
}
