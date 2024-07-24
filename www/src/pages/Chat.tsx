import { useEffect, useRef } from 'react';

import { MessageInput } from '~/components/MessageInput.tsx';
import { MessagesContainer } from '~/components/MessagesContainer.tsx';
import { PersonStatus } from '~/components/PersonStatus.tsx';
import { Sidebar } from '~/components/Sidebar.tsx';
import { UserIcon } from '~/components/UserIcon.tsx';

import { AppStateContextProvider } from '~/context/appState.provider.tsx';
import { WSContextProvider } from '~/context/webSocket.provider.tsx';
import { useAppStateContext } from '~/context/appState.loader.ts';

function MainHeader() {
	return (
		<div className="flex items-center justify-between">
			<PersonStatus />
			<UserIcon />
		</div>
	);
}

function MainInterface() {
	const {
		messages: { messages }
	} = useAppStateContext();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			<div className="flex h-screen">
				<Sidebar />
				<main className="flex flex-1 flex-col gap-3 bg-gray-900 p-3">
					<MainHeader />
					<MessagesContainer ref={containerRef} />
					<MessageInput />
				</main>
			</div>
		</>
	);
}

export function Chat() {
	return (
		<AppStateContextProvider>
			<WSContextProvider>
				<MainInterface />
			</WSContextProvider>
		</AppStateContextProvider>
	);
}
