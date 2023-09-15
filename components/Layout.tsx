import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel, fetchUser } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import { useRouter } from 'next/router'
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa'

export default function Layout(props) {
  const { signOut, user, userRoles } = useContext(UserContext)
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [sidebarStyle, setSidebarStyle] = useState('hidden')

  useEffect(() => {
    if (!user) return
    fetchUser(user.id, (data) => {
      console.log(data)
      setUsername(data.username)
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
    props.setExpanded(!props.expanded)
    setSidebarStyle(sidebarStyle === 'hidden' ? 'w-screen' : 'hidden')
  };

  return (
    <main className="main flex w-screen overflow-hidden" style={{ height: "var(--vvh)" }}>
      {/* Sidebar */}
      <button
        className={`text-white text-2xl p-2 focus:outline-none md:hidden ${sidebarStyle === 'hidden' ? 'fixed' : 'hidden'} top-1 left-1 z-10`}
        onClick={toggleMenu}
      >
        <FaBars />
      </button>
      <nav
        className={`${sidebarStyle} top-0 md:max-w-[30%] w-52 md:block bg-gray-900 text-gray-100 overflow-scroll`}
        style={{ minWidth: 150, maxHeight: '100vh' }}
      >
        <button
          className={`text-white p-2 focus:outline-none text-2xl md:hidden ${sidebarStyle === 'hidden' ? 'hidden' : 'relative'} top-1 left-1 z-10`}
          onClick={toggleMenu}
        >
          <FaTimes />
        </button>
        <div className="p-2">
          <hr className="m-2" />
          <div className="p-2 flex flex-col space-y-2">
            <h6 className="text-xs">User: {username}</h6>
            <Link
              className="text-center bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              href={"/settings"}
            >
              Settings
            </Link>
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
      <div className="flex-1 bg-gray-800" style={{height: 'var(--vvh)'}}>{props.children}</div>
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
