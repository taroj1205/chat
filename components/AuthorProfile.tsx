import React, { useState } from 'react';
import Image from 'next/image';

const AuthorProfile = ({ message, authorProfilePopup, setAuthorProfilePopup }) => {
    // State to control the visibility of the popup
    const [isTimeHovered, setTimeHovered] = useState(false);

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

    return (
        <>
            <div className="relative inline-block">
                <Image
                    src={message.author.avatar || `https://www.gravatar.com/avatar/${message.author.username}?d=identicon`}
                    alt={message.author.username}
                    height={50}
                    width={50}
                    onClick={() => setAuthorProfilePopup(true)}
                    className="w-10 h-10 mr-2 rounded-full aspect-square object-cover cursor-pointer"
                />
                {authorProfilePopup && (
                    <div className="relative">
                        <div className="absolute left-0 bottom-0 ml-12 z-20">
                            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg w-72">
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
                                        {/* <p className="text-sm text-gray-500">
                                            Status: {message.author.status}
                                        </p> */}
                                        <p
                                            className="text-sm text-gray-500 relative"
                                            onMouseEnter={() => setTimeHovered(true)}
                                            onMouseLeave={() => setTimeHovered(false)}
                                        >
                                            Joined: <time dateTime={message.author.inserted_at}>{formatSentOn(message.author.inserted_at)}</time>
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
