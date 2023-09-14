import { useState } from 'react'
import { supabase } from 'lib/Store'
import { useRouter } from 'next/router'

const Home = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (type, email, password) => {
    try {
      setLoading(true)
      const { error, data: { user } } =
        type === 'LOGIN'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password })
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      setLoading(false)
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (type === 'SIGNUP') alert('Signup successful, confirmation mail should be sent soon!')
      else if (type === 'LOGIN') {
        alert('Login successful!')
        router.push('/channels/1')
      }
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-gray-300">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg bg-white">
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">Email</label>
            <input
              type="email"
              className="block mb-4 appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="font-bold text-grey-darker block mb-2">Password</label>
            <input
              type="password"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                setLoading(true)
                handleLogin('SIGNUP', email, password)
              }}
              disabled={loading}
              className={`bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white ${loading ? 'cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : 'Sign up'}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setLoading(true)
                handleLogin('LOGIN', email, password)
              }}
              disabled={loading}
              className={`border border-indigo-700 text-indigo-700 py-2 px-4 rounded w-full text-center transition duration-150 hover:bg-indigo-700 hover:text-white ${loading ? 'cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
