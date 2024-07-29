import React from 'react'
import { GetFormContentByUrl } from '../../../../actions/form';

async function SubmitPage({params}: {params: {formUrl: string}}) {
  
    const form = await GetFormContentByUrl(params.formUrl);
    
    if(!form) {
      throw new Error('Formulario no encontrado');
    }
  
    return (
    <div>
     <FormSubmitComponent formUrl={params.formUrl} content={formContent} />
    </div>
  )
}

export default SubmitPage
