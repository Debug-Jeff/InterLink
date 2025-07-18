"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface EngagementChartProps {
  data: { month: string; clients: number; projects: number }[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <Card className="rounded-xl shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Engagement Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            clients: {
              label: "Clients",
              color: "hsl(var(--logo-blue))",
            },
            projects: {
              label: "Projects",
              color: "hsl(var(--logo-orange))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-sm text-gray-500" />
              <YAxis tickLine={false} axisLine={false} className="text-sm text-gray-500" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="clients"
                stroke="var(--color-clients)"
                fill="var(--color-clients)"
                fillOpacity={0.3}
                name="Active Clients"
              />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="var(--color-projects)"
                fill="var(--color-projects)"
                fillOpacity={0.3}
                name="Ongoing Projects"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
