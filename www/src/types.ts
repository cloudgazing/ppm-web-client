export type Message = {
	id: string,
	text: string,
	isOwnMessage: boolean,
}

export type Conversation = {
	name: string;
	newMesageCount: number;
	isSelected: boolean;
}
