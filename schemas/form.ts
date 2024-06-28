import { z } from "zod";

// Esquema de validación para el formulario usando Zod
export const formSchema = z.object({
    name: z.string().min(4),      // Campo 'name' obligatorio con mínimo 4 caracteres
    description: z.string().optional(), // Campo 'description' opcional
  });
  
  // Tipo inferido del esquema de validación
  export type formSchemaType = z.infer<typeof formSchema>;
  