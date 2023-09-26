import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';

const AuthorProfile = ({ message, authorProfilePopup, setAuthorProfilePopup, usernameRef }) => {
    // State to control the visibility of the popup
    const [isTimeHovered, setTimeHovered] = useState(false);
    const authorProfileRef = useRef<HTMLDivElement>(null)
    const profilePictureRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (authorProfileRef.current && profilePictureRef.current !== event.target && authorProfileRef.current !== event.target && event.target !== usernameRef.current) {
                setAuthorProfilePopup(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [setAuthorProfilePopup]);

    const formatSentOn = (sent_on) => {
        const now = new Date();
        const messageDate = new Date(sent_on);

        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };

        if (isTimeHovered) {
            options.second = 'numeric';
        }

        if (now.toDateString() === messageDate.toDateString()) {
            return `Today at ${messageDate.toLocaleTimeString(navigator.language, options)}`;
        } else if (now.getDate() - messageDate.getDate() === 1) {
            return `Yesterday at ${messageDate.toLocaleTimeString(navigator.language, options)}`;
        } else {
            const day = messageDate.getDate().toString().padStart(2, '0');
            const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
            const year = messageDate.getFullYear().toString().substr(-2);
            return `${day}/${month}/${year} ${messageDate.toLocaleTimeString(navigator.language, options)}`;
        }
    };

    const formatJoinedOn = (joined_on) => {
        const now = new Date();
        const joinedDate = new Date(joined_on);

        const diffInDays = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));


        if (isTimeHovered) {
            const options: Intl.DateTimeFormatOptions = {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
            };
            const day = joinedDate.getDate().toString().padStart(2, '0');
            const month = (joinedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = joinedDate.getFullYear().toString().substr(-2);

            return `${day}/${month}/${year} ${joinedDate.toLocaleTimeString(navigator.language, options)}`;
        } else if (diffInDays === 0) {
            return `Today`;
        } else if (diffInDays === 1) {
            return `Yesterday`;
        } else {
            return `${diffInDays} days ago`;
        }
    };

    return (
        <>
            <div className="relative inline-block">
                <Image
                    src={message.author.avatar || `https://www.gravatar.com/avatar/${message.author.username}?d=identicon`}
                    alt={message.author.username}
                    height={50}
                    width={50}
                    onClick={() => setAuthorProfilePopup(!authorProfilePopup)}
                    ref={profilePictureRef}
                    className="hover:shadow-2xl active:shadow-none active:translate-y-0.5 w-10 h-10 mr-2 rounded-full aspect-square object-cover cursor-pointer"
                />
                {authorProfilePopup && (
                    <div className="relative">
                        <div className="absolute left-0 bottom-1 ml-12 z-20">
                            <div ref={authorProfileRef} className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm shadow-lg w-72">
                                <div className="flex items-center">
                                    <Image
                                        src={message.author.avatar || `https://www.gravatar.com/avatar/${message.author.username}?d=identicon`}
                                        alt={message.author.username}
                                        width={50}
                                        height={50}
                                        className="w-10 h-10 rounded-full aspect-square object-cover mr-4"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{message.author.username}</h2>
                                        <p
                                            className="text-sm text-gray-500 relative cursor-default"
                                        >
                                            Joined:
                                            <time dateTime={message.author.inserted_at}
                                                  onMouseEnter={() => setTimeHovered(true)}
                                                  onMouseLeave={() => setTimeHovered(false)}
                                                  className="ml-1 cursor-default"
                                            >{formatJoinedOn(message.author.inserted_at)}</time>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AuthorProfile;
