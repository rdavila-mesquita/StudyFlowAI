import { BookOpen, Calendar, Clock, RefreshCcw, Trophy } from "lucide-react";
import type { ScheduleEntry } from "../../types/study";
import { Badge } from "./badge";
import { Card } from "./card";
import { useState } from "react";
import { Field, FieldLabel } from "./field";
import { Label } from "./label";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { useNavigate } from "react-router-dom";

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
  onComplete: () => void;
  onUncomplete: () => void;
};

function StudyCard({ entry, onComplete, onUncomplete }: StudyCardProps) {
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
    <Card className="max-w-96 rounded-lg border p-4 shadow-sm">
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

      {entry.study_tips && entry.study_tips.length > 0 && (
        <>
          <hr className="divider" />
          <p className="section-label">Dicas</p>
          <div className="tag-list">
            {entry.study_tips.map((tip, i) => (
              <span key={i} className="tag">
                {RESOURCE_ICON["exercício"]} {tip}
              </span>
            ))}
          </div>
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
        <Label
          htmlFor={`done-${entry.date}-${entry.order}`}
          className="text-sm cursor-pointer"
        >
          Marcar como concluído
        </Label>
      </div>

      {checked && (
        <Badge variant="secondary" className="mt-3">
          ✓ Concluído
        </Badge>
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
    <Card className="w-full h-full rounded-lg border-l-2 p-4 border-l-indigo-700">
      <div className="review-header flex items-center gap-2">
        <Badge variant="outline">
          <RefreshCcw /> Revisão
        </Badge>
        <Badge variant="secondary">
          <Calendar data-icon="inline-start" />{formatDate(entry.date)}
        </Badge>
      </div>
      <p className="review-title">{entry.topic}</p>
      <p className="review-sub">
        Revisão espaçada — reforce o que aprendeu sobre este tópico
      </p>
    </Card>
  );
}

export function ScheduleOverview({ studyPlan }: { studyPlan: ScheduleEntry[] }) {
  const studyEntries = studyPlan.filter(e => e.type === "study");
  const reviewEntries = studyPlan.filter(e => e.type === "review");
  const total = studyEntries.length;

  const [completedCount, setCompletedCount] = useState(0);
  const allDone = completedCount === total && total > 0;
  const navigate = useNavigate();


  function handleComplete() {
    setCompletedCount(prev => prev + 1);
  }

  function handleUncomplete(){
    setCompletedCount(prev => Math.max(0, prev - 1));
  }

  return (
    <div className="flex flex-col gap-10 w-full">

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {completedCount}/{total} concluídos
        </span>
      </div>

      {allDone && (
        <Card className="flex flex-col gap-3 rounded-lg border p-5">
          <div className="flex items-center gap-2">
            <Trophy size={20} />
            <p>
              Parabéns! Você concluiu todos os tópicos do plano.
            </p>
          </div>
          <p>
            Que tal testar seus conhecimentos com um simulado?
          </p>
          <div className="flex gap-3 mt-1">
            <button type="button" className="form-button">
              Fazer Simulado
            </button>
            <button
              type="button"
              className="text-sm"
              onClick={() => navigate("/api/simulados")}
            >
              Fazer Outro Plano
            </button>
          </div>
        </Card>
      )}

      <section>
        <h3 className="text-sm text-muted-foreground mb-3">Dias de estudo</h3>
        <div className="flex flex-row gap-4 overflow-x-auto pb-3">
          {studyEntries.map((entry, i) => (
            <div key={i} className="shrink-0">
              <StudyCard entry={entry} onComplete={handleComplete} onUncomplete={handleUncomplete}/>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm text-muted-foreground mb-3">Revisões</h3>
        <div className="flex flex-row gap-4 overflow-x-auto pb-7">
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