import React from 'react'
import { GetFormById } from '../../../../../actions/form';
import Formbuilder from '@/components/form/disingner/Formbuilder';

// ① Fuerza SSR dinámico (ya no intenta SSG)
export const dynamic = 'force-dynamic';

async function BuilderPage({params,}:{params:{id:string}}) {
    const form = await GetFormById(Number(params.id));

    if (!form) {
        throw new Error('Form no encontrado');
    }
  return (
   
       <Formbuilder form={form}/>
 
  )
}

export default BuilderPage;
