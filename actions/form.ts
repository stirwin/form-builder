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


  export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("form not valid");
    }
  
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    const { name, description } = data;
  
    const form = await prisma.form.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    });
  
    if (!form) {
      throw new Error("something went wrong");
    }
  
    return form.id;
  }
  

