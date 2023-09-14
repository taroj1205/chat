import { useContext } from 'react'
import UserContext from '~/lib/UserContext'
import { deleteMessage } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'

const Message = ({ message }) => {
  const { user, userRoles } = useContext(UserContext)

  const formatSentOn = (sent_on: string) => {
    const now = new Date()
    const messageDate = new Date(sent_on)

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }

    if (now.toDateString() === messageDate.toDateString()) {
      return `Today at ${messageDate.toLocaleString(navigator.language, options)}`
    } else {
      const day = messageDate.getDate().toString().padStart(2, '0')
      const month = (messageDate.getMonth() + 1).toString().padStart(2, '0')
      const year = messageDate.getFullYear().toString().substr(-2)
      return `${day}/${month}/${year} ${messageDate.toLocaleString(navigator.language, options)}`
    }
  }

  return (
    <div className="py-1 flex items-center space-x-2">
      <div className="text-gray-100 w-4">
        {(user?.id === message.user_id ||
          userRoles.some((role) => ['admin', 'moderator'].includes(role))) && (
            <button onClick={() => deleteMessage(message.id)}>
              <TrashIcon />
            </button>
          )}
      </div>
      <div>
        <div className="flex items-center">
          <span className="text-sm font-semibold">
            {message.author.username}
          </span>
          <span className="ml-1 text-xs text-gray-500">
            <span className="ml-1 text-xs text-gray-500">
              {formatSentOn(message.inserted_at)}
            </span>
          </span>
        </div>
        <p className="text-white">{message.message}</p>
      </div>
    </div>
  )
}

export default Message
