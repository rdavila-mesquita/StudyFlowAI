"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"

import { Calendar, CalendarDayButton } from "./calendar"
import { Card, CardContent } from "./card"

export type StudyDay = {
  date: string
  formatedDate?: string
  type: "study" | "exam"
  title: string
  content: string[]
}

type Props = {
  studyPlan: StudyDay[]
  onSelectDay: (day: StudyDay | null) => void
}

export function CalendarCustomDays({
  studyPlan,
  onSelectDay,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  return (
    <Card className="p-0" style={{ width: "750px", minWidth: "750px" }}>
      <CardContent className="p-0">
        <Calendar
          locale={ptBR}
          mode="single"
          numberOfMonths={1}
          captionLayout="dropdown"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)

            if (!date) {
              onSelectDay(null)
              return
            }

            const isoDate = date
              .toISOString()
              .split("T")[0]

            const studyDay = studyPlan.find(
              (item) => item.date === isoDate
            )

            onSelectDay(studyDay ?? null)
          }}
          className="[--cell-size:--spacing(14)] md:[--cell-size:--spacing(16)]"
          formatters={{
            formatMonthDropdown: (date) => {
              return date.toLocaleString("pt-BR", {
                month: "long",
              })
            },

            formatWeekdayName: (date) => {
              return date.toLocaleDateString("pt-BR", {
                weekday: "short",
              })
            },
          }}
          components={{
            DayButton: ({
              children,
              modifiers,
              day,
              ...props
            }) => {
              const isoDate = day.date
                .toISOString()
                .split("T")[0]

              const studyDay = studyPlan.find(
                (item) => item.date === isoDate
              )

              return (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  {...props}
                  className={`
                    min-h-80px
                    items-start
                    justify-start
                    p-2
                    text-left
                  `}
                >
                  <span className="text-sm font-medium">
                    {children}
                  </span>

                  {!modifiers.outside && studyDay && (
                    <span
                      className={`
                        mt-1
                        rounded-full
                        px-2
                        py-0.5
                        text-[10px]
                        font-medium
                        ${
                          studyDay.type === "exam"
                            ? "bg-red-500/15 text-red-500"
                            : "bg-violet-500/15 text-violet-500"
                        }
                      `}
                    >
                      {studyDay.type === "exam"
                        ? "Simulado"
                        : "Estudar"}
                    </span>
                  )}
                </CalendarDayButton>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}