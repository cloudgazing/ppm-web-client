import { Button, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { IconCircleFilled, IconLayoutSidebar, IconMessagePlus, IconSettings } from '@tabler/icons-react';

import { useAppStateContext } from '~/context/appState.loader.ts';

function ConvButton({ contactId, name, newMesageCount }: { contactId: string; name: string; newMesageCount: number }) {
	const {
		user: { user, setUser }
	} = useAppStateContext();

	function changeConv() {
		setUser({ userId: contactId, displayName: name, newMessages: 0, status: 'online' });
	}

	return (
		<div>
			<Button
				{...(user.userId !== contactId ? { color: 'white', variant: 'text' } : {})}
				className="flex items-center justify-between"
				fullWidth
				onClick={changeConv}
			>
				{name}
				{newMesageCount && (
					<Tooltip content={`${String(newMesageCount)} new messages`} className="bg-gray-800">
						<IconCircleFilled color="white" size={10} />
					</Tooltip>
				)}
			</Button>
		</div>
	);
}

export function Sidebar() {
	const {
		sidebar: { sidebarButtons }
	} = useAppStateContext();

	return (
		<div className="flex w-60 flex-col justify-between gap-3 bg-side-bar p-3">
			<div className="flex flex-col gap-3">
				<div className="flex justify-between">
					<IconButton color="white" variant="text">
						<IconLayoutSidebar />
					</IconButton>
					<IconButton color="white" variant="text">
						<IconMessagePlus />
					</IconButton>
				</div>
				<div className="flex flex-col gap-3">
					<Typography variant="h6" color="white">
						Conversations
					</Typography>
					{sidebarButtons.map(button => (
						<ConvButton
							key={button.userId}
							contactId={button.userId}
							name={button.displayName}
							newMesageCount={button.newMessages}
						/>
					))}
				</div>
			</div>
			<div className="flex justify-end">
				<IconButton color="white" variant="text">
					<IconSettings />
				</IconButton>
			</div>
		</div>
	);
}
