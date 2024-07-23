import { Button, IconButton, Tooltip, Typography } from "@material-tailwind/react"
import { IconCircleFilled, IconLayoutSidebar, IconMessagePlus, IconSettings } from "@tabler/icons-react"

import { useUserDataContext } from "~/context/userData.tsx";
import { useCurrentConversationContext } from "~/context/current.tsx";

function ConvButton({ contactId, name, newMesageCount }: { contactId: string, name: string, newMesageCount: number }) {
  const { contacts: { contacts } } = useUserDataContext();
  const { id: { id, setId }, displayName: { setDisplayName }, messages: { setMessages } } = useCurrentConversationContext();

  function changeConv() {
    setId(contactId)
    setDisplayName(name)
    setMessages(contacts[contactId] ? contacts[contactId].messages : [])
  }

  return <div>
    <Button {...(id !== contactId ? { color: 'white', variant: 'text' } : {})} className="flex items-center justify-between" fullWidth onClick={changeConv}>
      {name}
      {newMesageCount && <Tooltip content={`${newMesageCount} new messages`} className="bg-gray-800" ><IconCircleFilled color="white" size={10} /></Tooltip>}
    </Button>
  </div>
}

export function Sidebar() {
  const { contacts: { contacts } } = useUserDataContext();

  return (
    <div className="bg-side-bar w-60 p-3 flex flex-col justify-between gap-3">
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
          <Typography variant="h6" color="white">Conversations</Typography>
          {Object.entries(contacts).map(({ 1: conv }) =>
            <ConvButton key={conv.contactId} contactId={conv.contactId} name={conv.displayName} newMesageCount={conv.newMessageCount} />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <IconButton color="white" variant="text">
          <IconSettings />
        </IconButton>
      </div>
    </div>
  )
}
