import { useState } from "react";
import { api } from "../../service/api";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ReportButtonProps {
  payload: Record<string, unknown>;
  onSuccess?: (result: any) => void;
  disabled?: boolean;
}

export function ReportButton({ payload, onSuccess, disabled }: ReportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (disabled || loading) return;

    setLoading(true);
    try {
      console.log("[ReportButton] Executando com payload:", payload);
      const response = await api.post("/api/agentes/report", payload);
      console.log("[ReportButton] Resposta recebida:", response.data);
      toast.success("Relatório executado com sucesso.");
      onSuccess?.(response.data);
    } catch (error: any) {
      console.error("[ReportButton] Erro:", error);
      const message =
        error?.response?.data?.detail ??
        error?.message ??
        "Erro ao executar o relatório. Verifique os dados e tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={disabled || loading}>
      {loading ? "Criando relatório..." : "Criar Relatório"}
    </Button>
  );
}
