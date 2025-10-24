import { describe, it, expect } from "vitest";
import TriviaGame from "../../../src/components/trivia-game/TriviaGame";

describe("TriviaGame component", () => {
	it("should export a component function", () => {
		expect(typeof TriviaGame).toBe("function");
	});
});
