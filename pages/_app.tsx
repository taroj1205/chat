import '~/styles/style.css'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UserContext from 'lib/UserContext'
import { supabase, fetchUserRoles } from 'lib/Store'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { ThemeSwitcher } from '~/components/ThemeSwitcher'

export default function SupabaseSlackClone({ Component, pageProps }) {
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const router = useRouter()

  useEffect(() => {
    const setVisualViewport = () => {
      const root = document.documentElement;
      root.style.setProperty(
        '--vvw',
        `${window.innerWidth}px`
      );
      root.style.setProperty(
        '--vvh',
        `${window.innerHeight}px`
      );
      console.log(window.innerWidth, window.innerHeight);
    };

    setVisualViewport();

    window.addEventListener('resize', setVisualViewport);

    return () => {
      window.removeEventListener('resize', setVisualViewport);
    };
  }, []);

  useEffect(() => {
    function saveSession(
      /** @type {Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']} */
      session
    ) {
      setSession(session)
      const currentUser = session?.user
      setUser(currentUser ?? null)
      setUserLoaded(!!currentUser)
      if (currentUser) {
        signIn()
        router.push('/channels/1')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => saveSession(session))

    const { subscription: authListener }: any = supabase.auth.onAuthStateChange(async (event, session) => saveSession(session))

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    await fetchUserRoles((userRoles) => setUserRoles(userRoles.map((userRole) => userRole.role)))
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
      </Head>
      <UserContext.Provider
        value={{
          userLoaded,
          user,
          userRoles,
          signIn,
          signOut,
        } as any}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className='fixed z-10 top-1 right-1 transition-colors duration-200'><ThemeSwitcher /></div>
            <Component {...pageProps} />
        </ThemeProvider>
      </UserContext.Provider>
    </>
  )
}
