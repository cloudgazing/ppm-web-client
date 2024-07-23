import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Message } from "~/types.ts";

import { useLocalStorage } from "usehooks-ts";

import { createCustomContext } from '~/context/custom.ts';

type IdState = {
	id: string | null;
	setId: Dispatch<SetStateAction<string | null>>;
}

type DisplayNameState = {
	displayName: string | null;
	setDisplayName: Dispatch<SetStateAction<string | null>>;
}

type IsOnlineState = {
	isOnline: boolean;
	setIsOnline: Dispatch<SetStateAction<boolean>>;
}

type MessagesState = {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
}

type CurrentConversation = {
	id: IdState;
	displayName: DisplayNameState;
	isOnline: IsOnlineState;
	messages: MessagesState;
};

const [useCurrentConversationContext, ContextProvider] = createCustomContext<CurrentConversation>();

function CurrentConversationContextProvider({ children }: { children: ReactNode }) {
	const [id, setId] = useLocalStorage<string | null>('current-id', null);
	const [displayName, setDisplayName] = useLocalStorage<string | null>('current-display-name', null);
	const [isOnline, setIsOnline] = useLocalStorage<boolean>('current-is-online', false);
	const [messages, setMessages] = useLocalStorage<Message[]>('current-messages', []);

	return <ContextProvider value={{ id: { id, setId }, displayName: { displayName, setDisplayName }, isOnline: { isOnline, setIsOnline }, messages: { messages, setMessages } }}>{children}</ContextProvider>;
}

export { CurrentConversationContextProvider, useCurrentConversationContext };

