import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { supabase } from '~/lib/Store';
import { FaUpload } from 'react-icons/fa';

const STORAGE_BUCKET = 'avatars';

interface ProfilePictureProps {
    avatar: string;
    setAvatar: Dispatch<SetStateAction<string | null>>;
    username: string;
    userId: string;
}

const ProfilePicture = ({ avatar, setAvatar, username, userId }: ProfilePictureProps) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        const fileExtension = file.name.split('.').pop();
        const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(`${userId}.${fileExtension}`, file, {
            cacheControl: '3600',
            upsert: true,
        });
        if (error) {
            console.error(error);
        } else {
            const publicUrl = `https://xtfywqvybzosyisgztuw.supabase.co/storage/v1/object/public/avatars/${userId}.${fileExtension}`;
            console.log(publicUrl);
            setAvatar(publicUrl);
            const { data: userData, error: userError } = await supabase.from('users').update({ avatar: publicUrl }).eq('id', userId);
            if (userError) {
                console.error(userError);
            }
        }
    };

    return (
        <label
            className="flex items-center relative w-fit"
            htmlFor="avatar-input"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Image
                src={avatar || `https://www.gravatar.com/avatar/${username}?d=identicon`}
                alt={avatar || `https://www.gravatar.com/avatar/${username}?d=identicon`}
                height={32}
                width={32}
                className="w-8 h-8 rounded-full cursor-pointer aspect-square"
            />
            <div className={`${isHovering ? 'block' : 'block md:hidden'} absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer`}>
                    <FaUpload size={16} className="text-white" />
                </div>
            <input type="file" id="avatar-input" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </label>
    );
};

export default ProfilePicture;