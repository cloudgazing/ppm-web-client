import type { Message, SidebarButton, User } from '~/types/appState.ts';
import type { ReactNode } from 'react';

import { useState } from 'react';

import { getContextConversation, getContextSidebar } from 'ppm-wasm';

import { ContextProvider } from '~/context/appState.loader.ts';

function AppStateContextProvider({ children }: { children: ReactNode }) {
	const [sidebarButtons, setSidebarButtons] = useState(getContextSidebar() as SidebarButton[]);
	const { u: [user, setUser], m: [messages, setMessages] } = useConversation();

	function useConversation() {
		const conversation = getContextConversation() as [User, Message[]];

		const u = useState(conversation[0]);
		const m = useState(conversation[1]);

		return { u, m };
	}

	return <ContextProvider value={{ sidebar: { sidebarButtons, setSidebarButtons }, user: { user, setUser }, messages: { messages, setMessages } }}>{children}</ContextProvider>;
}

export { AppStateContextProvider };
