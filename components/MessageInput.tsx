import { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaReply, FaTimes } from 'react-icons/fa'

const MessageInput = ({ onSubmit, replyingTo, setReplyingTo }) => {
  const [messageText, setMessageText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>()
  const [isHovering, setIsHovering] = useState(false)

  const submitOnEnter = () => {
    if (messageText.trim().length === 0 || messageText.length > 1000) {
      inputRef.current.classList.add('shake-animation')
      inputRef.current.focus()
      setTimeout(() => {
        inputRef.current.classList.remove(
          'shake-animation'
        );
      }, 500);
    } else {
      onSubmit(messageText, replyingTo.id)
      setMessageText('')
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }

  const handleInput = (event) => {
    const target = event.target;
    let rows = target.value.split('\n').length;

    if (rows > 5 && window.innerWidth < 640) {
      rows = 5;
    } else if (rows > 10) {
      rows = 10;
    }

    target.rows = rows;
  }

  useEffect(() => {
    if (replyingTo) { inputRef.current.focus() }
  }, [replyingTo])

  return (
    <div className='flex flex-grow flex-col'>
      {replyingTo && (
        <div className="bg-gray-400 dark:bg-gray-900 rounded-tl-lg rounded-tr-lg text-gray-700  dark:text-gray-300 px-4 py-2 w-full flex items-center space-x-2">
          <div
            className="flex-shrink-0 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setReplyingTo(null)}
          >
            {isHovering ? (
              <FaTimes className="text-gray-500 dark:text-gray-400" />
            ) : (
              <FaReply className="text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="flex-shrink-0">
            <img
              src={replyingTo.author.avatar || `https://www.gravatar.com/avatar/${replyingTo.author.username}?d=identicon`}
              alt={replyingTo.author.username}
              className="w-8 h-8 rounded-full aspect-square object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="text-sm font-semibold">{replyingTo.author.username}</div>
            <div className="text-sm">{replyingTo.message}</div>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cusror-pointer"
            onClick={() => setReplyingTo(null)}
          >
            <FaTimes />
          </button>
        </div>
      )}
      <div className='w-full flex flex-row'>
        <textarea
          className={`shadow resize-none text-black dark:text-white appearance-none border-none ${replyingTo ? 'rounded-bl-lg' : 'rounded-l-lg'} w-full py-2 px-3 bg-white dark:bg-gray-950 leading-tight focus:outline-none focus:border focus:border-teal-500 focus:shadow-outline`}
          placeholder="Send a message"
          value={messageText}
          ref={inputRef}
          rows={1}
          onInput={handleInput}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            const target = e.target as HTMLTextAreaElement;
            console.log(e.key === 'Enter' && !e.shiftKey && target.value.trim().length === 0);
            if (e.key === 'Enter' && !e.shiftKey && target.value.trim().length > 0) {
              e.preventDefault()
              submitOnEnter()
              inputRef.current.rows = 1
            } else if (e.key === 'Enter' && !e.shiftKey && target.value.trim().length === 0) {
              e.preventDefault()
            }
          }}
          autoFocus={true}
        />
        <button
          id="send-button"
          aria-label='Send message'
          onClick={submitOnEnter}
          className={`w-12 bottom-0 right-0 sm:w-auto min-w-[56px] h-11 ${replyingTo ? 'rounded-br-lg' : 'rounded-r-lg'} bg-green-500 cursor-pointer flex items-center justify-center`}
        >
          <FaPaperPlane className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default MessageInput
