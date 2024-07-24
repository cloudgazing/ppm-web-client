import { Card } from '@material-tailwind/react';
import { IconUser } from '@tabler/icons-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '~/lib/utils.ts';
import { useAppStateContext } from '~/context/appState.loader.ts';

export const MessagesContainer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
	({ className, ...props }, ref) => {
		const {
			user: {
				user: { userId }
			},
			messages: { messages }
		} = useAppStateContext();

		return (
			<div
				ref={ref}
				className={cn('flex flex-1 flex-col gap-4 overflow-hidden overflow-y-scroll px-20 pb-10', className)}
				{...props}
			>
				{userId ? (
					messages.map(msg => (
						<Card
							color="transparent"
							key={msg.messageId}
							className={cn(
								'w-fit p-3 text-white shadow-none',
								msg.type === 'OwnMessage' ? 'max-w-[60%] self-end bg-gray-800' : 'flex w-fit flex-row gap-3'
							)}
						>
							{msg.type === 'UserMessage' && <IconUser className="min-w-fit" />}
							<p>{msg.text}</p>
						</Card>
					))
				) : (
					<p className="text-xl text-white">Select a person to talk to</p>
				)}
			</div>
		);
	}
);
MessagesContainer.displayName = 'MessagesContainer';
