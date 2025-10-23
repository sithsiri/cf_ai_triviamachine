/**
 * Tool definitions for the AI chat agent
 * Tools can either require human confirmation or execute automatically
 */
// import { tool, type ToolSet } from "ai";
// import { z } from "zod/v3";
import { type ToolSet } from "ai";

// const saveTriviaSet = tool({
//   description: "Store a set of trivia questions for the user. They should be multiple-choice questions with one correct answer and several distractors.",
//   inputSchema: z.object({
//     triviaset: z.string().describe(`The trivia questions and answers in the following JSON format:
//       {
//         "questions": [
//           {
//             "question": "What is the capital of France?",
//             "options": ["Berlin", "Madrid", "Paris", "Rome"],
//             "answer": "Paris"
//           },
//           ...
//         ]
//       }`),
//   }),
//   execute: async ({ triviaset }) => {
//     console.log(`Saving trivia set: ${triviaset}`);
//     try {
//       // Parse to validate JSON
//       const parsedTriviaSet = JSON.parse(triviaset);

//       // Dispatch event to notify the UI
//       const event = new CustomEvent('triviaSetCreated', {
//         detail: { triviaset }
//       });
//       window.dispatchEvent(event);

//       return `Trivia set created successfully!`;
//     } catch (error) {
//       console.error('Failed to parse trivia set:', error);
//       return `Error: Invalid trivia set format`;
//     }
//   }
// });

/**
 * Export all available tools
 * These will be provided to the AI model to describe available capabilities
 */
export const tools = {
  // saveTriviaSet
} satisfies ToolSet;

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {
  // getWeatherInformation: async ({ city }: { city: string }) => {
  //   console.log(`Getting weather information for ${city}`);
  //   return `The weather in ${city} is sunny`;
  // }
};
