"use client"
import * as React from "react"
import { parseDate } from "chrono-node"
import { CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Calendar } from "./calendar"
import { Field } from "./field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

function formatDisplay(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toISO(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

function getDaysRemaining(date: Date | undefined): string {
  if (!date) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return "Tarde demais para estudar para a prova";
  if (diff === 0) return "Hoje";
  return `Faltam ${diff} dias até a prova`;
}

interface DatePickerProps {
  value: string;               
  onChange: (iso: string) => void; 
}

export function DatePickerNaturalLanguage({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState(
    value ? formatDisplay(new Date(value + "T00:00:00")) : ""
  );
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value + "T00:00:00") : undefined
  );

  function applyDate(newDate: Date | undefined) {
    setDate(newDate);
    setInputText(formatDisplay(newDate));
    onChange(toISO(newDate));
  }

  return (
    <Field className="mx-auto max-w-xs">
      <InputGroup>
        <InputGroupInput
          id="date-optional"
          value={inputText}
          placeholder="Selecione uma data"
          onChange={(e) => {
            setInputText(e.target.value);
            const parsed = parseDate(e.target.value);
            if (parsed) applyDate(parsed);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Selecionar data"
              >
                <CalendarIcon />
                <span className="sr-only">Selecione uma data</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={8}>
              <Calendar
                locale={ptBR}
                mode="single"
                selected={date}
                captionLayout="dropdown"
                defaultMonth={date}
                onSelect={(d) => {
                  applyDate(d);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <div className="px-1 text-sm text-muted-foreground">
        <span className="font-medium">{getDaysRemaining(date)}</span>
      </div>
    </Field>
  );
}