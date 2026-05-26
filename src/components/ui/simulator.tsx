import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../service/api";
import { usePlanById } from "../../hooks/usePlanById";
import type { GeneratePlanResponse } from "../../types/study";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "./field";
import { Input } from "./input";

type ExtendedPlan = GeneratePlanResponse & {
  discipline?: string;
  subject?: string;
  level?: string;
};

type LocationState = {
  plan?: GeneratePlanResponse;
};

type SimulationDetail = {
  pergunta?: string;
  resposta_usuario?: string | null;
  resposta_correta?: string;
  correto?: boolean;
  topico?: string;
  alternativas?: string[];
};

type SimulationOutput = {
  detalhes?: SimulationDetail[];
  questoes?: SimulationDetail[];
  total_questoes?: number;
  acertos?: number;
  percentual_acerto?: number;
  nivel_dificuldade_ajustado?: string;
  por_topico?: Record<string, { total: number; acertos: number; erros: number; percentual_acerto: number }>;
};

type AgentSimulationResponse = {
  step?: string;
  state?: {
    simulation_output?: SimulationOutput;
    metadata?: {
      simulado_id?: string;
    };
  };
  simulation_output?: SimulationOutput;
  metadata?: {
    simulado_id?: string;
  };
};

const USER_ID_STORAGE_KEY = "studyflowai.usuario_id";

function getOrCreateUsuarioId() {
  if (typeof window === "undefined") {
    return "anonymous-user";
  }

  const storedValue = window.localStorage.getItem(USER_ID_STORAGE_KEY);
  if (storedValue) {
    return storedValue;
  }

  const generatedValue =
    globalThis.crypto?.randomUUID?.() ??
    `anonymous-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(USER_ID_STORAGE_KEY, generatedValue);

  return generatedValue;
}

function normalizeLevel(level?: string) {
  const normalized = (level ?? "").trim().toLowerCase();

  if (["iniciante", "beginner"].includes(normalized)) return "iniciante";
  if (["avancado", "advanced"].includes(normalized)) return "avancado";
  return "intermediario";
}

function getQuestionKey(question: SimulationDetail, index: number) {
  return `${question.topico ?? "question"}-${index}`;
}

function Simulator() {
  const location = useLocation();
  const { id } = useParams();
  const state = location.state as LocationState | null;
  const planId = id ? Number(id) : null;

  const { data: planFromQuery, isLoading: isLoadingPlan } = usePlanById(state?.plan ? null : planId);
  const plan = (state?.plan ?? planFromQuery) as ExtendedPlan | undefined;

  const [usuarioId] = useState(() => getOrCreateUsuarioId());
  const [quantityQuestions, setQuantityQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<AgentSimulationResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState(false);

  const derivedDiscipline = plan?.discipline ?? plan?.plan_summary.plan_title ?? "";
  const derivedSubject = plan?.subject ?? plan?.plan_summary.summary ?? "";
  const derivedLevel = normalizeLevel(plan?.level);

  const derivedTopics = useMemo(() => {
    if (!plan) return [] as string[];

    const topics = plan.study_plan
      .map((entry) => entry.topic.trim())
      .filter(Boolean);

    return [...new Set(topics)];
  }, [plan]);

  const simulation = response?.state?.simulation_output ?? response?.simulation_output ?? null;
  const questions = simulation?.detalhes ?? simulation?.questoes ?? [];
  const answeredCount = useMemo(
    () => questions.filter((question, index) => Boolean(answers[getQuestionKey(question, index)])).length,
    [answers, questions]
  );
  const correctCount = useMemo(() => {
    return questions.reduce((total, question, index) => {
      const key = getQuestionKey(question, index);
      const selectedAnswer = answers[key];

      if (!selectedAnswer || !question.resposta_correta) {
        return total;
      }

      return total + (selectedAnswer === question.resposta_correta ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const totalQuestions = simulation?.total_questoes ?? questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const adjustedDifficulty = simulation?.nivel_dificuldade_ajustado;

  function handleAnswerChange(questionKey: string, answer: string) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: answer,
    }));
  }

  function handleSubmitAnswers() {
    setSubmittedAnswers(true);
  }

  async function handleGenerateSimulation() {
    if (!plan) {
      setError("Não foi possível carregar o plano para gerar o simulado.");
      return;
    }

    if (derivedTopics.length === 0) {
      setError("O plano não trouxe tópicos para gerar o simulado.");
      return;
    }

    if (!Number.isFinite(quantityQuestions) || quantityQuestions < 1) {
      setError("Informe uma quantidade válida de questões.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse(null);
      setAnswers({});
      setSubmittedAnswers(false);

      const result = await api.post<AgentSimulationResponse>(
        "/api/agentes/simulation",
        {
          usuario_id: usuarioId,
          session_id: planId ? `plan-${planId}` : undefined,
          current_plan: {
            discipline: derivedDiscipline,
            subject: derivedSubject,
            topics: derivedTopics,
          },
          quantity_questions: quantityQuestions,
          simulation_input: {
            nivel_dificuldade: derivedLevel,
            respostas: [],
          },
        },
        {
          timeout: 120000,
        }
      );

      setResponse(result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao gerar simulado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingPlan) {
    return <p>Carregando plano...</p>;
  }

  return (
    <div style={{ color: '#000' }} className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight ">Simulado via agente</h2>
        <p className="text-sm text-slate-600">
          Os dados do plano são preenchidos automaticamente. Informe apenas a quantidade de questões.
        </p>
      </header>

      <FieldSet>
        <FieldDescription>
          O payload enviado ao backend usa a disciplina, o conteúdo, os tópicos e o nível derivados do plano atual.
        </FieldDescription>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Disciplina</FieldLabel>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {derivedDiscipline || "Plano sem disciplina"}
            </p>
          </Field>

          <Field>
            <FieldLabel>Conteúdo</FieldLabel>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {derivedSubject || "Plano sem conteúdo"}
            </p>
          </Field>

          <Field>
            <FieldLabel>Nível</FieldLabel>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {derivedLevel}
            </p>
          </Field>


          <Field className="md:col-span-2">
            <FieldLabel>Tópicos</FieldLabel>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {derivedTopics.length > 0 ? derivedTopics.join(", ") : "Nenhum tópico encontrado"}
            </p>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex gap-3">
        <button type="button" className="form-button" onClick={handleGenerateSimulation} disabled={loading}>
          {loading ? "Gerando..." : "Gerar simulado"}
        </button>
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {response ? (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Questões</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{totalQuestions}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Respondidas</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{answeredCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Acertos</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{submittedAnswers ? correctCount : "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Percentual</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{submittedAnswers ? `${scorePercent}%` : "-"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            {adjustedDifficulty ? <span><strong>Nível ajustado:</strong> {adjustedDifficulty}</span> : null}
          </div>

          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <article key={getQuestionKey(question, index)} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{question.topico ?? `Questão ${index + 1}`}</p>
                      <p className="mt-3 text-sm text-slate-800">{question.pergunta ?? "Questão gerada pelo agente."}</p>
                    </div>
                    {submittedAnswers ? (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${answers[getQuestionKey(question, index)] === question.resposta_correta ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {answers[getQuestionKey(question, index)] === question.resposta_correta ? "Correta" : "Incorreta"}
                      </span>
                    ) : null}
                  </div>

                  {answers[getQuestionKey(question, index)] ? (
                    <p className="mt-3 text-xs text-slate-500">
                      <strong>Sua resposta:</strong> {answers[getQuestionKey(question, index)]}
                    </p>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    {(question.alternativas?.length ? question.alternativas : question.resposta_correta ? [question.resposta_correta] : []).map((alternative) => {
                      const questionKey = getQuestionKey(question, index);
                      const selected = answers[questionKey] === alternative;
                      const isCorrect = submittedAnswers && alternative === question.resposta_correta;
                      const isWrongSelection = submittedAnswers && selected && alternative !== question.resposta_correta;

                      return (
                        <label
                          key={alternative}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${selected ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-white"} ${isCorrect ? "border-emerald-400 bg-emerald-50" : ""} ${isWrongSelection ? "border-rose-400 bg-rose-50" : ""}`}
                        >
                          <input
                            type="radio"
                            name={questionKey}
                            value={alternative}
                            checked={selected}
                            onChange={() => handleAnswerChange(questionKey, alternative)}
                            className="h-4 w-4"
                          />
                          <span className="text-slate-700">{alternative}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submittedAnswers && question.resposta_correta ? (
                    <p className="mt-3 text-xs text-slate-500">
                      <strong>Resposta correta:</strong> {question.resposta_correta}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          {questions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="form-button" onClick={handleSubmitAnswers}>
                Ver resultado final
              </button>
              <p className="text-sm text-slate-600">Selecione uma alternativa por questão e clique para ver seu total de acertos.</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default Simulator;