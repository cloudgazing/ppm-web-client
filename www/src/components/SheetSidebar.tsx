import { Menu, Package2 } from 'lucide-react';

import { Button } from '~/components/ui/button.tsx';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet.tsx';
import { Badge } from '~/components/ui/badge.tsx';
import { useAppStateContext } from '~/context/appState.loader.ts';
import { cn } from '~/lib/utils.ts';

function PersonButton({
	userId,
	displayName,
	unreadCount,
}: {
	userId: string;
	displayName: string;
	unreadCount: number;
}) {
	const { wasmState, openUserInfo } = useAppStateContext();

	function changeConv() {
		wasmState.changeConversation(userId);
	}

	return (
		<Button
			variant={openUserInfo?.userId === userId ? 'default' : 'ghost'}
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
	const { generalState } = useAppStateContext();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="shrink-0 md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					<span className="flex items-center gap-2 text-lg font-semibold">
						<Package2 className="h-6 w-6" />
						<span className="sr-only">LOGO</span>
					</span>
					{generalState.map(data => (
						<PersonButton
							key={data.userId}
							userId={data.userId}
							displayName={data.displayName}
							unreadCount={data.unreadCount}
						/>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
