import type { ComponentPropsWithoutRef } from 'react';
import type { SidebarButtonProps } from '~/types.ts';

import { Badge } from '~/components/ui/badge.tsx';
import { Button } from '~/components/ui/button.tsx';
import { cn } from '~/lib/utils.ts';
import { useChatContext } from '~/context/chat/loader.ts';
import { Separator } from '~/components/ui/separator.tsx';

function SidebarButton({ userId, displayName, unreadCount }: SidebarButtonProps) {
	const {
		selectedUser: { info },
		wasmState,
	} = useChatContext();

	function changeConv() {
		wasmState.changeConversation(userId);
	}

	return (
		<Button
			variant={info?.userId === userId ? 'default' : 'ghost'}
			className="flex items-center justify-between text-base"
			onClick={changeConv}
		>
			{displayName}
			<Badge
				variant="secondary"
				className={cn('h-5 w-5 items-center justify-center rounded-full', unreadCount <= 0 && 'invisible')}
			>
				{unreadCount}
			</Badge>
		</Button>
	);
}

export function Sidebar({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	const { sidebarContent } = useChatContext();

	return (
		<div className={cn('bg-muted/40', className)} {...props}>
			<div className="flex h-full max-h-screen flex-col gap-3">
				<div className="flex flex-col gap-1">
					<span className="flex h-14 items-center px-6 text-lg">
						<p>Conversations</p>
					</span>
					<Separator />
				</div>
				<nav className="flex flex-1 flex-col gap-1.5 px-2">
					{sidebarContent.map(p => (
						<SidebarButton key={p.userId} userId={p.userId} displayName={p.displayName} unreadCount={p.unreadCount} />
					))}
				</nav>
			</div>
		</div>
	);
}
