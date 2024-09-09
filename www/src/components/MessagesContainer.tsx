import { Check, MessageSquareMore, Paperclip, Send } from 'lucide-react';
import { leapfrog } from 'ldrs';
import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button.tsx';
import { Textarea } from '~/components/ui/textarea.tsx';
import { useChatContext } from '~/context/chat/loader.ts';
import { cn } from '~/lib/utils.ts';

leapfrog.register();

function StatusIcon({ isLoading, size = 12 }: { isLoading: boolean; size?: number }) {
	return isLoading ? (
		<span className="self-end">
			<l-leapfrog size={size} speed={1} color={'white'} />
		</span>
	) : (
		<Check size={size} className="self-end" />
	);
}

export function MessagesContainer() {
	const { selectedUser, wasmState } = useChatContext();

	const [text, setText] = useState<string>();

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [selectedUser.messages]);

	function handleClick() {
		if (text) {
			// const _msg = newOwnMessage(text) as OwnMessage;

			// pass to rust to update the active conversation state
			//messages.setValue([...messages, msg]);
			setText('');

			wasmState.sendMessage(text);
		}
	}

	return selectedUser.info ? (
		<>
			<div className="flex-1 overflow-y-auto">
				<div className="flex flex-col">
					{selectedUser.messages.map(msg => (
						<div className={cn('flex', msg.type === 'ownMessage' && 'justify-end')} key={msg.messageId}>
							<div
								className={cn(
									'flex items-center gap-2 p-4',
									msg.type === 'ownMessage' && 'max-w-[70%] rounded-lg bg-zinc-900'
								)}
							>
								<p>{msg.text}</p>
								{msg.type === 'ownMessage' && <StatusIcon isLoading={!msg.isSent} />}
							</div>
						</div>
					))}
					<div ref={bottomRef} />
				</div>
			</div>
			<div className="mx-auto flex w-full max-w-[70%] items-center justify-center gap-4">
				<Button variant="ghost">
					<Paperclip />
				</Button>
				<Textarea
					value={text}
					onChange={e => setText(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' && text) {
							handleClick();
						}
					}}
					rows={1}
					contentEditable={true}
					placeholder="Message..."
					className="resize-none"
				/>
				<Button variant="ghost" onClick={handleClick}>
					<Send />
				</Button>
			</div>
		</>
	) : (
		<div className="flex h-full w-full items-center justify-center">
			<MessageSquareMore className="size-12" />
		</div>
	);
}
