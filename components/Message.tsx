import { useContext, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { deleteMessage, editMessage } from '~/lib/Store'
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css'
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

const Message = ({ message }) => {
  const { user, userRoles } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const [isTimeHovered, setTimeHovered] = useState(false);

  const formatSentOn = (sent_on: string) => {
    const now = new Date();
    const messageDate = new Date(sent_on);

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    if (isTimeHovered) {
      options.second = 'numeric';
    }

    if (now.toDateString() === messageDate.toDateString()) {
      return `Today at ${messageDate.toLocaleString(navigator.language, options)}`;
    } else if (now.getDate() - messageDate.getDate() === 1) {
      return `Yesterday at ${messageDate.toLocaleString(navigator.language, options)}`;
    } else {
      const day = messageDate.getDate().toString().padStart(2, '0');
      const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
      const year = messageDate.getFullYear().toString().substr(-2);
      return `${day}/${month}/${year} ${messageDate.toLocaleString(navigator.language, options)}`;
    }
  };

  const copyMessage = () => {
    if (!message) return

    navigator.clipboard.writeText(message.message)
  }

  return (
    <div
      className="py-1 flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-900"
      onContextMenu={(e) => {
        if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
    >
      <ControlledMenu
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        direction="right"
        onClose={() => setOpen(false)}
      >
        {(user?.id === message.user_id ||
          userRoles.some((role) => ['admin', 'moderator'].includes(role))) && (
            <MenuItem onClick={() => deleteMessage(message.id)}>
              <FaTrash /><span className='ml-2'>Delete</span>
            </MenuItem>
          )}
        <MenuItem onClick={() => copyMessage()}>
          <FaCopy /><span className='ml-2'>Copy</span>
        </MenuItem>
        {(user?.id === message.user_id &&
          <MenuItem onClick={() => editMessage(message.id, message.message)}>
            <FaEdit /><span className='ml-2'>Edit</span>
          </MenuItem>
        )}
      </ControlledMenu>
      <div className='flex flex-row'>
        <Image src={message.author.avatar || `https://www.gravatar.com/avatar/${message.author.username}?d=identicon`} alt={message.author.username} height={50} width={50} className="w-10 h-10 mr-2 rounded-full aspect-square object-cover" />
        <div>
          <div className="flex items-center">
            <span className="text-sm font-semibold">
              {message.author.username}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              <span
                className="ml-1 text-xs text-gray-500"
                onMouseEnter={() => setTimeHovered(true)}
                onMouseLeave={() => setTimeHovered(false)}
              >
                {formatSentOn(message.inserted_at)}
              </span>
            </span>
          </div>
          <p className="text-black dark:text-white break-words">{message.message}</p>
        </div>
      </div>
    </div>
  )
}

export default Message
