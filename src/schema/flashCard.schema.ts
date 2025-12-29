import { z } from "zod";

export const cardSchema = z.object({
  id: z.string().optional(),
  term: z.string().max(50, "Term is too long").default(""),
  definition: z.string().max(200, "Definition is too long").default(""),
  example: z.string().max(200, "Example is too long").default(""),
  image_url: z.any().default(""),
});

export const setSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .max(500, "Description is too long")
    .default("")
    .catch(""),
  isPublic: z.boolean().default(false),
  cards: z.array(cardSchema).default([]),
});

export type SetFormValues = z.infer<typeof setSchema>;
export type CardFormValues = z.infer<typeof cardSchema>;
