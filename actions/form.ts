"use server";

import prisma from "@/lib/prisma";

import { currentUser } from '@clerk/nextjs/server';
import { formSchema, formSchemaType } from "../schemas/form";
import { create } from "domain";

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

