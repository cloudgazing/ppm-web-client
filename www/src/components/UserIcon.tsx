import { IconButton } from '@material-tailwind/react';
import InitialsAvatar from 'react-initials-avatar';

import { useAppStateContext } from '~/context/appState.loader.ts';

export function UserIcon() {
	const {
		user: {
			user: { displayName }
		}
	} = useAppStateContext();

	return (
		<IconButton color="light-blue" variant="gradient" className="rounded-full">
			<InitialsAvatar name={displayName} />
		</IconButton>
	);
}
