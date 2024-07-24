import { Card } from "@material-tailwind/react";
import { IconUser } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "~/lib/utils.ts";
import { useAppStateContext } from "~/context/appState.tsx";

interface MessageContainerProps extends ComponentPropsWithoutRef<'div'> { }

export const MessagesContainer = forwardRef<HTMLDivElement, MessageContainerProps>(({ className, ...props }, ref) => {
	const { user: { user: { userId } }, messages: { messages } } = useAppStateContext();

	return <div ref={ref} className={cn("flex-1 flex flex-col gap-4 px-20 pb-10 overflow-hidden overflow-y-scroll", className)} {...props}>
		{
			userId
				?
				messages.map((msg) =>
					<Card color="transparent" key={msg.messageId} className={cn("text-white p-3 shadow-none w-fit", msg.type === "OwnMessage" ? "bg-gray-800 self-end max-w-[60%]" : "w-fit flex flex-row gap-3")}>
						{msg.type === "UserMessage" && <IconUser className="min-w-fit" />}
						<p>{msg.text}</p>
					</Card>
				)
				:
				<p className="text-xl text-white">Select a person to talk to</p>
		}
	</div>
});
MessagesContainer.displayName = "MessagesContainer";
