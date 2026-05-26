import { BookOpen, Calendar, Clock, RefreshCcw } from "lucide-react";
import type { ScheduleEntry, Topic } from "../../types/study";
import { Badge } from "./badge";
import { Card } from "./card";
import { useState } from "react";
import { Field, FieldLabel } from "./field";
import { Label } from "./label";
import { Input } from "./input";
import { Checkbox } from "./checkbox";

const RESOURCE_ICON: Record<string, string> = {
  video: "▶",
  exercício: "✏️",
  livro: "📖",
  projeto: "💻",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });
}

type StudyCardProps = {
  entry: ScheduleEntry;
  topic: Topic | null;
  onComplete: () => void;
  onUncomplete: () => void;
};

function StudyCard({ entry, topic, onComplete, onUncomplete }: StudyCardProps) {
  const [checked, setChecked] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  function handleCheck(value: boolean) {
    setChecked(value);
    if (value) {
      setShowReason(false);
      onComplete();
    } else {
      onUncomplete();
    }
  }

  return (
    <Card className="max-w-96 rounded-lg border p-4 shadow-sm gap-4">
      <div className="flex justify-between">
        <Badge variant="secondary">
          <Calendar data-icon="inline-start" />{formatDate(entry.date)}
        </Badge>
        {entry.hours && (
          <Badge variant="secondary">
            <Clock data-icon="inline-end" /> {entry.hours}h
          </Badge>
        )}
        <Badge variant="outline">
          <BookOpen data-icon="inline-end" /> Estudo
        </Badge>
      </div>

      <p className="day-title">{entry.topic}</p>

      {entry.learning_objectives && entry.learning_objectives.length > 0 && (
        <>
          <p className="section-label">Objetivos</p>
          <div className="tag-list">
            {entry.learning_objectives.map((obj, i) => (
              <span key={i} className="tag">{obj}</span>
            ))}
          </div>
        </>
      )}

      {topic?.suggested_resource && (
        <>
          <hr className="divider" />
          <p className="section-label">Dicas</p>
          <span className="tag">
            {RESOURCE_ICON[topic.suggested_resource.type] || "📚"} {topic.suggested_resource.description}
          </span>
        </>
      )}

      {entry.completion_criteria && (
        <>
          <hr className="divider" />
          <p className="section-label">Critério de conclusão</p>
          <span className="tag">✓ {entry.completion_criteria}</span>
        </>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Checkbox
          id={`done-${entry.date}-${entry.order}`}
          checked={checked}
          onCheckedChange={handleCheck}
        />
        <Label htmlFor={`done-${entry.date}-${entry.order}`} className="text-sm cursor-pointer">
          Marcar como concluído
        </Label>
      </div>

      {checked && (
        <Badge variant="secondary" className="mt-3">✓ Concluído</Badge>
      )}

      {!checked && (
        <div className="mt-2 flex items-center gap-2">
          <Checkbox
            id={`failed-${entry.date}-${entry.order}`}
            checked={showReason}
            onCheckedChange={(v) => setShowReason(!!v)}
          />
          <Label
            htmlFor={`failed-${entry.date}-${entry.order}`}
            className="text-sm cursor-pointer text-muted-foreground"
          >
            Não consegui concluir
          </Label>
        </div>
      )}

      {!checked && showReason && (
        <>
          <Field className="mt-4">
            <FieldLabel htmlFor={`reason-${entry.order}`}>
              Explique porque não conseguiu concluir:
            </FieldLabel>
            <Input
              id={`reason-${entry.order}`}
              autoComplete="off"
              placeholder="Conteúdo muito complicado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
          <button type="button" className="form-button mt-4">
            Refazer Plano de Estudo
          </button>
        </>
      )}
    </Card>
  );
}

function ReviewCard({ entry }: { entry: ScheduleEntry }) {
  return (
    <Card className="w-full h-full rounded-lg border-l-2 p-4 border-l-orange-500">
      <div className="review-header flex items-center gap-2">
        <Badge variant="outline"><RefreshCcw /> Revisão</Badge>
        <Badge variant="secondary">
          <Calendar data-icon="inline-start" />{formatDate(entry.date)}
        </Badge>
      </div>
      <p className="review-title">{entry.topic}</p>
      <p className="review-sub">Revisão espaçada — reforce o que aprendeu sobre este tópico</p>
    </Card>
  );
}

type ScheduleOverviewProps = {
  studyPlan: ScheduleEntry[];
  topics: Topic[];
  completedCount: number;
  onComplete: () => void;
  onUncomplete: () => void;
};

export function ScheduleOverview({
  studyPlan,
  topics,
  onComplete,
  onUncomplete,
}: ScheduleOverviewProps) {
  const studyEntries = studyPlan.filter(e => e.type === "study");
  const reviewEntries = studyPlan.filter(e => e.type === "review");

  return (
    <div className="flex flex-col gap-4 w-full">
      <section>
        <div className="flex flex-col gap-4">
          {studyEntries.map((entry, i) => {
            const topic = topics.find(t => t.order === entry.order) ?? null;
            return (
              <div key={i} className="shrink-0">
                <StudyCard
                  entry={entry}
                  topic={topic}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4">
          {reviewEntries.map((entry, i) => (
            <div key={i} className="shrink-0">
              <ReviewCard entry={entry} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}