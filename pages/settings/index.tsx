import { useState, useContext } from 'react';
import { supabase } from '~/lib/Store';
import UserContext from '~/lib/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const SettingsPage = () => {
    const { user, setUser, authLoaded } = useContext(UserContext);
    const [username, setUsername] = useState(user?.user_metadata?.username || '');
    const router = useRouter();

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ username })
                .eq('id', user.id);

            if (error) {
                console.error(error);
                toast.error('Update failed');
            } else {
                console.log('Updated successfully!');
                toast.success('Updated successfully!');
                setTimeout(() => {
                    router.push('/channels/1');
                }, 3000);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="mb-4">
                <label htmlFor="username" className="block text-black dark:text-white font-medium mb-2">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    className="border-gray-400 text-black dark:text-white border rounded w-full py-2 px-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button
                className="bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white"
                onClick={handleSave}
            >
                Save
            </button>

            {/* Profile Picture */}

            <ToastContainer
                className="text-sm font-bold"
                toastClassName={({ type }) =>
                    type === 'success' ? 'bg-green-500 text-white font-bold' : 'bg-red-500 text-white font-bold'
                }
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default SettingsPage;
