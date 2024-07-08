'use client'
import React, { useEffect } from 'react'

function ErrorPage({ error }: { error: Error }) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <h2>Algo salio mal</h2>
            </div>
        </div>
    )
}

export default ErrorPage;
