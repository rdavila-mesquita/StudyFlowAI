import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type GeneratePlanResponse } from "../../types/study";
import { usePlanById } from "../../hooks/usePlanById";
import "./PlanPage.css";
import { ScheduleOverview } from "../../components/ui/scheduleOverview";
import { Button } from "../../components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";


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

  if (isLoading) return <p>Carregando plano...</p>;
  if (isError)   return <p>Erro ao carregar o plano.</p>;
  if (!plan) { navigate("/"); return null; }
  const currentPlan = plan;

  return (
    <div className="container">
      <h1 className="flex text-center p-4">StudyFlow AI</h1>
      <div className="plan-container">
        <h2>{plan.plan_summary.plan_title}</h2>
        <p>{plan.plan_summary.summary}</p>
        <strong>Tempo estimado: ⏱ {plan.plan_summary.total_estimated_hours}</strong>
        <p>💬 {plan.plan_summary.personalized_message}</p>

        <div className="flex flex-col gap-6 mt-6">
          <ScheduleOverview studyPlan={plan.study_plan} />
        </div>

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