"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface DownloadExcelButtonProps {
  data: Array<Record<string, any>>;
  formContent: any[];
  fileName?: string;
}

export function DownloadExcelButton({ 
  data, 
  formContent,
  fileName = "respuestas" 
}: DownloadExcelButtonProps) {
  const downloadExcel = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    try {
      // Mapear los datos para incluir etiquetas legibles
      const formattedData = data.map(submission => {
        const content = typeof submission.content === 'string' 
          ? JSON.parse(submission.content) 
          : submission.content;
        
        const formatted: Record<string, any> = {
          "Fecha de envío": new Date(submission.createdAt).toLocaleString(),
        };

        // Agregar cada campo del formulario con su etiqueta
        formContent.forEach(field => {
          const label = field.extraAttributes?.label || field.id;
          formatted[label] = content[field.id] || "";
        });

        return formatted;
      });

      // Crear libro de Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData);
      
      // Ajustar el ancho de las columnas
      const colWidths = formContent.map(field => ({
        wch: Math.max(
          (field.extraAttributes?.label || field.id).length * 1.5, // Ancho basado en la etiqueta
          15 // Ancho mínimo
        )
      }));
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Respuestas");
      
      // Generar archivo y descargar
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert("Ocurrió un error al generar el archivo Excel");
    }
  };

  return (
    <Button 
      onClick={downloadExcel}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Descargar Excel
    </Button>
  );
}