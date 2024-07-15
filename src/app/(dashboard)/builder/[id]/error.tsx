'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react'

function ErrorPage({ error }: { error: Error }) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
      
            <div className='flex flex-col  items-center justify-center w-full h-full'>
                <h2 className='text-center'>Algo salio mal</h2>
                <Button asChild>
                    <Link href={'/'}> Volver</Link>
                </Button>
            </div>
   
    )
}

export default ErrorPage;
