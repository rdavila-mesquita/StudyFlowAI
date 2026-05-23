import { api } from "../service/api";
import type { GeneratePlanRequest, GeneratePlanResponse } from "../types/study";

const BASE_URL = "http://localhost:8000";

export async function generatePlan(
  payload: GeneratePlanRequest
): Promise<GeneratePlanResponse> {
  const res = await fetch(`${BASE_URL}/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail ?? "Failed to generate plan");
  }

  return res.json();
}

export async function fetchPlanById(id: number): Promise<GeneratePlanResponse> {
  const response = await api.get<GeneratePlanResponse>(`/plans/${id}`);
  return response.data;
}

export async function fetchAllPlans(): Promise<GeneratePlanResponse[]> {
  const response = await api.get<GeneratePlanResponse[]>("/plans");
  return response.data;
}