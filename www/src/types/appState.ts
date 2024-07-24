import type { Dispatch, SetStateAction } from "react";

export type SidebarButton = {
	userId: string;
	displayName: string;
	newMessages: number;
}

export type SidebarState = {
	sidebarButtons: SidebarButton[];
	setSidebarButtons: Dispatch<SetStateAction<SidebarButton[]>>;
}

export type User = {
	userId: string;
	displayName: string;
	newMessages: number;
	status: 'online' | 'offline';
}

export type UserState = {
	user: User;
	setUser: Dispatch<SetStateAction<User>>;
}

export type Message = {
	type: "OwnMessage" | "UserMessage";
	messageId: string;
	text: string;
}

export type MessagesState = {
	messages: Message[];
	setMessages: Dispatch<SetStateAction<Message[]>>;
}

export type AppState = {
	sidebar: SidebarState;
	user: UserState;
	messages: MessagesState;
};
