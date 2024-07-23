import { Card } from "@material-tailwind/react";
import { IconUser } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "~/lib/utils.ts";
import { useCurrentConversationContext } from "~/context/current.tsx";

interface MessageContainerProps extends ComponentPropsWithoutRef<'div'> { }

export const MessagesContainer = forwardRef<HTMLDivElement, MessageContainerProps>(({ className, ...props }, ref) => {
	const { id: { id }, messages: { messages } } = useCurrentConversationContext();

	return <div ref={ref} className={cn("flex-1 flex flex-col gap-4 px-20 pb-10 overflow-hidden overflow-y-scroll", className)} {...props}>
		{
			id
				?
				messages.map((msg) =>
					<Card color="transparent" key={msg.id} className={cn("text-white p-3 shadow-none w-fit", msg.isOwnMessage ? "bg-gray-800 self-end max-w-[60%]" : "w-fit flex flex-row gap-3")}>
						{!msg.isOwnMessage && <IconUser className="min-w-fit" />}
						<p>{msg.text}</p>
					</Card>
				)
				:
				<p className="text-xl text-white">Select a person to talk to</p>
		}
	</div>
});
MessagesContainer.displayName = "MessagesContainer";
