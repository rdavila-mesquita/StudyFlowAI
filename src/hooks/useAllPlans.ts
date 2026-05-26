import { useQuery } from "@tanstack/react-query";
import { fetchAllPlans } from "../api/planApi";

export function useAllPlans() {
  return useQuery({
    queryKey: ["planos"],
    queryFn: fetchAllPlans,
  });
}