import { useEffect, useRef } from "react";

import { MessageInput } from "~/components/MessageInput.tsx";
import { MessagesContainer } from "~/components/MessagesContainer.tsx";
import { PersonStatus } from "~/components/PersonStatus.tsx";
import { Sidebar } from "~/components/Sidebar.tsx";
import { UserIcon } from "~/components/UserIcon.tsx";
import { UserDataContextProvider } from "~/context/userData.tsx";
import { CurrentConversationContextProvider, useCurrentConversationContext } from "~/context/current.tsx";
import { WSContextProvider } from "~/context/webSocket.tsx";

function MainHeader() {
	return <div className="flex justify-between items-center">
		<PersonStatus />
		<UserIcon />
	</div>
}

function MainInterface() {
	const { messages: { messages } } = useCurrentConversationContext();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	return <>
		<div className="flex h-screen">
			<Sidebar />
			<main className="bg-gray-900 flex-1 flex flex-col gap-3 p-3">
				<MainHeader />
				<MessagesContainer ref={containerRef} />
				<MessageInput />
			</main>
		</div>
	</>
}

export function Chat() {
	return <CurrentConversationContextProvider>
		<UserDataContextProvider>
			<WSContextProvider>
			<MainInterface />
			</WSContextProvider>
		</UserDataContextProvider>
	</CurrentConversationContextProvider>
}
