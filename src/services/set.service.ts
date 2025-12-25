
import apiClient from "./apiClient";
import type { CreateSetDto } from "@/types/types";

export function createSet(payload: CreateSetDto) {
  return apiClient.post("/sets", payload);
}