import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

interface StatCardProps extends React.ComponentProps<typeof Card> {
  title: string
  value: string | number
  icon?: React.ElementType
  description?: string
}

export function StatCard({ title, value, icon: Icon, description, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("rounded-xl shadow-md border border-gray-100", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-gray-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
