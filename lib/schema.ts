import { z } from "zod";

export const FitnessFormSchema = z.object({
  name: z.string().min(1, "Name required"),
  age: z.coerce.number().int().min(10).max(100),
  gender: z.enum(["male", "female", "other"]),
  height_cm: z.coerce.number().min(50).max(250),
  weight_kg: z.coerce.number().min(20).max(500),
  goal: z.enum(["weight_loss", "muscle_gain", "maintenance"]),
  fitness_level: z.enum(["beginner", "intermediate", "advanced"]),
  location: z.enum(["home", "gym", "outdoor"]),
  diet_pref: z
    .enum(["veg", "non-veg", "vegan", "keto", "pescatarian"])
    .optional(),
  stress_level: z.enum(["low", "medium", "high"]).optional(),
  medical_history: z.string().optional(),
});

export type FitnessFormInput = z.infer<typeof FitnessFormSchema>;
