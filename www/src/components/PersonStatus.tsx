import { Tooltip, Typography } from "@material-tailwind/react";
import { IconCloud, IconCloudOff } from "@tabler/icons-react";

import { useAppStateContext } from "~/context/appState.tsx";

export function PersonStatus() {
	const { user: { user: { userId, displayName, status } } } = useAppStateContext();

	return userId ?
	<div className="flex items-center gap-3">
		<Typography variant="h6" color="white">{displayName}</Typography>
		<Tooltip placement="right" content={status} className="bg-gray-800">
			{status === "online" ? <IconCloud color="white" /> : <IconCloudOff color="white" />}
		</Tooltip>
	</div> : <div></div>
}
