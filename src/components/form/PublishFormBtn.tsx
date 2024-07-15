import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpToLine } from 'lucide-react'

function PublishFormBtn() {
  return (
    <Button variant={"default"} className='gap-2'>
        <ArrowUpToLine />
    Publicar
   </Button>
  )
}

export default PublishFormBtn