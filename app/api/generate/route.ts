import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FitnessFormSchema, FitnessFormInput } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = FitnessFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const user: FitnessFormInput = parsed.data;

    const prompt = `
You are an expert Personal Trainer and Nutritionist.

JOB: Generate a personalized fitness plan.
USER PROFILE: ${JSON.stringify(user)}
STRESS LEVEL: ${user.stress_level || "Normal"}

REQUIREMENTS:
1. **Quote**: A unique, hard-hitting motivational quote based on their goal.
2. **Workout**: 7 Days. Mix of strength & cardio. 
   - Cardio (Walking/Running): Set 'reps' to duration (e.g., "30 mins").
3. **Diet**: Specific meals.
   - **CRITICAL**: Estimate total daily macros (Protein, Carbs, Fats in grams) for the plan.
4. **Posture Tips**: Provide 3 specific tips for maintaining good form during exercises.

OUTPUT FORMAT (Strict JSON):
{
  "quote": "string",
  "summary": "string",
  "macros": { "protein": number, "carbs": number, "fats": number },
  "workout": [
    {
      "day": "string",
      "exercises": [
        { "name": "string", "sets": number, "reps": "string", "rest_seconds": number }
      ]
    }
  ],
  "diet": {
    "breakfast": [{ "name": "string", "calories": number }],
    "lunch": [{ "name": "string", "calories": number }],
    "dinner": [{ "name": "string", "calories": number }],
    "snacks": [{ "name": "string", "calories": number }]
  },
  "tips": ["string"],
  "posture_tips": ["string"]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2500,
          },
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI failed", details: json },
        { status: 500 }
      );
    }

    const aiText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = aiText.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("Invalid JSON");

    const plan = JSON.parse(match[0]);

    return NextResponse.json({ plan });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
