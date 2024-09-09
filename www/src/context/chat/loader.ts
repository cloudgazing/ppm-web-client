import type { ConversationMessage, OpenUserInfo, SidebarPerson, WasmState } from 'wasm-module';

import { createCustomContext } from '~/context/createContext.ts';

type SidebarContent = SidebarPerson[];

interface ChatContext {
	sidebarContent: SidebarContent;
	selectedUser: {
		info: OpenUserInfo | null;
		messages: ConversationMessage[];
	};
	wasmState: WasmState;
}

const [useChatContext, ContextProvider] = createCustomContext<ChatContext>();

export { useChatContext, ContextProvider };
