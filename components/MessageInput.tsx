import { useState, useRef, useEffect } from 'react'
import {FaPaperPlane} from 'react-icons/fa'

const MessageInput = ({ onSubmit }) => {
  const [messageText, setMessageText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>()
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
      const isMobileDevice =
        mobileMediaQuery.matches ||
        typeof window.orientation !== 'undefined';
      setIsMobile(isMobileDevice);
    };

    const setVisualViewport = () => {
      const vv = document.documentElement;
      if (vv) {
        const root = document.documentElement;
        root.style.setProperty(
          '--vvw',
          `${document.documentElement.clientWidth}px`
        );
        root.style.setProperty(
          '--vvh',
          `${window.innerHeight}px`
        );
        checkIfMobile();
      }
    };
    setVisualViewport();

    checkIfMobile();

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (document.documentElement) {
        document.documentElement.removeEventListener(
          'resize',
          setVisualViewport
        );
      }
    };
  }, []);

  const submitOnEnter = () => {
    if (messageText.trim().length === 0) {
      inputRef.current.classList.add('shake-animation')
      inputRef.current.focus()
      setTimeout(() => {
        inputRef.current.classList.remove(
          'shake-animation'
        );
      }, 500);
    } else {
      onSubmit(messageText)
      setMessageText('')
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }

  const handleInput = (event) => {
    const target = event.target;
    let rows = target.value.split('\n').length;

    if (rows > 5 && isMobile) {
      rows = 5;
    } else if (rows > 10) {
      rows = 10;
    }

    target.rows = rows;
  }

  return (
    <div className='flex flex-grow'>
      <textarea
        className="shadow resize-none text-black dark:text-white appearance-none border-none rounded-l-lg w-full py-2 px-3 bg-gray-300 dark:bg-gray-900 leading-tight focus:outline-none focus:border focus:border-teal-500 focus:shadow-outline"
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
      />
      <button
        id="send-button"
        aria-label='Send message'
        onClick={submitOnEnter}
        className="w-12 bottom-0 right-0 sm:w-auto min-w-[56px] h-11 rounded-r-lg bg-green-500 cursor-pointer flex items-center justify-center"
      >
        <FaPaperPlane className="text-white" />
      </button>
    </div>
  )
}

export default MessageInput
