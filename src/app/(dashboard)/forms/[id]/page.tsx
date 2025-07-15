export const dynamic = 'force-dynamic'; 
import React, { ReactNode } from "react";
import {
  GetFormById,
  GetFormWithSubmissions,
} from "../../../../../actions/form";
import Formbuilder from "@/components/form/disingner/Formbuilder";
import VisitBtn from "@/components/form/forms/VisitBtn";
import FormLinkShare from "@/components/form/forms/FormLinkShare";
import { StatsCard } from "../../page";
import { BookText, CirclePlus, MousePointerClick } from "lucide-react";
import {
  ElementsType,
  FormElementInstance,
} from "@/components/form/disingner/FormElemets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmissionRow } from "@/components/form/accionestable/SubmissionRow";

async function FormDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 2. Obtener el usuario DENTRO del componente.
  const user = await currentUser();
  if (!user) {
    // 3. Comprobar si el usuario existe y redirigir si no.
    redirect("/sign-in");
  }
  // 4. Usar el 'id' del usuario obtenido para llamar a GetFormById.
  const form = await GetFormById(Number(id), user.id);

  if (!form) {
    throw new Error("Form no encontrado");
  }

  // Obtiene el total de visitas y envíos, asignando 0 si no hay datos
  const { visits, submissions } = form;

  // Calcula la tasa de envíos
  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  // Calcula la tasa de rebote
  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10  border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareURL={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b flex gap-2 items-center justify-between container">
        <div className=" w-full p-2 flex gap-2 items-center justify-between">
          <FormLinkShare shareURL={form.shareURL} />
        </div>
      </div>
      <div
        className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-4 p-2"
      >
        <StatsCard
          title="Total visitas"
          icon={<BookText className="text-blue-600" />}
          helperText="Todas las visitas"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />

        <StatsCard
          title="Total envíos"
          icon={<CirclePlus className="text-yellow-600" />}
          helperText="Todos los envíos"
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />

        <StatsCard
          title="Tasa de envíos"
          icon={<MousePointerClick className="text-green-600" />}
          helperText="Vistas en envíos de formularios"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />

        <StatsCard
          title="Porcentaje de rebotes"
          icon={<CirclePlus className="text-red-600" />}
          helperText="Visitas que te dejan sin interactuar"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container p-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Rows = {
  id: number; // Asegúrate de incluir id
  submittedAt: Date; // Asegúrate de incluir submittedAt
  [key: string]: string | number | Date; // Otras propiedades pueden ser string, number o Date
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("Form no encontrado");
  }

  // --- INICIO DE LA CORRECCIÓN ---

  // 1. Manejar de forma segura el parseo del contenido del formulario
  let formContent: FormElementInstance[] = [];
  try {
    // Aseguramos que form.content exista y no sea una cadena vacía antes de parsear
    if (form.content) {
      formContent = JSON.parse(form.content) as FormElementInstance[];
    }
  } catch (error) {
    console.error(`Error al parsear el contenido del formulario ${form.id}:`, error);
    // Si falla, formContent se queda como un array vacío para no romper la UI
  }

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formContent.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "DateFíeld":
      case "NumberField":
      case "TextAreaField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Rows[] = [];
  form.FormSubmissions.forEach((submission) => {
    // 2. Manejar de forma segura el parseo de cada envío (submission)
    let content = {};
    try {
      if (submission.content) {
        content = JSON.parse(submission.content);
      }
    } catch (error) {
      console.error(`Error al parsear el contenido de la submission ${submission.id}:`, error);
      // Si falla, el contenido de esta fila estará vacío, pero la página no se romperá
    }

    rows.push({
      id: submission.id, // Añadido para asegurar que `key` en el map funcione
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  // --- FIN DE LA CORRECCIÓN ---

  return (
    <>
      <h1 className="text-2xl font-bold my-4"> Enviados</h1>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}

              <TableHead className="text-muted-foreground text-right uppercase">
                Enviado hace
              </TableHead>
              <TableHead className="uppercase">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <SubmissionRow
                key={row.id} // Usa row.id en lugar de index si está disponible
                row={row}
                columns={columns}
                formContent={formContent}
                formId={id}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
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

  return <TableCell>{node}</TableCell>;
}
