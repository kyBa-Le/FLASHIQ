// src/schemas/set.schema.ts
import { z } from "zod";

export const cardSchema = z.object({
  term: z.string().min(1, "Term is required"),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().optional(),
});

export const setSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),

  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  is_public: z.boolean(),

  cards: z.array(cardSchema).min(1, "At least two card is required"),
});

export type SetFormValues = z.infer<typeof setSchema>;
