"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

function VisitBtn({ shareURL }: { shareURL: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) { 
        return null;  //evita error de ventanas no definidas
    }

    const shareLink = `${window.location.origin}/submit/${shareURL}`

    return (
        <Button
            className='w-[200px]'
            onClick={() => { window.open(shareLink, '_blank') }}
        > Visitar</Button>
    )
}

export default VisitBtn
