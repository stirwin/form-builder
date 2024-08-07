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
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

async function FormDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const form = await GetFormById(Number(id));

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
  [key: string]: string;
} & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("Form no encontrado");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const colums: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "DateFíeld":
      case "NumberField":
      case "TextAreaField":
      case "SelectField":
      case "CheckboxField":
        colums.push({
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
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  })

  return (
    <>
      <h1 className="text-2xl font-bold my-4"> Enviados</h1>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {colums.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}

              <TableHead className="text-muted-foreground text-right uppercase">
                Enviado hace 
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {colums.map((column) => (
                  <RowCell 
                  key={column.id} 
                  type={column.type}
                  value={row[column.id]}
                  />     
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(),{
                    addSuffix: true
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({type, value}: {type: ElementsType, value: string}) {
  let node: ReactNode = value;

  switch (type) {
    case "DateFíeld":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant="outline">{format(date, "dd/MM/yyyy")}</Badge>;
      break;
      case "CheckboxField":
        const cheked = value === "true" ? true : false;
        node= <Checkbox checked={cheked}  disabled/>;
        break;
        default:
          break;
  }

  return <TableCell>{node}</TableCell>;
}
