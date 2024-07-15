import React from 'react'
import { GetFormById } from '../../../../../actions/form';
import Formbuilder from '@/components/form/Formbuilder';

async function BuilderPage({params,}:{params:{id:string}}) {
    const {id}=params;
    const form = await GetFormById(Number(id));

    if (!form) {
        throw new Error('Form no encontrado');
    }
  return (
   
       <Formbuilder form={form}/>
 
  )
}

export default BuilderPage;
