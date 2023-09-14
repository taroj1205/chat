import { createContext, Dispatch, SetStateAction } from 'react'
import { User } from '@supabase/supabase-js'

type UserRole = 'user' | 'admin'

type UserContextType = {
    user: User | null
    userRoles: UserRole[]
    signOut: () => void
    authLoaded: boolean
    setUser: Dispatch<SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
    user: null,
    userRoles: ['user'],
    signOut: () => { },
    authLoaded: false,
    setUser: () => { },
})

export default UserContext