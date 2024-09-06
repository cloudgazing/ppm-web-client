import type { ReactNode } from 'react';
import type { ConversationMessage, OpenUserInfo, SidebarPerson } from 'ppm-wasm';

import { useMemo, useState } from 'react';
import { WasmState } from 'ppm-wasm';

import { ContextProvider } from '~/context/appState.loader.ts';

function displayErr() {
	return;
}

function AppStateContextProvider({ children }: { children: ReactNode }) {
	const [generalState, setGeneralState] = useState<SidebarPerson[]>([]);

	const [openUserInfo, setOpenUserInfo] = useState<OpenUserInfo | null>(null);

	const [messages, setMessages] = useState<ConversationMessage[]>([]);

	const wasmState = useMemo(() => {
		const state = new WasmState(setGeneralState, setOpenUserInfo, setMessages, displayErr);

		state.initState();

		return state;
	}, []);

	return <ContextProvider value={{ generalState, openUserInfo, messages, wasmState }}>{children}</ContextProvider>;
}

export { AppStateContextProvider };
