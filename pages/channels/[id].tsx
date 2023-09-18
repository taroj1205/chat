import Layout from '~/components/Layout'
import Message from '~/components/Message'
import MessageInput from '~/components/MessageInput'
import { useRouter } from 'next/router'
import { useStore, addMessage, fetchUser } from '~/lib/Store'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'

const ChannelsPage = () => {
  const router = useRouter();
  const { user, authLoaded } = useContext(UserContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [username, setUsername] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [userId, setUserId] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)

  const channelId = router.query.id as string;
  const { messages, channels } = useStore({ channelId });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const channelExists = channels.some((channel) => channel.id === Number(channelId));
    if (!channelExists) {
      router.push('/channels/1');
    }
  }, [channels, channelId]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!user) {
      router.push('/auth');
    }
    fetchUser(user.id, (data) => {
      console.log(data)
      setUsername(data.username)
      setAvatar(data.avatar)
      setUserId(data.id)

      if (user.email === data.username) {
        const newUsername = prompt('Please enter your username');
        setUsername(newUsername);
      }

    })
  }, [user, authLoaded]);

  return (
    <Layout channels={channels} activeChannelId={channelId} expanded={expanded} setExpanded={setExpanded}>
      <div className="relative h-[var(--vvh)]">
        <div className="Messages h-[var(--vvh)] w-[var(--vvw)] md:w-full pb-16  bg-gray-200 dark:bg-gray-900">
          <div className="p-2 pl-1 overflow-y-auto w-full break-all">
            {messages.map((message) => {
              const replyingToMessage = messages.find((m) => m.id === message.replying_to);
              console.log(replyingToMessage);
                return <Message key={message.id} message={message} setReplyingTo={setReplyingTo} replyingToMessage={replyingToMessage} />;
            })}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 fixed md:absolute bottom-0 left-0 w-full">
          <MessageInput replyingTo={replyingTo} setReplyingTo={setReplyingTo} onSubmit={async (text) => {
            if (text.trim().length === 0) return;
            await addMessage(text, channelId, user.id, replyingTo.id);
            setReplyingTo(null);
          }} />
        </div>
      </div>
    </Layout>
  );
};

export default ChannelsPage;
