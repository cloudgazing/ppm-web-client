import type { ReactNode } from 'react';
import type { ConversationMessage, OpenUserInfo, SidebarPerson } from 'wasm-module';

import { useMemo, useState } from 'react';
import { WasmState } from 'wasm-module';

import { ContextProvider } from '~/context/chat/loader.ts';
import { useBannerContext } from '~/context/banner/loader.ts';

type SidebarContent = SidebarPerson[];

function ChatContextProvider({ children }: { children: ReactNode }) {
	const { setBanner } = useBannerContext();
	const [sidebarContent, setSidebarContent] = useState<SidebarContent>([]);

	const [userInfo, setUserInfo] = useState<OpenUserInfo | null>(null);

	const [messages, setMessages] = useState<ConversationMessage[]>([]);

	const wasmState = useMemo(() => {
		try {
			const state = new WasmState(setSidebarContent, setUserInfo, setMessages, setBanner);

			state.initState();

			return state;
		} catch (e) {
			console.error(e instanceof Error ? e.message : String(e));

			throw e instanceof Error ? e : new Error(String(e));
		}
	}, []);

	return (
		<ContextProvider value={{ sidebarContent, selectedUser: { info: userInfo, messages }, wasmState }}>
			{children}
		</ContextProvider>
	);
}

export { ChatContextProvider };
