"use server";

import prisma from "@/lib/prisma";

import { currentUser } from '@clerk/nextjs/server';
import { formSchema, formSchemaType } from "../schemas/form";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });
  
    // Obtiene el total de visitas y envíos, asignando 0 si no hay datos
    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;
  
    // Calcula la tasa de envíos
    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }
  
    // Calcula la tasa de rebote
    const bounceRate = 100 - submissionRate;
  
    // Retorna un objeto con las estadísticas del formulario
    return {
      visits,         // Total de visitas
      submissions,    // Total de envíos
      submissionRate, // Tasa de envíos (en porcentaje)
      bounceRate      // Tasa de rebote (en porcentaje)
    };
  }


 
// Función asincrónica para crear un formulario
export async function CreateForm(data: formSchemaType) {
  // Validación de los datos del formulario utilizando el esquema de Zod
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid"); // Lanza un error si la validación falla
  }

  // Obtiene el usuario actual desde Clerk
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr(); // Lanza un error si no hay un usuario actual
  }

  // almacena el name y la descripcion
  const { name, description } = data;

  // Creación del formulario en la base de datos utilizando Prisma
  const form = await prisma.form.create({
    data: {
      userId: user.id, // Asocia el formulario con el ID del usuario actual
      name,           // Nombre del formulario
      description,    // Descripción del formulario
    },
  });

  // Verifica si la creación del formulario fue exitosa
  if (!form) {
    throw new Error("something went wrong"); // Lanza un error si algo salió mal
  }

  // Retorna el ID del formulario creado
  return form.id;
}


// Función para obtener los formularios del usuario actual
export async function GetForms() {
  // Obtiene el usuario actual desde Clerk
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr(); // Lanza un error si no hay un usuario actual
  }

  // Busca y retorna los formularios del usuario, ordenados por fecha de creación
  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(id: number, userId: string) {
  // La comprobación de usuario ya no es necesaria aquí, 
  // porque la página se encarga de ello.

  return prisma.form.findUnique({
    where: {
      userId: userId, // Usa el userId que pasaste como parámetro
      id: id,
    },
  });
}

export async function UpdateFormContent(id: number, jsoncontent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr(); // Lanza un error si no hay un usuario actual
  }
  return prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      content: jsoncontent
    }
  })
}

export async function PublishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr(); // Lanza un error si no hay un usuario actual
  }
  return prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      published: true
    }
  })
}

export async function GetFormContentByUrl(formUrl: string) {
  return prisma.form.update({
    select: {
      content: true,
      name: true,
      description: true
    },
    data: {
      visits: {
        increment: 1
      }
    },
    where: {
      shareURL: formUrl
    }
  })
}

export async function SubmitForm(formUrl: string, content: string) {
  
  return await prisma.form.update({
    data:{
      submissions: {
        increment: 1
      },
      FormSubmissions:{
        create:{
          content
        }
      }
    },
    where: {
      shareURL: formUrl,
      published: true
    }
  })
}

export async function GetFormWithSubmissions (id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr(); // Lanza un error si no hay un usuario actual
  }

  return prisma.form.findUnique({
    where: {
      id
    },
    include: {
      FormSubmissions: true
    }
  })
}

// Función para duplicar un formulario existente
// Función para duplicar un formulario existente
export async function DuplicateForm(formId: number) {
  // Obtener el usuario actual desde Clerk
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  // Buscar el formulario que se va a duplicar
  const form = await prisma.form.findUnique({
    where: { id: formId, userId: user.id },
  });

  if (!form) {
    throw new Error("Formulario no encontrado");
  }

  // Crear un nuevo formulario duplicado
  const duplicatedForm = await prisma.form.create({
    data: {
      userId: user.id,
      name: `${form.name} (Duplicado)`, // Renombrar el formulario duplicado
      description: form.description,
      content: form.content, // Copiar el contenido del formulario original
      published: false, // El formulario duplicado comienza como no publicado
    },
  });

  return duplicatedForm;
}

export async function UpdateForm(formId: number, data: { name: string; description: string }) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return prisma.form.update({
    where: {
      id: formId,
      userId: user.id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}


export async function DeleteForm(formId: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
1
  // Eliminar todos los envíos asociados al formulario
  await prisma.formSubmissions.deleteMany({
    where: {
      formId: formId,
    },
  });

  // Luego eliminar el formulario
  return prisma.form.delete({
    where: {
      id: formId,
      userId: user.id,
    },
  });
}

// Nueva función para actualizar una submission
export async function UpdateSubmission(formId: number, submissionId: number, updatedValues: Record<string, any>) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  // Obtener el contenido actual de la submission
  const existingSubmission = await prisma.formSubmissions.findUnique({
    where: { id: submissionId },
    select: { content: true },
  });

  if (!existingSubmission) {
    throw new Error("Submission no encontrada");
  }

  // Parsear el contenido existente
  const existingContent = JSON.parse(existingSubmission.content);
  
  // Si el contenido existente ya tiene formValues, lo usamos como base
  // de lo contrario, usamos el contenido existente directamente
  const baseValues = existingContent.formValues || existingContent;
  
  // Fusionar los valores existentes con los actualizados
  const mergedValues = {
    ...baseValues,
    ...updatedValues
  };

  // Eliminar formValues y totals si existen para mantener el formato limpio
  delete mergedValues.formValues;
  delete mergedValues.totals;

  // Actualizar la submission con los nuevos valores
  const updatedSubmission = await prisma.formSubmissions.update({
    where: { id: submissionId },
    data: {
      content: JSON.stringify(mergedValues),
    },
  });

  console.log("Submission actualizada correctamente en la BD:", updatedSubmission);
  return updatedSubmission;
}

export async function DeleteSubmission(submissionId: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  try {
    // Primero, obtengamos la submission para verificar que existe
    const submission = await prisma.formSubmissions.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new Error("Submission no encontrada");
    }

    // Ahora procedemos con la eliminación
    const deletedSubmission = await prisma.formSubmissions.delete({
      where: { id: submissionId },
    });

    if (deletedSubmission) {
      // Actualizar el conteo de submissions en el formulario correspondiente
      await prisma.form.update({
        where: { id: deletedSubmission.formId },
        data: { submissions: { decrement: 1 } },
      });
    }

    return deletedSubmission;
  } catch (error) {
    console.error("Error detallado al eliminar la submission:", error);
    throw new Error(`No se pudo eliminar la submission: ${error}`);
  }
}