import React from 'react'
import { Button } from '../ui/button'
import { ScanEye } from 'lucide-react'

function PreviewDialogBtn() {
  return (
    <Button variant={"outline"} className='gap-2'>
          <ScanEye />
        Preview
    </Button>
  )
}

export default PreviewDialogBtn