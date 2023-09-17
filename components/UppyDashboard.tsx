import { useState, useContext, useEffect, useRef } from 'react';
import UserContext from '~/lib/UserContext';
import { useRouter } from 'next/router';

import Uppy from '@uppy/core';
import { Dashboard } from "@uppy/react";
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import RemoteSources from "@uppy/remote-sources";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import Compressor from "@uppy/compressor";
import ScreenCapture from "@uppy/screen-capture";
import DropTarget from "@uppy/drop-target";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STORAGE_BUCKET = 'avatar';
const COMPANION_URL = "https://supabase.com";

const UppyDashboard = () => {
    const { user, setUser, authLoaded } = useContext(UserContext);
    const supabaseStorageURL = `https://${SUPABASE_PROJECT_URL}/storage/v1/upload/resumable`;
    const router = useRouter();

    // Create an Uppy instance
    const uppy = new Uppy({
        autoProceed: false,
        restrictions: {
            maxFileSize: null,
            allowedFileTypes: null,
        },
    })
        .use(Tus, {
            endpoint: supabaseStorageURL,
            headers: {
                authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                apikey: SUPABASE_ANON_KEY,
            },
            uploadDataDuringCreation: true,
            chunkSize: 6 * 1024 * 1024,
        })
        .use(RemoteSources, {
            companionUrl: COMPANION_URL,
            sources: [
                "Box",
                "Dropbox",
                "Facebook",
                "GoogleDrive",
                "Instagram",
                "OneDrive",
                "Unsplash",
                "Url"
            ],
        })
        .use(DropTarget, {
            target: document.body
        })
        .use(Compressor);
        // .use(Webcam, {
        //     target: Dashboard,
        //     showVideoSourceDropdown: true,
        //     showRecordingLength: true
        // })
        // .use(ScreenCapture, { target: Dashboard })
        // .use(ImageEditor, { target: Dashboard })

    useEffect(() => {
        if (authLoaded && !user) {
            router.push('/auth');
        }

        console.log("running useEffect");

        // Handle file-added event
        uppy.on('file-added', (file) => {
            const supabaseMetadata = {
                bucketName: STORAGE_BUCKET,
                objectName: file.name,
                contentType: file.type,
            };

            file.meta = {
                ...file.meta,
                ...supabaseMetadata,
            };
        });

        // Handle complete event
        uppy.on('complete', (result) => {
            console.log('Upload complete! We’ve uploaded these files:', result.successful);
            toast.success('Upload complete');
        });
    }, []);


    return (
        <>
            <Dashboard
                uppy={uppy}
                showProgressDetails={true}
            />
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
        </>
    );
}

export default UppyDashboard;