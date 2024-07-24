import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

import { createCustomContext } from '~/context/custom.ts';
import { getContextConversation, getContextSidebar } from 'ppm-wasm';

type SidebarButton = {
	userId: string;
	displayName: string;
	newMessages: number;
}

type SidebarState = {
	sidebarButtons: SidebarButton[];
	setSidebarButtons: Dispatch<SetStateAction<SidebarButton[]>>;
}

type User = {
	userId: string;
	displayName: string;
	newMessages: number;
	status: 'online' | 'offline';
}

type UserState = {
	user: User;
	setUser: Dispatch<SetStateAction<User>>;
}

type Message = {
	type: "OwnMessage" | "UserMessage";
	messageId: string;
	text: string;
}

type MessagesState = {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
}

type AppState = {
	sidebar: SidebarState;
	user: UserState;
	messages: MessagesState;
};

const [useAppStateContext, ContextProvider] = createCustomContext<AppState>();

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

export { AppStateContextProvider, useAppStateContext };
