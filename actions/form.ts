"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";

// Clase de error personalizada para cuando el usuario no se encuentra
class UserNotFoundErr extends Error {}

// Función asincrónica para obtener las estadísticas del formulario
export async function GetFormStats() {
    // Obtiene el usuario actual desde Clerk
    const user = currentUser();
    
    // Si no hay un usuario actual, lanza un error
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    // Agrega la lógica para obtener las estadísticas del formulario desde la base de datos
    const stats = await prisma.form.aggregate({
      where: {
        userId: user.id, // Filtra los formularios por el ID del usuario actual
      },
      _sum: {
        visits: true,      // Suma el total de visitas
        submissions: true, // Suma el total de envíos
      }
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
  

