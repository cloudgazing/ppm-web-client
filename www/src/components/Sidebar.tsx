import { Card, Chip, IconButton, List, ListItem, ListItemSuffix, Typography } from '@material-tailwind/react';
import { IconLayoutSidebar, IconMessagePlus } from '@tabler/icons-react';

import { useAppStateContext } from '~/context/appState.loader.ts';

function SidebarButton({
	userId,
	displayName,
	newMessages
}: {
	userId: string;
	displayName: string;
	newMessages: number;
}) {
	const { user } = useAppStateContext();

	function changeConv() {
		user.setValue({ userId, displayName, newMessages: 0, status: 'online' });
	}

	return (
		<ListItem selected={user.value.userId === userId} onClick={changeConv} className="bg-transparent text-white">
			{displayName}
			{newMessages && (
				<ListItemSuffix>
					<Chip value={newMessages} size="sm" variant="ghost" color="light-blue" className="rounded-full" />
				</ListItemSuffix>
			)}
		</ListItem>
	);
}

export function Sidebar() {
	const { sidebar } = useAppStateContext();

	return (
		<div className="w-64 bg-side-bar">
			<Card color="transparent" shadow={false} className="w-full max-w-[20rem] p-4 text-white">
				<div className="flex justify-between">
					<IconButton color="white" variant="text">
						<IconLayoutSidebar />
					</IconButton>
					<IconButton color="white" variant="text" className="ml-auto">
						<IconMessagePlus />
					</IconButton>
				</div>
				<div className="px-2 py-4">
					<Typography variant="h5">Conversations</Typography>
				</div>
				<List className="px-0 pr-4">
					{sidebar.value.map(button => (
						<SidebarButton
							key={button.userId}
							userId={button.userId}
							displayName={button.displayName}
							newMessages={button.newMessages}
						/>
					))}
				</List>
			</Card>
		</div>
	);
}
