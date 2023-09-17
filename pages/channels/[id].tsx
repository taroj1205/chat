import Layout from '~/components/Layout'
import Message from '~/components/Message'
import MessageInput from '~/components/MessageInput'
import { useRouter } from 'next/router'
import { useStore, addMessage } from '~/lib/Store'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'

const ChannelsPage = () => {
  const router = useRouter();
  const { user, authLoaded } = useContext(UserContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

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
    if (!user && authLoaded) {
      router.push('/auth');
    }
  }, [user, authLoaded]);

  return (
    <Layout channels={channels} activeChannelId={channelId} expanded={expanded} setExpanded={setExpanded}>
      <div className="relative h-[var(--vvh)]">
        <div className="Messages h-[var(--vvh)] w-[var(--vvw)] md:w-full pb-16">
          <div className="p-2 pl-1 overflow-y-auto">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 fixed md:absolute bottom-0 left-0 w-full">
          <MessageInput onSubmit={async (text) => {
            if (text.trim().length === 0) return;
            addMessage(text, channelId, user.id);
          }} />
        </div>
      </div>
    </Layout>
  );
};

export default ChannelsPage;
