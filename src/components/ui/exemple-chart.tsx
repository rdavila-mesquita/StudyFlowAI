"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const chartData = [
  { date: "2026-05-01", completed: 2, simulated: 20 },
  { date: "2026-05-02", completed: 3, simulated: 35 },
  { date: "2026-05-03", completed: 1, simulated: 10 },
  { date: "2026-05-04", completed: 4, simulated: 40 },
  { date: "2026-05-05", completed: 5, simulated: 60 },
  { date: "2026-05-06", completed: 3, simulated: 45 },
  { date: "2026-05-07", completed: 6, simulated: 70 },
  { date: "2026-05-08", completed: 2, simulated: 25 },
  { date: "2026-05-09", completed: 4, simulated: 50 },
  { date: "2026-05-10", completed: 5, simulated: 80 },
]

const chartConfig = {
  completed: {
    label: "Sessões concluídas",
    color: "#3b82f6",
  },

  simulated: {
    label: "Questões acertadas",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function StudyPerformanceChart() {
  const [timeRange, setTimeRange] =
    React.useState("30d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)

    const referenceDate = new Date("2026-05-10")

    let daysToSubtract = 30

    if (timeRange === "7d") {
      daysToSubtract = 7
    }

    if (timeRange === "90d") {
      daysToSubtract = 90
    }

    const startDate = new Date(referenceDate)

    startDate.setDate(
      startDate.getDate() - daysToSubtract
    )

    return date >= startDate
  })

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-white rounded-3xl overflow-hidden">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-zinc-800 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl">
            Desempenho nos Estudos
          </CardTitle>

          <CardDescription className="text-zinc-400">
            Acompanhe sua evolução diária nos estudos e simulados
          </CardDescription>
        </div>

        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger
            className="hidden w-[180px] rounded-xl border-zinc-700 bg-zinc-900 text-white sm:ml-auto sm:flex"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Últimos 30 dias" />
          </SelectTrigger>

          <SelectContent className="rounded-xl border-zinc-700 bg-zinc-900 text-white">
            <SelectItem value="90d">
              Últimos 90 dias
            </SelectItem>

            <SelectItem value="30d">
              Últimos 30 dias
            </SelectItem>

            <SelectItem value="7d">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillCompleted"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient
                  id="fillSimulated"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#27272a"
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                stroke="#71717a"
                tickFormatter={(value) => {
                  const date = new Date(value)

                  return date.toLocaleDateString(
                    "pt-BR",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(
                        value
                      ).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="completed"
                type="natural"
                fill="url(#fillCompleted)"
                stroke="#3b82f6"
                strokeWidth={3}
                style={{
                  filter:
                    "drop-shadow(0 0 8px #3b82f6)",
                }}
              />

              <Area
                dataKey="simulated"
                type="natural"
                fill="url(#fillSimulated)"
                stroke="#8b5cf6"
                strokeWidth={3}
                style={{
                  filter:
                    "drop-shadow(0 0 8px #8b5cf6)",
                }}
              />

              <ChartLegend
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}