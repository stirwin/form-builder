// src/components/charts/FormResponsesChart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FormResponsesChartProps {
  data: Array<{
    name: string;
    average: number;
    totalResponses: number;
  }>;
}

export function FormResponsesChart({ data }: FormResponsesChartProps) {
  console.log("Datos recibidos en la gráfica:", data); // Debug

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay datos disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No hay respuestas numéricas para mostrar en este formulario.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>

      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 2]} tickCount={3} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                value.toFixed(2), 
                `Promedio (${props.payload.totalResponses} respuestas)`
              ]}
            />
            <Bar 
              dataKey="average" 
              name="Promedio" 
              fill="#8EC5FF" 
              radius={[0, 4, 4, 0]}
              label={{ 
                position: 'right',
                formatter: (value: any) => value.toFixed(2),
                fill: '#666',
                fontSize: 12
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}