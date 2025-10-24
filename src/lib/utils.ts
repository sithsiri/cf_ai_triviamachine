import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Try to extract a JSON object from arbitrary text.
 * Strategies (in order):
 * 1. Try parsing the whole text as JSON
 * 2. Find a fenced code block (``` or ```json) and parse its contents
 * 3. Find the first balanced JSON object substring (first '{' .. matching '}') and parse it
 * Returns the parsed value or null when nothing parseable is found.
 */
export function extractJSONFromText(text: string): unknown | null {
  if (!text) return null;

  // 1) try whole-text parse
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    // ignore
  }

  // 2) fenced code block ``` or ```json
  const fencedRe = /```(?:json)?\s*([\s\S]*?)```/i;
  const fencedMatch = text.match(fencedRe);
  if (fencedMatch && fencedMatch[1]) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch (e) {
      // fallthrough
    }
  }

  // 3) find first balanced {...} substring
  const start = text.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;

      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch (e) {
          break; // stop after first balanced block fails
        }
      }
    }
  }

  return null;
}

export type TriviaQuestionShape = {
  question: unknown;
  incorrect: unknown;
  correct: unknown;
};

export function isTriviaSet(value: unknown): value is { questions: { question: string; incorrect: string[]; correct: string }[] } {
  if (!value || typeof value !== "object") return false;
  const anyVal = value as any;
  if (!Array.isArray(anyVal.questions) || anyVal.questions.length === 0) return false;
  return anyVal.questions.every((q: any) => typeof q.question === "string" && typeof q.correct === "string" && Array.isArray(q.incorrect) && q.incorrect.every((i: any) => typeof i === "string"));
}
