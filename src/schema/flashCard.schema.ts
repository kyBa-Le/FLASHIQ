import { z } from "zod";

export const cardSchema = z.object({
  id: z.string().optional(),
  term: z.string().default(""),
  definition: z.string().default(""),
  example: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
});

export const setSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .nullish()
    .transform((val) => val ?? "")
    .default(""),
  isPublic: z.boolean().default(false),
  cards: z.array(cardSchema).default([]),
});

export type SetFormValues = z.infer<typeof setSchema>;
export type CardFormValues = z.infer<typeof cardSchema>;
