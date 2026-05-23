import { useState } from "react";
import { useQuestions } from "../../simulator/hooks/useQuestion";
import { Field, FieldLabel } from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { toast } from "sonner";

function Simulator() {
  const { data, isLoading } = useQuestions(2023);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const question = data?.[currentQuestion];

  function handleNextQuestion() {
    if (!answers[currentQuestion]) {
        toast.error(
        "Por favor, selecione uma resposta antes de continuar."
        )
        return
    }

    if (currentQuestion === data!.length - 1) {
        toast.success("Simulado concluído!")
        return
    }

    setCurrentQuestion((prev) => prev + 1)
}

  return (
    <>
      {isLoading ? (
        <p>Carregando questões...</p>
      ) : (
        <>
          {question && (
            <Field>
              <FieldLabel>{question.title}</FieldLabel>
              <p>{question.context}</p>

              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={(value) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion]: value,
                  }));
                }}
                className="mt-4 flex flex-col gap-3"
              >
                {question.alternatives.map((alt) => (
                  <div key={alt.letter} className="flex items-center gap-2">
                    <RadioGroupItem value={alt.letter} id={alt.letter} />
                    <Label htmlFor={alt.letter}>
                      <strong>{alt.letter})</strong> {alt.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-4 flex gap-10">
                <button
                  type="button"
                  className="btn-outline-info"
                  onClick={() => {
                    setCurrentQuestion((prev) => prev - 1);
                  }}
                  disabled={currentQuestion === 0}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="form-button"
                //   disabled={!answers[currentQuestion]}
                  onClick={handleNextQuestion}
                >
                  Próxima Questão
                </button>
              </div>
            </Field>
          )}
        </>
      )}
    </>
  );
}

export default Simulator;
