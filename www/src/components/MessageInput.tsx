import { IconButton, Textarea } from "@material-tailwind/react";
import { IconPaperclip, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import { useCurrentConversationContext } from "~/context/current.tsx";
import { useUserDataContext } from "~/context/userData.tsx";
import { useWSClientContext } from "~/context/webSocket.tsx";

export function MessageInput() {
  const { contacts: { contacts, setContacts } } = useUserDataContext();
  const { id: {id}, messages: { messages, setMessages } } = useCurrentConversationContext();
  const { WSClient } = useWSClientContext();

  const [text, setText] = useState<string>();

  function handleClick() {
    if (text) {
      setMessages([...messages, { text, isOwnMessage: true, id: uuidv4() }]);
      if (id) {
        const change = contacts[id]?.messages.push({ text, isOwnMessage: true, id: uuidv4() });
        if (change !== undefined) {
          const newContacts = { ...contacts };
          setContacts(newContacts);
        }
        WSClient.sendMessage(id, text);
      }
      setText("");
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-[80%] flex-row items-center gap-2 rounded-[99px] p-2 bg-gray-800">
        <IconButton color="white" variant="text">
          <IconPaperclip />
        </IconButton>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleClick();
            }
          }}
          rows={1}
          placeholder="Type a message..."
          className="min-h-full h-full !border-0 focus:border-transparent text-white"
          containerProps={{
            className: "grid h-full",
          }}
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <div>
          <IconButton color="white" variant="text" className="rounded-full">
            <IconSend onClick={handleClick} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
