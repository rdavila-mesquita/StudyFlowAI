import { api } from "../service/api";
import type { GeneratePlanRequest, GeneratePlanResponse } from "../types/study";

export async function generatePlan(
  payload: GeneratePlanRequest
): Promise<GeneratePlanResponse> {
  const response = await api.post<GeneratePlanResponse>("/api/planos", payload);
  return response.data;
}

export async function fetchPlanById(id: number): Promise<GeneratePlanResponse> {
  const response = await api.get<GeneratePlanResponse>(`/api/planos/${id}`);
  return response.data;
}

export async function fetchAllPlans(): Promise<GeneratePlanResponse[]> {
  const response = await api.get<GeneratePlanResponse[]>("/api/planos");
  return response.data;
}