import { GetFormStats, GetForms } from "../../../actions/form"
import { ArrowRight, BookText, CirclePlus, ClipboardPen, MousePointerClick, SendHorizontal, View } from "lucide-react"
import { type ReactNode, Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import CreateFormBtn from "@/components/form/CreateFormBtn"
import type { Form } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { formatDistance } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mas } from "@/components/form/Mas"

// Componente principal Home
export default function Home() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {" "}
      {/* Centra el contenido y añade más padding vertical y horizontal */}
      {/* Suspense para manejar la carga asincrónica de las estadísticas */}
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-10" />
      <h2 className="text-4xl font-bold mb-6 text-center md:text-left">Tus formularios</h2>
      {/* Centra el título en móvil y alinea a la izquierda en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense fallback={[1, 2, 3, 4].map((el) => <FormCardSkeleton key={el} />)}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}

// Función asincrónica para obtener las estadísticas del formulario y renderizar los componentes de las tarjetas
async function CardStatsWrapper() {
  const stats = await GetFormStats()
  return <StatsCards loading={false} data={stats} />
}

// Propiedades del componente StatsCard
interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>
  loading: boolean
}

// Componente para mostrar las tarjetas de estadísticas
function StatsCards(props: StatsCardProps) {
  const { data, loading } = props
  return (
    <div className="w-full pt-4 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {" "}
      {/* Ajusta el espaciado entre tarjetas */}
      <StatsCard
        title="Total visitas"
        icon={<BookText className="text-blue-600" />}
        helperText="Todas las visitas"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-sm hover:shadow-md transition-shadow" // Sombras más suaves y efecto hover
      />
      <StatsCard
        title="Total envíos"
        icon={<CirclePlus className="text-yellow-600" />}
        helperText="Todos los envíos"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-sm hover:shadow-md transition-shadow"
      />
      <StatsCard
        title="Tasa de envíos"
        icon={<MousePointerClick className="text-green-600" />}
        helperText="Vistas en envíos de formularios"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-sm hover:shadow-md transition-shadow"
      />
      <StatsCard
        title="Porcentaje de rebotes"
        icon={<CirclePlus className="text-red-600" />}
        helperText="Visitas que te dejan sin interactuar"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-sm hover:shadow-md transition-shadow"
      />
    </div>
  )
}

// Componente individual para cada tarjeta de estadísticas
export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string
  value: string
  helperText: string
  className: string
  loading: boolean
  icon: ReactNode
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton className="w-24 h-8">
              {" "}
              {/* Define un tamaño para el skeleton */}
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  )
}

// Componente Skeleton para la carga de los formularios
function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary/20 h-[198px] w-full" />
}

// Función asincrónica para obtener los formularios del usuario y renderizar los componentes de las tarjetas de formularios
async function FormCards() {
  const form = await GetForms()
  return (
    <>
      {form.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

// Componente individual para cada tarjeta de formulario
function FormCard({ form }: { form: Form }) {
  return (
    <Card
      className={`flex flex-col border-t-4 ${
        form.published ? "border-t-blue-500" : "border-t-gray-300"
      } shadow-lg hover:shadow-xl transition-shadow duration-300`} // Aplica el borde superior y sombra, con hover
    >
      {/* Asegura que las tarjetas tengan una altura consistente */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold" title={form.name}>
            {form.name}
          </span>
          {form.published && <Badge>Publicado</Badge>}
          {!form.published && <Badge variant={"destructive"}>Borrador</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
          {form.published && (
            <span className="flex items-center gap-2 text-sm">
              <View className="text-muted-foreground h-5 w-5" />
              <span>{form.visits.toLocaleString()}</span>
              <SendHorizontal className="text-muted-foreground h-5 w-5" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow h-[20px] truncate text-sm text-muted-foreground">
        {" "}
        {/* Permite que el contenido crezca y trunca la descripción */}
        {form.description || "No hay descripción"}
      </CardContent>
      <CardFooter className="pt-4">
        {" "}
        {/* Añade padding superior al footer */}
        {form.published ? (
          <div className="flex flex-col sm:flex-row items-center w-full gap-2">
            {" "}
            {/* Diseño responsivo para los botones */}
            <div className="w-full">
              <Button asChild className="w-full text-md gap-4 bg-blue-600 hover:bg-blue-700">
                <Link href={`/forms/${form.id}`}>
                  Ver envíos <ArrowRight className="ml-2 h-4 w-4" /> {/* Añade margen al icono */}
                </Link>
              </Button>
            </div>
            <div className="w-auto">
              <Mas
                formId={form.id}
                showOnlyDelete
                initialName={form.name}
                initialDescription={form.description || ""}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center w-full gap-2">
            {" "}
            {/* Diseño responsivo para los botones */}
            <div className="w-full">
              <Button asChild className="w-full text-md gap-4 bg-gray-600 hover:bg-gray-700">
                <Link href={`/builder/${form.id}`}>
                  Editar formulario <ClipboardPen className="ml-2 h-4 w-4" /> {/* Añade margen al icono */}
                </Link>
              </Button>
            </div>
            <div className="w-auto">
              <Mas formId={form.id} initialName={form.name} initialDescription={form.description || ""} />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
