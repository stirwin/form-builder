"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormElements, FormElementInstance, ElementsType } from "@/components/form/disingner/FormElemets";
import { ClipboardPenLine, Loader } from "lucide-react"; // Asegúrate de importar Loader
import { toast } from "@/components/ui/use-toast";

interface EditButtonWithModalProps {
  rowData: Record<string, any>;
  columns: {
    id: string;
    label: string;
    required: boolean;
    type: string;
  }[];
  formContent: FormElementInstance[];
  existingTotals: { [key: string]: number }; // Totals from the existing form
  onSubmit: (updatedContent: { formValues: Record<string, any>; totals: Record<string, number> }) => void;
}

export function EditButtonWithModal({
  rowData,
  columns,
  formContent,
  existingTotals,
  onSubmit,
}: EditButtonWithModalProps) {
  const [updatedValues, setUpdatedValues] = useState<Record<string, any>>({
    formValues: rowData, // Inicializamos con los valores actuales
  });
  const [totals, setTotals] = useState<Record<string, number>>(existingTotals); // Inicializamos con los totales existentes
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el loader

  // Función para calcular los totales
  const calculateTotals = useCallback((values: { [key: string]: string }) => {
    const totalsSum: { [key: string]: number } = {}; // Suma de los valores por identificador
    const counts: { [key: string]: number } = {}; // Conteo de los campos válidos por identificador
  
    formContent.forEach((element) => {
      if (element.type === "NumberField") {
        const identifier = (element.extraAttributes as any)?.identifier || "";
        const value = parseFloat(values[element.id] || "0");
  
        //console.log(`Procesando campo: ${element.id}, Identificador: ${identifier}, Valor: ${value}`);
  
        // Validar que el valor sea un número y diferente de 0
        if (!isNaN(value) && value !== 0) {
          // Inicializar el total y el contador si aún no existen para este identificador
          if (!totalsSum[identifier]) {
            totalsSum[identifier] = 0;
            counts[identifier] = 0;
          }
  
          // Sumar el valor al total del identificador
          totalsSum[identifier] += value;
          // Aumentar el contador para este identificador solo si el valor es diferente de 0
          counts[identifier] += 1;
  
          //console.log(`Total para ${identifier}: ${totalsSum[identifier]}, Conteo: ${counts[identifier]}`);
        }
      }
    });
  
    // Crear los nuevos promedios para cada identificador
    const newTotals: { [key: string]: number } = {};
    Object.keys(totalsSum).forEach((identifier) => {
      if (counts[identifier] > 0) {
        newTotals[identifier] = totalsSum[identifier] / counts[identifier]; // Promedio
      }
    });
  
    return newTotals;
  }, [formContent]);
  
  

  // Función para manejar el cambio de valores
  const handleValueChange = (id: string, value: string) => {
    const updatedValuesCopy = { ...updatedValues.formValues, [id]: value };
    setUpdatedValues((prevValues) => ({
      ...prevValues,
      formValues: updatedValuesCopy,
    }));

    // Recalcular los totales
    const updatedTotals = calculateTotals(updatedValuesCopy);
    setTotals(updatedTotals);
  };

  // Función para manejar el envío
  const handleSubmit = useCallback(async () => {
    setIsLoading(true); // Iniciar el loader

    try {
      await onSubmit({ formValues: updatedValues.formValues, totals }); // Enviamos `formValues` y `totals`
      //console.log("Enviando formValues actualizados:", updatedValues.formValues);
      //console.log("Enviando totals actualizados:", totals);

      toast({
        title: "Datos actualizados.",
        description: "Los datos se han actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar los datos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Finalizar el loader después de actualizar
    }
  }, [updatedValues, totals, onSubmit]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <ClipboardPenLine className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Editar respuesta</p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
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
    const FormComponent = FormElements[element.type as keyof typeof FormElements]?.formComponent;
    if (!FormComponent) return null;

    return (
      <FormComponent
        key={element.id}
        elementInstance={element}
        submitValue={(id, value) => handleValueChange(id, value)}
        defaultValue={updatedValues.formValues[element.id]}
      />
    );
  })}

  {/* Mostrar promedios por identificador */}
  <div className="mt-4 p-4 border-t">
    <h2 className="text-lg font-bold">Promedios por Identificador</h2>
    <ul>
      {Object.entries(totals).map(([identifier, total]) => (
        <li key={identifier}>
          <span className="font-semibold">{identifier}: </span>
          <span>{total.toFixed(2)}</span> {/* Mostrar el promedio con 2 decimales */}
        </li>
      ))}
    </ul>
  </div>

  {/* Botón de Guardar con animación mientras se envían los datos */}
  <Button onClick={handleSubmit} disabled={isLoading}>
    {isLoading ? <Loader className="animate-spin" /> : "Guardar cambios"}
  </Button>
</div>

        </div>
      </DialogContent>
    </Dialog>
  );
}