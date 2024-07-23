import { IconButton } from "@material-tailwind/react";
import InitialsAvatar from 'react-initials-avatar';

import { useUserDataContext } from "~/context/userData.tsx";

export function UserIcon() {
	const { name: { displayName } } = useUserDataContext();

	return <IconButton color="light-blue" variant="gradient" className="rounded-full">
		<InitialsAvatar name={displayName} />
	</IconButton>
}
