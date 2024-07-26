import React, { startTransition, useTransition } from 'react'
import { Button } from '../../ui/button'
import { Loader, Save } from 'lucide-react'
import useDesigner from '../hooks/useDesigner'
import { UpdateFormContent } from '../../../../actions/form'
import { toast } from '@/components/ui/use-toast'

function SaveFormBtn({id}: {id: number}) {
  const {elements} = useDesigner();
  const [loading, setTransiton] = useTransition();

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements)
      await UpdateFormContent(id, JsonElements);
      toast({
        title: 'Succes',
        description: 'Formulario guardado',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el formulario',
        variant: 'destructive',
      });
  }
}
  return (
   <Button variant={"outline"} className='gap-2' 
   disabled={loading}
   onClick={() => {
    startTransition(updateFormContent);
    }}>
     <Save />
    Guardar
    {loading && <Loader className="animate-spin" />}
   </Button>
  )
}

export default SaveFormBtn