import { IconButton, Textarea } from '@material-tailwind/react';
import { IconPaperclip, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppStateContext } from '~/context/appState.loader.ts';
import { useWSClientContext } from '~/context/webSocket.loader.ts';

export function MessageInput() {
	const {
		user: {
			user: { userId }
		},
		messages: { messages, setMessages }
	} = useAppStateContext();
	const { WSClient } = useWSClientContext();

	const [text, setText] = useState<string>();

	function handleClick() {
		if (text) {
			const newMessage = { type: 'OwnMessage', text, messageId: uuidv4() } as const;
			setMessages([...messages, newMessage]);
			if (userId) {
				WSClient.sendMessage(userId, text);
			}
			setText('');
		}
	}

	return (
		<div className="flex justify-center">
			<div className="flex w-full max-w-[80%] flex-row items-center gap-2 rounded-[99px] bg-gray-800 p-2">
				<IconButton color="white" variant="text">
					<IconPaperclip />
				</IconButton>
				<Textarea
					value={text}
					onChange={e => setText(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleClick();
						}
					}}
					rows={1}
					placeholder="Type a message..."
					className="h-full min-h-full !border-0 text-white focus:border-transparent"
					containerProps={{
						className: 'grid h-full'
					}}
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
				/>
				<div>
					<IconButton color="white" variant="text" className="rounded-full">
						<IconSend onClick={handleClick} />
					</IconButton>
				</div>
			</div>
		</div>
	);
}
