import type { WebSocketClient } from 'ppm-wasm';
import type { Dispatch, SetStateAction } from 'react';

export interface CustomState<T> {
	value: T;
	setValue: Dispatch<SetStateAction<T>>;
}

export interface SidebarButton {
	userId: string;
	displayName: string;
	newMessages: number;
}

export interface User {
	userId: string;
	displayName: string;
	newMessages: number;
	status: 'online' | 'offline';
}

export interface UserMessage {
	type: 'UserMessage';
	messageId: string;
	text: string;
}

export interface OwnMessage {
	type: 'OwnMessage';
	messageId: string;
	text: string;
	status: 'pending' | 'sent' | 'failed';
}

export type Message = UserMessage | OwnMessage;

export interface AppState {
	ws: WebSocketClient;
	sidebar: CustomState<SidebarButton[]>;
	user: CustomState<User>;
	messages: CustomState<Message[]>;
}
