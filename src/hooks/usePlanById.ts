import { useQuery } from "@tanstack/react-query";
import { fetchPlanById } from "../api/planApi";

export function usePlanById(id: number | null) {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => fetchPlanById(id!),
    enabled: !!id, 
  });
}