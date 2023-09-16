import { supabase } from "~/lib/Store"
import styles from './App.module.css'
import { SocialLayout, ThemeSupa, ViewType } from '@supabase/auth-ui-shared'
import { Auth } from '@supabase/auth-ui-react'
import { useContext, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import UserContext from "~/lib/UserContext"
import {useRouter} from "next/router"

const classes: { [key: string]: string } = {
    'rgb(202, 37, 37)': styles['container-redshadow'],
    'rgb(65, 163, 35)': styles['container-greenshadow'],
    'rgb(8, 107, 177)': styles['container-blueshadow'],
    'rgb(235, 115, 29)': styles['container-orangeshadow'],
}

const colors = [
    'rgb(202, 37, 37)',
    'rgb(65, 163, 35)',
    'rgb(8, 107, 177)',
    'rgb(235, 115, 29)',
] as const

const socialAlignments = ['horizontal', 'vertical'] as const

const radii = ['5px', '10px', '20px'] as const

const views: { id: ViewType; title: string }[] = [
    { id: 'sign_in', title: 'Sign In' },
    { id: 'sign_up', title: 'Sign Up' },
    { id: 'magic_link', title: 'Magic Link' },
    { id: 'forgotten_password', title: 'Forgotten Password' },
    { id: 'update_password', title: 'Update Password' },
    { id: 'verify_otp', title: 'Verify Otp' },
]

function App() {
    const [brandColor, setBrandColor] = useState(colors[0] as string)
    const [borderRadius, setBorderRadius] = useState(radii[0] as string)
    const { resolvedTheme, setTheme } = useTheme()
    const [socialLayout, setSocialLayout] = useState<SocialLayout>(socialAlignments[1] satisfies SocialLayout)
    const [view, setView] = useState(views[0])
    const { user, authLoaded, signOut } = useContext(UserContext)
    const router = useRouter()

    useEffect(() => {
        console.log(user)
        if (user) router.push('/channels/1')
    }, [authLoaded])

    return (
        <div className="relative py-2 pb-16 text-black dark:text-white">
            <div className="sm:py-18 gap container relative mx-auto grid grid-cols-6 px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
                <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
                    <div className="relative lg:mx-auto lg:max-w-md">
                        <div className={classes[brandColor]}>
                            <div className="relative rounded-xl px-8 py-12 drop-shadow-sm  bg-slate-100 dark:bg-zinc-900">
                                <div className="mb-6 flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-scale-1200 text-2xl">
                                            Welcome to my website!
                                        </h1>
                                    </div>
                                    <p className="text-auth-widget-test">
                                        Sign in today!
                                    </p>
                                </div>
                                <Auth
                                    supabaseClient={supabase}
                                    view={view.id}
                                    appearance={{
                                        theme: ThemeSupa,
                                        style: {
                                            button: {
                                                borderRadius: borderRadius,
                                                borderColor: 'rgba(0,0,0,0)',
                                            },
                                            input: {
                                                color: resolvedTheme === 'dark' ? 'white' : 'black',
                                            }
                                        },
                                        variables: {
                                            default: {
                                                colors: {
                                                    brand: brandColor,
                                                    brandAccent: `gray`,
                                                },
                                            },
                                        },
                                    }}
                                    providers={['azure', 'github']}
                                    socialLayout={socialLayout[1] as SocialLayout}
                                    theme={resolvedTheme}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App