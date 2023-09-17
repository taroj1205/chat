import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel, fetchUser } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import { useRouter } from 'next/router'
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa'
import ProfilePicture from './ProfilePicture'
import Username from './Username'

export default function Layout(props) {
  const { signOut, user, userRoles } = useContext(UserContext)
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [userId, setUserId] = useState(null)
  const [sidebarStyle, setSidebarStyle] = useState('hidden')

  useEffect(() => {
    if (!user) return
    fetchUser(user.id, (data) => {
      console.log(data)
      setUsername(data.username)
      setAvatar(data.avatar)
      setUserId(data.id)
    })
  }, [user])

  console.log(user);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const newChannel = async () => {
    const slug = prompt('Please enter channel name')
    if (slug) {
      addChannel(slugify(slug), user.id)
    }
  }

  const toggleMenu = () => {
    console.log(props)
    props.setExpanded(!props.expanded)
    setSidebarStyle(sidebarStyle === 'hidden' ? 'w-screen' : 'hidden')
  };

  return (
    <main className="main flex w-[var(--vvw)] overflow-hidden h-[var(--vvh)]">
      {/* Sidebar */}
      <button
        className={`text-black dark:text-white text-2xl p-2 focus:outline-none md:hidden ${sidebarStyle === 'hidden' ? 'fixed' : 'hidden'} top-1 left-1 z-10`}
        onClick={toggleMenu}
      >
        <FaBars />
      </button>
      <nav
        className={`z-[2] fixed md:relative md:max-w-[300px] left-0 ${sidebarStyle} top-0 h-full w-[var(--vvw)] md:block bg-slate-400 dark:bg-gray-900 text-gray-100 overflow-auto`}
        style={{ minWidth: 150, maxHeight: '100vh' }}
      >
        <button
          className={`text-black dark:text-white p-2 focus:outline-none text-2xl md:hidden ${sidebarStyle === 'hidden' ? 'hidden' : 'relative'} top-1 left-1 z-10`}
          onClick={toggleMenu}
        >
          <FaTimes />
        </button>
        <div className="p-2">
          <hr className="m-2" />
          <div className="p-2 flex flex-col space-y-2">
            {username && userId ? (
              <div className='flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0'>
                <span className="mr-2"><ProfilePicture avatar={avatar} setAvatar={setAvatar} username={username} userId={userId} /></span>
                <span className="w-full"><Username username={username} userId={userId} setUsername={setUsername} /></span>
              </div>
            ) : (
              null
            )}
            {/* <Link
              className="text-center bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              href={"/settings"}
            >
              Settings
            </Link> */}
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              onClick={() => {
                user && signOut()
                !user && router.push('/')
              }}
            >
              {user ? 'Sign out' : 'Login'}
            </button>
          </div>
          <hr className="m-2" />
          <h4 className="font-bold">Channels</h4>
          <ul className="channel-list">
            {props.channels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id.toString() === props.activeChannelId}
                user={user}
                userRoles={userRoles}
              />
            ))}
            {userRoles.includes('admin') && (
              <li>
                <button
                  className='flex items-center justify-center w-full py-2 px-4 text-gray-500 hover:text-white hover:bg-gray-700 transition duration-300 ease-in-out'
                  onClick={newChannel}
                >
                  <FaPlus />
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Messages */}
      <div className="fixed md:relative z-[1] w-[var(--vvw] flex-1 bg-slate-200 dark:bg-gray-800 text-black dark:text-white" style={{ height: 'var(--vvh)' }}>{props.children}</div>
    </main>
  )
}

const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
  <li className="flex items-center">
    <Link
      href={`/channels/${channel.id}`}
      className={`flex items-center w-full py-2 px-4 ${isActiveChannel ? 'bg-gray-700 font-bold text-white' : 'text-gray-500 hover:text-white hover:bg-gray-700 transition duration-300 ease-in-out'}`}
    >
      <span className="flex-grow ml-2">{channel.slug}</span>
      {channel.id !== 1 && (channel.created_by === user?.id || userRoles.includes('admin')) && (
        <button onClick={(e) => {
          e.preventDefault()
          deleteChannel(channel.id)
        }}>
          <TrashIcon />
        </button>
      )}
    </Link>
  </li>
);
