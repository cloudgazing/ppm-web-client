import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Message } from '~/types.ts';

import { useLocalStorage } from 'usehooks-ts';

import { createCustomContext } from '~/context/custom.ts';

type UserIdState = {
	userId: string;
	setUserId: Dispatch<SetStateAction<string>>;
}

type DisplayNameState = {
	displayName: string;
	setDisplayName: Dispatch<SetStateAction<string>>;
}

type Contact = {
	contactId: string;
	displayName: string;
	messages: Message[];
	newMessageCount: number;
}

type ContactsState = {
	contacts: Record<string, Contact>;
	setContacts: Dispatch<SetStateAction<Record<string, Contact>>>;
}

type UserData = {
	id: UserIdState;
	name: DisplayNameState;
	contacts: ContactsState;
};

const [useUserDataContext, ContextProvider] = createCustomContext<UserData>();

function UserDataContextProvider({ children }: { children: ReactNode }) {
	const [userId, setUserId] = useLocalStorage<string>('user-id', 'temporary-user-id');
	const [displayName, setDisplayName] = useLocalStorage<string>('display-name', 'User Name');
	const [contacts, setContacts] = useLocalStorage<Record<string, Contact>>('contacts',
		{
			'contact-id-1': {
				contactId: 'contact-id-1',
				displayName: 'John Doe',
				messages: [
					{ id: 'message-id-1', text: 'Hello', isOwnMessage: true },
					{ id: 'message-id-2', text: 'Hi', isOwnMessage: false },
					{ id: 'message-id-3', text: 'How are you?', isOwnMessage: true },
					{ id: 'message-id-4', text: 'I\'m fine', isOwnMessage: false },
					{ id: 'message-id-5', text: 'What\'s up?', isOwnMessage: true },
					{ id: 'message-id-6', text: 'Nothing much just got done today :)', isOwnMessage: false },
					{ id: 'message-id-7', text: 'that\'s great I\'m glad to hear that. I was just wondering if you could help me with something', isOwnMessage: true },
					{ id: 'message-id-8', text: 'Sure, what do you need help with?', isOwnMessage: false },
				],
				newMessageCount: 4,
			},
			'contact-id-2': {
				contactId: 'contact-id-2',
				displayName: 'Marry Anne',
				messages: [
					{ id: 'message-id-10', text: 'Hello', isOwnMessage: true },
					{ id: 'message-id-11', text: 'Hi', isOwnMessage: false },
					{ id: 'message-id-12', text: 'How are you?', isOwnMessage: true },						
					{ id: 'message-id-13', text: 'I\'m fine', isOwnMessage: false },
					{ id: 'message-id-14', text: 'What\'s up?', isOwnMessage: true },
				],
				newMessageCount: 3,
			},
			'contact-id-3': {
				contactId: 'contact-id-3',
				displayName: 'Santa Claus',
				messages: [
					{ id: 'message-id-20', text: 'Hello', isOwnMessage: true },
					{ id: 'message-id-21', text: 'Hi', isOwnMessage: false },
					{ id: 'message-id-22', text: 'How are you?', isOwnMessage: true },						
					{ id: 'message-id-23', text: 'I\'m fine', isOwnMessage: false },
					{ id: 'message-id-24', text: 'What\'s up?', isOwnMessage: true },
					{ id: 'message-id-25', text: 'It has been a while since I have been up. I\'m just feeling a bit tired and I was wondering if you could help me with something', isOwnMessage: false },
					{ id: 'message-id-26', text: 'Sure, what do you need help with?', isOwnMessage: true },
				],
				newMessageCount: 10,
			},
		}
	);

	return <ContextProvider value={{ id: { userId, setUserId }, name: { displayName, setDisplayName }, contacts: { contacts, setContacts }}}>{children}</ContextProvider>;
}

export { UserDataContextProvider, useUserDataContext };

