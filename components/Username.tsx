import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { supabase } from '~/lib/Store';
import { toast } from 'react-toastify';
import UserContext from '~/lib/UserContext';

interface UsernameProps {
    username: string;
    userId: string;
    setUsername: Dispatch<SetStateAction<string>>;
}

const Username = ({ username, userId, setUsername }: UsernameProps) => {
    // const { setUser } = useContext(UserContext);
    const [initialUsername, setInitialUsername] = useState(username);

    const handleSave = async () => {
        try {
            const { error } = await supabase.from('users').update({ username }).eq('id', userId);
            if (error) {
                console.error(error);
                toast.error('Update failed');
            } else {
                console.log('Updated successfully!');
                toast.success('Updated successfully!');
                setUsername(username);
                setInitialUsername(username);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="flex flex-row w-full text-sm">
            <input
                type="text"
                id="username"
                className="border-none text-black dark:text-white rounded w-full py-2 px-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {initialUsername !== username && (
                <button
                    className="bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white h-full"
                    onClick={handleSave}
                >
                    Save
                </button>
            )}
        </div>
    );
};

export default Username;