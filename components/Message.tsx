import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { fetchUser, deleteMessage, editMessage } from '~/lib/Store'
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css'
import { FaCopy, FaEdit, FaReply, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import AuthorProfile from './AuthorProfile';

const Message = ({ message, setReplyingTo, replyingToMessage }) => {
  const { user, userRoles } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const [isTimeHovered, setTimeHovered] = useState(false);
  const [authorProfilePopup, setAuthorProfilePopup] = useState(false);
  const [username, setUsername] = useState(null)

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

  const replyMessage = (message) => {
    console.log(message)
    setReplyingTo(message)
  }

  return (
    <div
      className={`flex items-center ${message.author.username === (document.getElementById('username') as HTMLInputElement)?.value ? 'rounded-t-2xl rounded-bl-2xl rounded-br-sm' : 'rounded-t-2xl rounded-br-2xl rounded-bl-sm'} rounded-lg ${message.author.username === replyingToMessage?.author.username ? 'bg-yellow-500 dark:bg-yellow-800 hover:bg-opacity-10 dark:hover:bg-opacity-10 bg-opacity-20 dark:bg-opacity-20 rounded-b-lg' : `${isOpen ? 'bg-gray-300 dark:bg-gray-950' : 'hover:bg-gray-300 dark:hover:bg-gray-950'} py-1 space-x-2 transition-colors duration-400`}`}
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
          <MenuItem onClick={() => {
            deleteMessage(message.id)
          }}>
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
        <MenuItem onClick={() => replyMessage(message)}>
          <FaReply className='scale-x-[-1]' /><span className='ml-2'>Reply</span>
        </MenuItem>
      </ControlledMenu>
      <div className='flex flex-col w-full' id={message.id}>
        {replyingToMessage && (
          <Link href={`/channels/${replyingToMessage.channel_id}#${replyingToMessage.id}`} className="rounded-tl-lg rounded-tr-lg text-gray-700 dark:text-gray-300 px-4 py-1 w-full flex items-center">
            <div className='flex flex-row space-x-2 opacity-60 hover:opacity-100'>
              <div
                className="flex-shrink-0 scale-x-[-1] ml-2"
              >
                <FaReply className="text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-shrink-0 flex flex-row space-x-1">
                <Image
                  src={replyingToMessage.author.avatar || `https://www.gravatar.com/avatar/${replyingToMessage.author.username}?d=identicon`}
                  alt={replyingToMessage.author.username}
                  width={50}
                  height={50}
                  className="w-5 h-5 rounded-full aspect-square object-cover"
                />
                <div className="text-sm font-semibold">{replyingToMessage.author.username}</div>
                <div className="text-sm">{replyingToMessage.message}</div>
              </div>
            </div>
          </Link>
        )}
        <div className={`flex flex-row ${message.author.username === replyingToMessage?.author.username ? 'ml-2 mb-1' : ''}`}>
          <div className='flex flex-row mt-1'>
            <AuthorProfile message={message} authorProfilePopup={authorProfilePopup} setAuthorProfilePopup={setAuthorProfilePopup}  />
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
                    <time dateTime={message.author.inserted_at}>{formatSentOn(message.inserted_at)}</time>
                  </span>
                </span>
              </div>
              <p className="text-black dark:text-white break-words">{message.message}</p>
            </div>
          </div>
        </div>
      </div>
      {authorProfilePopup && (
        <div className='absolute top-0 left-0 inset-0 z-10' onClick={() => setAuthorProfilePopup(false)}></div>
      )}
    </div>
  )
}

export default Message
