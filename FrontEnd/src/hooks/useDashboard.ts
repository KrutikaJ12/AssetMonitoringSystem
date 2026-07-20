import { getDashboard } from "../api/dashboardApi"
import { useQuery } from "@tanstack/react-query";
export const useDashboard=()=>{
  return useQuery({
    queryKey:['/dashboard'],
    queryFn:getDashboard
  })

}