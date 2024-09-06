import { Package2 } from 'lucide-react';

import { Badge } from '~/components/ui/badge.tsx';
import { Button } from '~/components/ui/button.tsx';
import { cn } from '~/lib/utils.ts';
import { useAppStateContext } from '~/context/appState.loader';

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

export function Sidebar() {
	const { generalState } = useAppStateContext();

	return (
		<div className="hidden border-r bg-muted/40 md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<span className="flex items-center gap-2 font-semibold">
						<Package2 className="h-6 w-6" />
						<span className="">LOGO</span>
					</span>
				</div>
				<nav className="flex flex-1 flex-col gap-1.5">
					{generalState.map(data => (
						<PersonButton
							key={data.userId}
							userId={data.userId}
							displayName={data.displayName}
							unreadCount={data.unreadCount}
						/>
					))}
				</nav>
			</div>
		</div>
	);
}
