import type { SidebarButtonProps } from '~/types.ts';

import { Menu } from 'lucide-react';

import { Button } from '~/components/ui/button.tsx';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet.tsx';
import { Badge } from '~/components/ui/badge.tsx';
import { useChatContext } from '~/context/chat/loader.ts';
import { cn } from '~/lib/utils.ts';

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
			className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
			onClick={changeConv}
		>
			<p>{displayName}</p>
			<Badge
				className={cn(
					'ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
					unreadCount <= 0 && 'invisible'
				)}
			>
				{unreadCount}
			</Badge>
		</Button>
	);
}

export function SheetSidebar() {
	const { sidebarContent } = useChatContext();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="shrink-0">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex max-w-60 flex-col">
				<p className="px-4">Conversations</p>
				<nav className="flex flex-col gap-1.5 px-4">
					{sidebarContent.map(p => (
						<SidebarButton key={p.userId} userId={p.userId} displayName={p.displayName} unreadCount={p.unreadCount} />
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
