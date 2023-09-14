import { useState, useRef, useEffect } from 'react'
import {FaPaperPlane} from 'react-icons/fa'

const MessageInput = ({ onSubmit }) => {
  const [messageText, setMessageText] = useState('')
  const inputRef = useRef()
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
          `${document.documentElement.clientHeight}px`
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
        className="shadow appearance-none border rounded-l-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Send a message"
        value={messageText}
        ref={inputRef}
        rows={1}
        onInput={handleInput}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim().length > 0) {
            submitOnEnter()
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
