import { useState } from "react";
import { DatePickerNaturalLanguage } from "../../components/ui/datepicker";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import type { GeneratePlanResponse } from "../../types/study";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { ReportButton } from "../../components/Button/reportButton";
import { mockStudyStatePayload } from "../../mocks/studyStatePayloadMock";
import "./Home.css";


function Home() {
  const [discipline, setDiscipline] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [examDate, setExamDate] = useState("");        
  const [loading, setLoading] = useState(false);
  const [useMockPayload, setUseMockPayload] = useState(false);

  const navigate = useNavigate();

  async function handleGeneratePlan() {
    if (!discipline) return toast.warning("Por favor, informe a disciplina!");
    if (!subject)    return toast.warning("Por favor, informe o conteúdo!");
    if (!level)      return toast.warning("Por favor, selecione o nível!");
    if (!examDate)   return toast.warning("Por favor, selecione a data da prova!");
    if (!hoursPerDay) return toast.warning("Por favor, informe a carga horária diária!");
    if (examDate < new Date().toISOString().split("T")[0])
      return toast.warning("Por favor, informe uma data futura!");

    try {
      setLoading(true);
      const response = await api.post<GeneratePlanResponse>("/api/planos", {
        discipline,
        subject,
        level,
        exam_date: examDate,
        hours_per_day: Number(hoursPerDay),
      });
      
      navigate(`api/planos/${response.data.id}`, { state: { plan: response.data } })
    } catch {
      toast.error("Erro ao gerar o plano. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleReportSuccess(result: any) {
    const reportStateData = result?.state ?? result;
    const reportIdResult =
      reportStateData?.report_id ?? reportStateData?.id ?? result?.report_id ?? "";

    const targetId = reportIdResult ? String(reportIdResult) : "preview";
    navigate(`/api/relatorios/${targetId}`, { state: { report: result } });
  }

  const reportPayload = useMockPayload
    ? mockStudyStatePayload
    : {
        discipline,
        subject,
        level,
        exam_date: examDate,
        hours_per_day: hoursPerDay ? Number(hoursPerDay) : undefined,
      };

  return (
    <div className="container">
      <div className="hero">
        <h1 className="hero-title">StudyFlowAI</h1>
        <p className="hero-description">
          Seu assistente de planejamento de estudos inteligente.
        </p>
      </div>

      <div className="form-container">
        <h2 className="form-title">Crie seu plano de estudos personalizado</h2>
        <div className="form">
          <FieldSet>
            <FieldDescription>Personalize seu plano.</FieldDescription>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field>
                <FieldLabel htmlFor="discipline">Disciplina</FieldLabel>
                <Input
                  id="discipline"
                  autoComplete="off"
                  placeholder="Banco de dados"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="content">Conteúdo</FieldLabel>
                <Input
                  id="content"
                  autoComplete="off"
                  placeholder="SQL"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Nível</FieldLabel>
                <RadioGroup className="w-fit" value={level} onValueChange={setLevel}>
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="beginner" id="r1" />
                      <Label htmlFor="r1">Iniciante</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="intermediate" id="r2" />
                      <Label htmlFor="r2">Intermediário</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="advanced" id="r3" />
                      <Label htmlFor="r3">Avançado</Label>
                    </div>
                  </div>
                </RadioGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="daily-hours">Carga horária diária</FieldLabel>
                <Input
                  id="daily-hours"
                  type="number"
                  autoComplete="off"
                  placeholder="2"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                />
              </Field>

              <Field className="min-w-0">
                <FieldLabel htmlFor="exam-date">Dia da prova</FieldLabel>
                <DatePickerNaturalLanguage
                  value={examDate}
                  onChange={(iso) => setExamDate(iso)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        <button
          type="button"
          className="form-button"
          onClick={handleGeneratePlan}
          disabled={loading}
        >
          {loading ? "Gerando..." : "Gerar Plano"}
        </button>

        <button
          type="button"
          className="form-button"
          onClick={() => setUseMockPayload((prev) => !prev)}
          disabled={loading}
        >
          {useMockPayload ? "Usando mock de teste" : "Ativar mock de teste"}
        </button>

        {useMockPayload && (
          <div className="mock-note">
            Mock ativo: o payload de teste será usado pelo botão Executar Relatório.
          </div>
        )}

        <div className="report-actions">
          <div className="report-buttons">
            <ReportButton
              payload={reportPayload}
              onSuccess={handleReportSuccess}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;