import Layout from '~/components/Layout'
import Message from '~/components/Message'
import MessageInput from '~/components/MessageInput'
import { useRouter } from 'next/router'
import { useStore, addMessage } from '~/lib/Store'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'

const ChannelsPage = (props) => {
  const router = useRouter()
  const { user, authLoaded, signOut } = useContext(UserContext)
  const messagesEndRef = useRef(null)
  const [expanded, setExpanded] = useState(false)

  // Else load up the page
  const { id: channelId } = router.query
  const { messages, channels } = useStore({ channelId })

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  // redirect to public channel when current channel is deleted
  useEffect(() => {
    if (!channels.some((channel) => channel.id === Number(channelId))) {
      router.push('/channels/1')
    }
  }, [channels, channelId])

  useEffect(() => {
    if (!user && authLoaded) router.push('/auth')
  }, [authLoaded])

  // Render the channels and messages
  return (
    <Layout channels={channels} activeChannelId={channelId} expanded={expanded} setExpanded={setExpanded}>
      <div className="relative" style={{height: 'var(--vvh)'}}>
        <div className="Messages h-[var(--vvh)] w-[var(--vvw)] pb-16">
          <div className="p-2 overflow-y-auto">
            {messages.map((x) => (
              <Message key={x.id} message={x} />
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className={`p-2 ${!expanded ? 'fixed bottom-0 left-0 w-full' : 'absolute'} absolute bottom-0 left-0 w-full`}>
          <MessageInput onSubmit={async (text) => {
            if (text.trim().length === 0) return
            addMessage(text, channelId, user.id)
          }} />
        </div>
      </div>
    </Layout>
  )
}

export default ChannelsPage
