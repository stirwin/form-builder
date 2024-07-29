"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Share } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FormLinkShare({ shareURL }: { shareURL: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) {
        return null;  //evita error de ventanas no definidas
    }

    const shareLink = `${window.location.origin}/submit/${shareURL}`

    return (
        <div className="flex flex-grow gap-4 items-center">
            <Input value={shareLink} readOnly />
            <Button
                className='w-[250px]'
                onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast({
                        title: 'Link copiado',
                        description: 'El link se ha copiado en el portapapeles'
                    })
                }}>
                <Share />
                Compartir link
            </Button>
        </div>
    )
}

export default FormLinkShare
