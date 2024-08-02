import { Card } from '@material-tailwind/react';
import { IconCheck, IconExclamationCircle, IconLoader } from '@tabler/icons-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '~/lib/utils.ts';
import { useAppStateContext } from '~/context/appState.loader.ts';

export const MessagesContainer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
	({ className, ...props }, ref) => {
		const {
			user: {
				value: { userId }
			},
			messages
		} = useAppStateContext();

		return (
			<div
				ref={ref}
				className={cn('flex flex-1 flex-col gap-4 overflow-hidden overflow-y-scroll px-20 pb-10', className)}
				{...props}
			>
				{userId ? (
					messages.value.map(msg =>
						msg.type === 'OwnMessage' ? (
							<div className="flex max-w-[60%] items-center gap-3 self-end text-white" key={msg.messageId}>
								{msg.status === 'pending' ? (
									<IconLoader className="animate-spin" />
								) : msg.status === 'sent' ? (
									<IconCheck />
								) : (
									<IconExclamationCircle />
								)}
								<Card color="transparent" key={msg.messageId} className="w-fit bg-gray-800 p-3 text-white shadow-none">
									<p>{msg.text}</p>
								</Card>
							</div>
						) : (
							<Card
								color="transparent"
								key={msg.messageId}
								className="flex w-fit flex-row gap-3 p-3 text-white shadow-none"
							>
								<p>{msg.text}</p>
							</Card>
						)
					)
				) : (
					<p className="text-xl text-white">Select a person to talk to</p>
				)}
			</div>
		);
	}
);
MessagesContainer.displayName = 'MessagesContainer';
