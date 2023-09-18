import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { supabase } from '~/lib/Store';
import { toast } from 'react-toastify';
import { ControlledMenu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css'
import { FaEdit } from 'react-icons/fa';

interface UsernameProps {
    username: string;
    userId: string;
    setUsername: Dispatch<SetStateAction<string>>;
}

const Username = ({ username, userId, setUsername }: UsernameProps) => {
    // const { setUser } = useContext(UserContext);
    const [initialUsername, setInitialUsername] = useState(username);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
    const [isOpen, setOpen] = useState(false)

    const handleSave = async () => {
        const newUsername = window.prompt('Enter a new username:', username);
        if (newUsername === null) {
            // User cancelled the prompt
            return;
        }

        if (newUsername === initialUsername) {
            const confirmChange = window.confirm('The new username is the same as the current username. Do you still want to update?');
            if (!confirmChange) {
                return;
            }
        }

        try {
            const { error } = await supabase.from('users').update({ username: newUsername }).eq('id', userId);
            if (newUsername.length > 32) {
                alert('Username must be 32 characters or less');
            } else if (error) {
                console.error(error);
                if (error.message.includes('violates unique constraint')) {
                    alert('Username already exists');
                } else {
                    toast.error('Update failed');
                }
            } else {
                console.log('Updated successfully!');
                toast.success('Updated successfully!');
                setUsername(newUsername);
                setInitialUsername(newUsername);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div
            className="flex flex-row w-full text-sm"
            onContextMenu={(e) => {
                if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

                e.preventDefault();
                setAnchorPoint({ x: e.clientX, y: e.clientY });
                setOpen(true);
            }}
            onClick={handleSave}
        >
            <input
                type="text"
                id="username"
                className="border-none text-black dark:text-white bg-inherit hover:bg-slate-700 hover:text-white cursor-pointer rounded w-full py-2 px-3"
                value={username}
                disabled
                onChange={(e) => setUsername(e.target.value)}
            />
            <ControlledMenu
                anchorPoint={anchorPoint}
                state={isOpen ? 'open' : 'closed'}
                direction="right"
                onClose={() => setOpen(false)}
            >
                <MenuItem onClick={handleSave}>
                    <FaEdit /><span className='ml-2'>Edit Username</span>
                </MenuItem>
            </ControlledMenu>
        </div>
    );
};

export default Username;