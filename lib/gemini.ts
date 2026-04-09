import Groq from "groq-sdk";

export type ChatAnalysis = {
  overallAssessment: string;
  conversationBalance: "good" | "talked_too_much" | "too_quiet";
  questionQuality: "surface" | "mixed" | "substantive";
  nextStepEstablished: boolean;
  nextStep: string;
  keyLearnings: string[];
  coachingTips: string[];
  followUpDraft: string;
};

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a networking coach analyzing coffee chat transcripts for college students.
Your response must be a single valid JSON object — no transcript echo, no explanation, no markdown, no code fences.
Output only this JSON shape:
{
  "overallAssessment": "2-3 sentence summary of how the chat went",
  "conversationBalance": "good",
  "questionQuality": "mixed",
  "nextStepEstablished": false,
  "nextStep": "None identified",
  "keyLearnings": ["learning 1", "learning 2"],
  "coachingTips": ["tip 1", "tip 2", "tip 3"],
  "followUpDraft": "full follow-up message draft"
}
Allowed values — conversationBalance: "good" | "talked_too_much" | "too_quiet". questionQuality: "surface" | "mixed" | "substantive".`;

export async function analyzeTranscript(
  transcript: string
): Promise<ChatAnalysis> {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze this coffee chat transcript:\n\n${transcript}\n\nRespond with only the JSON object.` },
    ],
  });

  const text = completion.choices[0].message.content ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]) as ChatAnalysis;
}
