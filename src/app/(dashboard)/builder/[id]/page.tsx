
export const dynamic = 'force-dynamic'; 
import React from 'react';
import { GetFormById } from '../../../../../actions/form';
import Formbuilder from '@/components/form/disingner/Formbuilder';
import { currentUser } from '@clerk/nextjs/server'; // Asegúrate de que la importación sea correcta
import { redirect } from 'next/navigation';

// NO necesitas 'force-dynamic' si manejas la autenticación correctamente.
// Next.js entenderá que es dinámica por la naturaleza de la función.
// export const dynamic = 'force-dynamic'; 

async function BuilderPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Verificar la autenticación PRIMERO
  const user = await currentUser();
  if (!user) {
    // Si no hay usuario, redirigir al login.
    // Esto funciona tanto en el servidor (build) como en el navegador.
    redirect("/sign-in"); 
  }

  // 2. Ahora sí, obtén el formulario. Ya sabes que hay un usuario.
  const form = await GetFormById(Number(id), user.id);
  
  if (!form) {
    // Es buena práctica lanzar un error si el formulario no se encuentra
    // para este usuario específico.
    throw new Error('Formulario no encontrado');
  }

  // 3. Renderiza el componente de cliente con los datos
  return (
    <Formbuilder form={form} />
  );
}

export default BuilderPage;