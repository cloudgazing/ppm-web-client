import { Check, LoaderCircle, MessageSquareMore, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button.tsx';
import { ScrollArea } from '~/components/ui/scroll-area.tsx';
import { Textarea } from '~/components/ui/textarea.tsx';
import { useAppStateContext } from '~/context/appState.loader.ts';
import { cn } from '~/lib/utils.ts';

export function MessagesContainer() {
	const { openUserInfo, messages, wasmState } = useAppStateContext();

	const [text, setText] = useState<string>();

	function handleClick() {
		if (text) {
			// const _msg = newOwnMessage(text) as OwnMessage;

			// pass to rust to update the active conversation state
			//messages.setValue([...messages, msg]);
			setText('');

			wasmState.sendMessage(text);
		}
	}

	return openUserInfo ? (
		<>
			<ScrollArea>
				{messages.map(msg => (
					<div
						className={cn('flex items-center gap-4', msg.type === 'ownMessage' && 'justify-end')}
						key={msg.messageId}
					>
						{msg.type === 'ownMessage' && (!msg.isSent ? <LoaderCircle /> : <Check />)}
						<p>{msg.text}</p>
					</div>
				))}
			</ScrollArea>
			<div className="flex items-center justify-center gap-4">
				<Button variant="ghost">
					<Paperclip />
				</Button>
				<Textarea cols={1} />
				<Button variant="ghost" onClick={handleClick}>
					<Send />
				</Button>
			</div>
		</>
	) : (
		<div className="flex h-full w-full items-center justify-center">
			<MessageSquareMore size="3rem" />
		</div>
	);
}
