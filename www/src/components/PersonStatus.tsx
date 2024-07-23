import { Tooltip, Typography } from "@material-tailwind/react";
import { IconCloud, IconCloudOff } from "@tabler/icons-react";

import { useCurrentConversationContext } from "~/context/current.tsx";

export function PersonStatus() {
	const { id: { id }, displayName: { displayName }, isOnline: { isOnline } } = useCurrentConversationContext();

	return id ?
	<div className="flex items-center gap-3">
		<Typography variant="h6" color="white">{displayName}</Typography>
		<Tooltip placement="right" content={isOnline ? "online" : "offline"} className="bg-gray-800">
			{isOnline ? <IconCloud color="white" /> : <IconCloudOff color="white" />}
		</Tooltip>
	</div> : <div></div>
}
