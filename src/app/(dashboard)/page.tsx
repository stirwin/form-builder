import Image from "next/image";
import { GetFormStats } from "../../../actions/form";
import { BookText, CirclePlus, MousePointerClick } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/form/CreateFormBtn";

// Componente principal Home
export default function Home() {
  return (
    <div className="container pt-4">
      {/* Suspense para manejar la carga asincrónica de las estadísticas */}
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
        <h2 className="text-4xl font-bold col-span-2">Tus formularios</h2>
      <Separator className="my-6" />
      <CreateFormBtn/>
    </div>
  );
}

// Función asincrónica para obtener las estadísticas del formulario y renderizar los componentes de las tarjetas
async function CardStatsWrapper() {
  const stats = await GetFormStats();

  return <StatsCards loading={false} data={stats} />;
}

// Propiedades del componente StatsCard
interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

// Componente para mostrar las tarjetas de estadísticas
function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visitas"
        icon={<BookText className="text-blue-600" />}
        helperText="Todas las visitas"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total envíos"
        icon={<CirclePlus className="text-yellow-600" />}
        helperText="Todos los envíos"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Tasa de envíos"
        icon={<MousePointerClick className="text-green-600" />}
        helperText="Vistas en envíos de formularios"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Porcentaje de rebotes"
        icon={<CirclePlus className="text-red-600" />}
        helperText="Visitas que te dejan sin interactuar"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

// Componente individual para cada tarjeta de estadísticas
function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}
