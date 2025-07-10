import React, { ReactNode } from 'react'

export const runtime = 'edge';
function layout({children}:{children: ReactNode}) {
  return (
    <div className='flex w-full flex-col flex-grow mx-auto'>
      {children}
    </div>
  )
}


export default layout
