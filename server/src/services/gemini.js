
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getPriorityFromGemini(tasks) {
  if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is missing in environment variables.");
    return [];
  }
  console.log("Using Gemini API Key:", GEMINI_API_KEY.substring(0, 5) + "...");

  const prompt = `
You are a task prioritization assistant.
Given a list of tasks with title, description, due_date, urgency (1-5), workload (1-5),
assign each task:
- priority_score (0-100, higher means more important)
- brief reason (1-2 lines)

Return ONLY a raw JSON array of objects. Do not include any markdown formatting, backticks, or explanation.
Format:
[{ "id": number, "priority_score": number, "reason": string }]

Here are the tasks:
${JSON.stringify(tasks)}
`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
    GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

  console.log("Raw Gemini response text:", text);

  // Clean up markdown code blocks if present
  text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini output parse error:", err, text);
    return [];
  }
}
