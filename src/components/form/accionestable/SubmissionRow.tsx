"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { ElementsType, FormElementInstance } from "@/components/form/disingner/FormElemets"; // Importa el tipo correcto
import { TableRow, TableCell } from "@/components/ui/table"; // Asegúrate de tener estos componentes
import { format, formatDistance } from "date-fns"; // Asegúrate de importar esto si estás usando la función
import { toast } from "@/components/ui/use-toast"; // Asegúrate de importar el sistema de notificaciones que estés usando
import { EditButtonWithModal } from "./EditButton"; // Importa tu componente
 // Importa tu botón de eliminar
import { DeleteSubmission, UpdateSubmission } from "../../../../actions/form"; // Asegúrate de importar correctamente
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import EliminarButton from "./EiminarButton";

interface Column {
  id: string;
  label: string;
  required: boolean;
  type: ElementsType; // Asegúrate de que ElementsType esté importado correctamente
}

interface SubmissionRowProps {
  row: Record<string, any> & { id: number; submittedAt: Date }; // Define que `row` tiene un `id` y `submittedAt`, además de otras posibles propiedades
  columns: Column[];
  formContent: FormElementInstance[];
  formId: number;
}

export function SubmissionRow({ row, columns, formContent, formId }: SubmissionRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeleteSubmission(row.id);
      toast({
        title: "Submission eliminada",
        description: "La submission se ha eliminado correctamente.",
      });
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar la submission:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "No se pudo eliminar la submission",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

 // En SubmissionRow.tsx
const handleUpdate = async (updatedValues: Record<string, any>) => {
  try {
    await UpdateSubmission(formId, row.id, updatedValues);
    toast({
      title: "¡Guardado!",
      description: "Los cambios se han guardado correctamente.",
    });
    router.refresh();
  } catch (error) {
    console.error("Error al actualizar la submission:", error);
    toast({
      title: "Error",
      description: "Hubo un problema al guardar los cambios.",
      variant: "destructive",
    });
  }
};


  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <RowCell
            type={column.type}
            value={row[column.id]}
          />
        </TableCell>
      ))}
      <TableCell className="text-muted-foreground text-right">
        {formatDistance(row.submittedAt, new Date(), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="flex gap-2 items-center justify-center">
        <EditButtonWithModal
          rowData={row}
          columns={columns}
          formContent={formContent}
          onSubmit={handleUpdate} // Llamar a la función para actualizar datos
       />
        <EliminarButton
          submissionId={row.id}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
}





function RowCell({ type, value }: { type: ElementsType, value: string }) {
    let node: ReactNode = value;
  
    switch (type) {
      case "DateFíeld":
        if (!value) break;
        const date = new Date(value);
        node = <Badge variant="outline">{format(date, "dd/MM/yyyy")}</Badge>;
        break;
      case "CheckboxField":
        const cheked = value === "true" ? true : false;
        node = <Checkbox checked={cheked} disabled />;
        break;
      default:
        break;
    }
  
    return <>{node}</>;
  }
  