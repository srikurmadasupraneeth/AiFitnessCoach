export type Exercise = {
  name: string;
  sets: number;
  reps?: string;
  rest_seconds?: number;
  notes?: string;
};

export type DailyWorkout = {
  day: string;
  exercises: Exercise[];
};

export type Meal = {
  name: string;
  calories?: number;
  proteins_g?: number;
  carbs_g?: number;
  fats_g?: number;
  notes?: string;
};

export type GeneratedPlan = {
  quote?: string;
  summary?: string;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  workout: DailyWorkout[];
  diet: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks?: Meal[];
  };
  tips?: string[];
  posture_tips?: string[];
};
