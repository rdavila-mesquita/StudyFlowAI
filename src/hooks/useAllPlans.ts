// src/hooks/useAllPlans.ts — listar planos salvos
import { useQuery } from "@tanstack/react-query";
import { fetchAllPlans } from "../api/planApi";

export function useAllPlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchAllPlans,
  });
}