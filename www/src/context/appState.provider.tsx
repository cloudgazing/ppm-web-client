import type { CustomState, Message, OwnMessage, SidebarButton, User } from '~/types/appState.ts';
import type { ReactNode } from 'react';

import { useState } from 'react';

import { getContextConversation, getContextSidebar, WebSocketClient } from 'ppm-wasm';

import { ContextProvider } from '~/context/appState.loader.ts';

declare global {
	interface Window {
		onMessageReceived: (message: string) => void;
		sendMessage: (message: OwnMessage) => void;
		confirmLogin: (token: string) => void;
	}
}

function AppStateContextProvider({ children }: { children: ReactNode }) {
	const sidebar: CustomState<SidebarButton[]> = {} as CustomState<SidebarButton[]>;
	const user: CustomState<User> = {} as CustomState<User>;
	const messages: CustomState<Message[]> = {} as CustomState<Message[]>;

	const ws = new WebSocketClient();
	const conv = getContextConversation() as [User, Message[]];

	[sidebar.value, sidebar.setValue] = useState(getContextSidebar() as SidebarButton[]);
	[user.value, user.setValue] = useState(conv[0]);
	[messages.value, messages.setValue] = useState(conv[1]);

	window.onMessageReceived = message => {
		console.log(message);
	};
	window.sendMessage = message => {
		messages.setValue(prevMessages => {
			const newMessages = [...prevMessages];

			console.log(message);

			newMessages[newMessages.length - 1] = message;

			return newMessages;
		});
	};
	window.confirmLogin = token => {
		console.log(token);
	};

	return <ContextProvider value={{ sidebar, user, messages, ws }}>{children}</ContextProvider>;
}

export { AppStateContextProvider };
