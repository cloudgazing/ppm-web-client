import type { ConversationMessage, OpenUserInfo, SidebarPerson, WasmState } from 'ppm-wasm';

export interface AppState {
	generalState: SidebarPerson[];
	openUserInfo: OpenUserInfo | null;
	messages: ConversationMessage[];
	wasmState: WasmState;
}
