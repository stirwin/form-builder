"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  FormElements,
  FormElementInstance,
  ElementsType,
} from "@/components/form/disingner/FormElemets";
import { BarChartIcon, Eye, Loader } from "lucide-react"; // Asegúrate de importar Loader
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Actualizar la interfaz para reflejar los datos correctos
interface EditButtonWithModalProps {
  rowData: Record<string, any>;
  columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[];
  formContent: FormElementInstance[];
  onSubmit: (updatedValues: Record<string, any>) => void; // Cambiado para esperar solo los valores
}


export function EditButtonWithModal({
  rowData,
  columns,
  formContent,
  onSubmit,
}: EditButtonWithModalProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(rowData);

  // Función para manejar cambios en los valores
  const handleValueChange = (id: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Función para manejar el envío
const handleSubmit = useCallback(async () => {
  try {
    setIsLoading(true);
    // Enviamos directamente los valores, no un objeto anidado
    await onSubmit(values);
    setIsOpen(false);
    toast({
      title: "¡Guardado!",
      description: "Los cambios se han guardado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la respuesta:", error);
    toast({
      title: "Error",
      description: "No se pudo guardar la respuesta",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}, [values, onSubmit]);

  // Función para preparar los datos para la gráfica
  const chartData = useMemo(() => {
    return formContent
      .filter(element => {
        // Solo incluir campos Select con valores numéricos
        const value = values[element.id];
        return element.type === "SelectField" && value && !isNaN(Number(value));
      })
      .map(element => {
        const value = values[element.id];
        return {
          name: element.extraAttributes?.label || `Pregunta ${element.id.substring(0, 4)}`,
          valor: Number(value),
          max: 2, // Valor máximo posible (ajusta según tus necesidades)
        };
      });
  }, [formContent, values]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Visualizar respuesta
          </p>
        </div>
        <div className="bg-accent flex gap-4  items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
         
           {/*Formulario*/}
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {formContent.map((element) => {
              // Verificar si el elemento es un campo de título o subtítulo
              if (element.type === "TitleField") {
                return (
                  <h1 key={element.id} className="text-2xl font-bold">
                    {element.extraAttributes?.title}
                  </h1>
                );
              }

              if (element.type === "SubTitleField") {
                return (
                  <h2 key={element.id} className="text-xl font-semibold">
                    {element.extraAttributes?.title}
                  </h2>
                );
              }

              // Renderizar otros tipos de campos como componentes de formulario
              const FormComponent =
                FormElements[element.type as keyof typeof FormElements]
                  ?.formComponent;
              if (!FormComponent) return null;

              return (
                <FormComponent
                  key={element.id}
                  elementInstance={element}
                  submitValue={(id, value) => handleValueChange(id, value)}
                  defaultValue={values[element.id]}
                />
              );
            })}

          

            {/* Botón de Guardar con animación mientras se envían los datos */}
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
          {/*Estadisticas del estudiante*/}
          <Card className="mt-8 shadow-lg w-full mb-8 h-full">
        
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" />
                <CardTitle>Análisis de respuestas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        domain={[0, 'dataMax']}
                        tickCount={3}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [value, 'Puntuación']}
                        labelFormatter={(label) => `Pregunta: ${label}`}
                      />
                      <Bar 
                        dataKey="valor" 
                        name="Respuesta" 
                        fill="#8EC5FF" 
                        radius={[0, 4, 4, 0]}
                        label={{ 
                          position: 'right',
                          formatter: (value: any) => `${value} pts`,
                          fill: '#666',
                          fontSize: 12
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No hay datos numéricos para mostrar</p>
                  <p className="text-sm mt-2">
                    Las respuestas de tipo numérico aparecerán aquí
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </DialogContent>
    </Dialog>
  );
}
