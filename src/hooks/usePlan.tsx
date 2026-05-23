import { useState } from "react";
import { generatePlan } from "../api/planApi";
import type {
  GeneratePlanRequest,
  GeneratePlanResponse,
} from "../types/study";

interface UsePlanReturn {
  data: GeneratePlanResponse | null;
  loading: boolean;
  error: string | null;
  submit: (payload: GeneratePlanRequest) => Promise<void>;
  reset: () => void;
}

export function usePlan(): UsePlanReturn {
  const [data, setData] = useState<GeneratePlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: GeneratePlanRequest) {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan(payload);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setError(null);
  }

  return { data, loading, error, submit, reset };
}