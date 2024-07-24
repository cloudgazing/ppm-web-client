import type { Dispatch, SetStateAction } from 'react';

export interface SidebarButton {
	userId: string;
	displayName: string;
	newMessages: number;
}

export interface SidebarState {
	sidebarButtons: SidebarButton[];
	setSidebarButtons: Dispatch<SetStateAction<SidebarButton[]>>;
}

export interface User {
	userId: string;
	displayName: string;
	newMessages: number;
	status: 'online' | 'offline';
}

export interface UserState {
	user: User;
	setUser: Dispatch<SetStateAction<User>>;
}

export interface Message {
	type: 'OwnMessage' | 'UserMessage';
	messageId: string;
	text: string;
}

export interface MessagesState {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
}

export interface AppState {
	sidebar: SidebarState;
	user: UserState;
	messages: MessagesState;
}
