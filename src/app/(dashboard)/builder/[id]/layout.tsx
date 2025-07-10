import React, { ReactNode } from 'react'
export const runtime = 'edge';
// ① Fuerza SSR dinámico (ya no intenta SSG)
export const dynamic = 'force-dynamic';

function layout({children}:{children: ReactNode}) {
  return (
    <div className='flex w-full flex-grow mx-auto'>
      {children}
    </div>
  )
}


export default layout
