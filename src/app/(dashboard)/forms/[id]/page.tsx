export const dynamic = "force-dynamic"

import { GetFormById, GetFormWithSubmissions } from "../../../../../actions/form"
import VisitBtn from "@/components/form/forms/VisitBtn"
import FormLinkShare from "@/components/form/forms/FormLinkShare"
import { StatsCard } from "../../page" // Importa StatsCard desde la página principal
import { BookText, CirclePlus, MousePointerClick } from "lucide-react"
import type { ElementsType, FormElementInstance } from "@/components/form/disingner/FormElemets"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SubmissionRow } from "@/components/form/accionestable/SubmissionRow"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // Asegúrate de importar Card
import { FormResponsesChart } from "@/components/charts/FormResponsesChart";



// Función para procesar las respuestas del formulario

function processFormResponses(submissions: any[], formContent: any[]) {
  if (!formContent || !Array.isArray(formContent)) {
    console.error("Form content no es un array o está vacío");
    return [];
  }

  // Filtrar solo los campos Select con opciones numéricas
  const numericFields = formContent.filter(field => {
    if (!field) return false;
    const isSelectField = field.type === "SelectField";
    const hasNumericOptions = field.extraAttributes?.options?.some(
      (opt: string) => !isNaN(Number(opt))
    );
    return isSelectField && hasNumericOptions;
  });

  if (numericFields.length === 0) {
    console.log("No se encontraron campos numéricos");
    return [];
  }

  // Procesar las respuestas
  const fieldStats = numericFields.map(field => {
    const responses = submissions
      .map(sub => {
        try {
          const content = typeof sub.content === 'string' 
            ? JSON.parse(sub.content) 
            : sub.content;
          const value = content[field.id];
          const numValue = Number(value);
          return isNaN(numValue) ? null : numValue;
        } catch (error) {
          console.error("Error procesando respuesta:", error);
          return null;
        }
      })
      .filter((val): val is number => val !== null);

    const totalResponses = responses.length;
    const average = totalResponses > 0 
      ? responses.reduce((sum, val) => sum + val, 0) / totalResponses 
      : 0;

    return {
      id: field.id,
      name: field.extraAttributes?.label || `Pregunta ${field.id.substring(0, 4)}`,
      average,
      totalResponses
    };
  });

  return fieldStats;
}

async function FormDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const form = await GetFormById(Number(id), user.id)
  if (!form) {
    throw new Error("Form no encontrado")
  }

  const { visits, submissions } = form
  let submissionRate = 0
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }
  const bounceRate = 100 - submissionRate // Calcula la tasa de rebote

  // Procesar los datos para la gráfica
  const chartData = processFormResponses(
   form.FormSubmissions || [], // Asegúrate de que esto sea un array
    form.content ? JSON.parse(form.content) : []
  );
  
  console.log("Datos para la gráfica:", chartData);
  
  
  return (
    <div className="flex flex-col flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Sección de Encabezado del Formulario */}
        <Card className="mb-8 border-t-4 border-t-blue-500 shadow-lg w-full">
        <CardHeader>
            <div className="flex justify-between items-center mb-2">
              {" "}
              {/* Contenedor para el título y el botón */}
              <CardTitle className="text-4xl font-bold truncate" title={form.name}>
                {form.name}
              </CardTitle>
              <VisitBtn shareURL={form.shareURL} />
            </div>
            <CardDescription className="text-muted-foreground">
              {form.description || "No hay descripción para este formulario."}
            </CardDescription>{" "}
            {/* Descripción del formulario */}
          </CardHeader>
        </Card>
        {/* Sección de Compartir Enlace */}
        <Card className="mb-8 shadow-md w-full">
          <CardContent className="p-4">
            <FormLinkShare shareURL={form.shareURL} />
          </CardContent>
        </Card>
        {/* Sección de Tarjetas de Estadísticas */}
        <div className="w-full pt-4 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total visitas"
            icon={<BookText className="text-blue-600" />}
            helperText="Todas las visitas"
            value={visits.toLocaleString() || ""}
            loading={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          <StatsCard
            title="Total envíos"
            icon={<CirclePlus className="text-yellow-600" />}
            helperText="Todos los envíos"
            value={submissions.toLocaleString() || ""}
            loading={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          <StatsCard
            title="Tasa de envíos"
            icon={<MousePointerClick className="text-green-600" />}
            helperText="Vistas en envíos de formularios"
            value={submissionRate.toLocaleString() + "%" || ""}
            loading={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          <StatsCard
            title="Porcentaje de rebotes"
            icon={<CirclePlus className="text-red-600" />}
            helperText="Visitas que te dejan sin interactuar"
            value={bounceRate.toLocaleString() + "%" || ""}
            loading={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
        {/* Sección de Tabla de Envíos */}
        <Card className="mt-8 shadow-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Envíos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SubmissionsTable id={form.id} />
          </CardContent>
        </Card>

        {/* Nuevo Apartado: Gráfica General */}
        <Card className="mt-8 shadow-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Promedio de respuestas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Placeholder para la gráfica general */}
            <FormResponsesChart data={chartData} />
          </CardContent>
        </Card>

        {/* Nuevo Apartado: Gráficas por Grupo Etario */}
        <Card className="mt-8 shadow-lg w-full mb-8">
          {" "}
          {/* Añade mb-8 para el margen inferior */}
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Gráficas por Grupo Etario</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gráfica para niños entre 3-4 */}
            <Card className="shadow-sm border-t-2 border-t-blue-400">
              <CardHeader>
                <CardTitle className="text-lg">Niños 3-4 años</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-blue-50 rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                  {"{"} Gráfica 3-4 años {"}"}
                </div>
              </CardContent>
            </Card>

            {/* Gráfica para niños entre 4-5 */}
            <Card className="shadow-sm border-t-2 border-t-green-400">
              <CardHeader>
                <CardTitle className="text-lg">Niños 4-5 años</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-green-50 rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                  {"{"} Gráfica 4-5 años {"}"}
                </div>
              </CardContent>
            </Card>

            {/* Gráfica para niños entre 5-6 */}
            <Card className="shadow-sm border-t-2 border-t-purple-400">
              <CardHeader>
                <CardTitle className="text-lg">Niños 5-6 años</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-purple-50 rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                  {"{"} Gráfica 5-6 años {"}"}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FormDetailPage

type Rows = {
  id: number
  submittedAt: Date
  [key: string]: string | number | Date
}

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id)
  if (!form) {
    throw new Error("Form no encontrado")
  }

  let formContent: FormElementInstance[] = []
  try {
    if (form.content) {
      formContent = JSON.parse(form.content) as FormElementInstance[]
    }
  } catch (error) {
    console.error(`Error al parsear el contenido del formulario ${form.id}:`, error)
  }

  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []
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
        })
        break
      default:
        break
    }
  })

  const rows: Rows[] = []
  form.FormSubmissions.forEach((submission) => {
    let content = {}
    try {
      if (submission.content) {
        content = JSON.parse(submission.content)
      }
    } catch (error) {
      console.error(`Error al parsear el contenido de la submission ${submission.id}:`, error)
    }
    rows.push({
      id: submission.id,
      ...content,
      submittedAt: submission.createdAt,
    })
  })

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Enviado hace</TableHead>
              <TableHead className="uppercase">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <SubmissionRow key={row.id} row={row} columns={columns} formContent={formContent} formId={id} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}


