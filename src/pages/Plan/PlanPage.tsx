import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type GeneratePlanResponse, type ScheduleEntry } from "../../types/study";
import { usePlanById } from "../../hooks/usePlanById";
import "./PlanPage.css";
import { ScheduleOverview } from "../../components/ui/scheduleOverview";
import { Button } from "../../components/ui/button";
import { SquareArrowOutUpRight, Trophy } from "lucide-react";
import { CalendarCustomDays, type StudyDay } from "../../components/ui/plan-calendar";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";


function toStudyDays(entries: ScheduleEntry[]): StudyDay[]{
  return entries.map((e) => ({
    date: e.date,
    type: e.type === "study" ? "study" : e.type,
    title: e.topic,
    content: e.learning_objectives ?? [],
  }));
}

export function PlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const planFromState = location.state?.plan as GeneratePlanResponse | undefined;
  const planId = id ? Number(id) : null;

  const { data: planFromQuery, isLoading, isError } = usePlanById(
    planFromState ? null : planId
  );

  const plan = planFromState ?? planFromQuery;
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const schedule: ScheduleEntry[] = plan?.study_plan ?? [];

  const totalStudy = schedule.length;
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());

  function handleComplete(key: string) { 
    setCompletedKeys(prev => new Set(prev).add(key));
  }
  
  function handleUncomplete(key: string) {
  setCompletedKeys(prev => {
    const next = new Set(prev);
    next.delete(key);
    return next;
  });
}

  const completedCount = completedKeys.size;
  const allDone = completedCount === totalStudy && totalStudy > 0;

  const filtredEntries = selectedDay
    ? schedule.filter((e) => e.date === selectedDay)
    : schedule;

  if (isLoading) return <p>Carregando plano...</p>;
  if (isError)   return <p>Erro ao carregar o plano.</p>;
  if (!plan) { navigate("/"); return null; }
  const currentPlan = plan;

  return (
    <div className="container">
      <h1 className="p-10 text-center">StudyFlow AI</h1>
      <div>
        
          <h2>{plan.plan_summary.plan_title}</h2>
          <p>{plan.plan_summary.summary}</p>
          <h2 className="pt-5">Seu plano está dividido nos seguintes módulos:</h2>
          <div className="flex pt-5 pb-5 gap-4 overflow-x-auto">
          {plan.topics.map((topic) => (
            <Card key={topic.order} className="cursor-pointer hover:scale-105 transition-transform duration-300 max-w-80 max-h-96 rounded-lg border p-4 shadow-sm gap-4 bg-stone-900/65">
              <CardTitle>Modulo {topic.order}: {topic.title}</CardTitle>
              <CardDescription>
                {topic.description}
                <p className="pt-4 font-bold">Objetivos:</p>
                 <ul className="list-disc list-inside flex flex-col gap-1">
                  {topic.learning_objectives?.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </CardDescription>
              <div className="flex justify-between mt-auto">
                <Badge variant="default">Nível de dificuldade: {topic.difficulty}</Badge>
                <Badge variant="default">⏱ {topic.estimated_hours}h estimadas</Badge>
              </div>
            </Card>
          ))}
          </div>
          <strong>Tempo estimado: ⏱ {plan.plan_summary.total_estimated_hours}</strong>        
          <p>💬 {plan.plan_summary.personalized_message}</p>

        <h2 className="pt-5">Selecione um dia no calendário e veja seu plano personalizado</h2>

        <div className="flex flex-row gap-6 items-start mt-10">
          <div className="shrink-0">
            <CalendarCustomDays
              studyPlan={toStudyDays(schedule)}
              onSelectDay={(day, rawDate) => setSelectedDay(day?.date ?? rawDate ?? null)}
              />
          </div>
            <div className="flex-1 min-w-0">
              {selectedDay && filtredEntries.length === 0 && (
                <Card className="w-full h-full rounded-lg border-l-2 p-4 border-l-indigo-700">
                  <CardTitle className="text-sm text-muted-foreground">Nenhuma atividade para este dia.</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Parece que não há atividades agendadas para este dia. Aproveite para revisar conteúdos anteriores ou se preparar para os próximos tópicos!</CardDescription>
                </Card>
              )}

              {selectedDay && filtredEntries.length > 0 && (
                <ScheduleOverview
                  studyPlan={filtredEntries}
                  topics={plan.topics ?? []}
                  completedKeys={completedKeys}
                  onComplete={handleComplete}
                  onUncomplete={handleUncomplete}
                />
              )}
            </div>
          
        </div>

        <h2 className="pt-5">Progresso geral</h2>

        <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${totalStudy > 0 ? (completedCount / totalStudy) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {completedCount}/{totalStudy} concluídos
            </span>
          </div>

          {allDone && (
            <Card className="flex flex-col gap-3 rounded-lg border p-5">
              <div className="flex items-center gap-2">
                <Trophy size={20} />
                <p>Parabéns! Você concluiu todos os tópicos do plano.</p>
              </div>
              <p>Que tal testar seus conhecimentos com um simulado?</p>
              <div className="flex gap-3 mt-1">
                <button type="button" className="form-button" onClick={() => navigate("/api/simulados")}>
                  Fazer Simulado
                </button>
                <button type="button" className="text-sm" onClick={() => navigate("/")}>
                  Fazer Outro Plano
                </button>
              </div>
            </Card>
          )}

        <div className="gap-6 mt-8">
          <h2>Faça um simulado e teste seus conhecimentos</h2>
          <Button variant="ghost" onClick={() => navigate(`/api/simulados/${currentPlan.id}`)}>
            Fazer simulado <SquareArrowOutUpRight />
          </Button>
        </div>
      </div>
    </div>
  );
}