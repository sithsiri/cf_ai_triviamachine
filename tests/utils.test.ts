import { describe, it, expect } from "vitest";
import { extractJSONFromText } from "../src/lib/utils";

describe("extractJSONFromText", () => {
	it("parses a raw JSON string", () => {
		const text = '{"foo": 1, "bar": [1,2,3]}';
		const parsed = extractJSONFromText(text) as any;
		expect(parsed).toBeTypeOf("object");
		expect(parsed.foo).toBe(1);
		expect(Array.isArray(parsed.bar)).toBe(true);
	});

	it("parses a fenced ```json code block", () => {
		const text = "Here is the data:\n```json\n{\"a\":2}\n```\nThanks";
		const parsed = extractJSONFromText(text) as any;
		expect(parsed).toBeTypeOf("object");
		expect(parsed.a).toBe(2);
	});

	it("parses a fenced code block without json label", () => {
		const text = "Some text\n```\n{\"x\":true}\n```";
		const parsed = extractJSONFromText(text) as any;
		expect(parsed).toBeTypeOf("object");
		expect(parsed.x).toBe(true);
	});

	it("extracts first balanced object from surrounding text", () => {
		const text = "Note: config = {\"k\":\"v\"} and more text";
		const parsed = extractJSONFromText(text) as any;
		expect(parsed).toBeTypeOf("object");
		expect(parsed.k).toBe("v");
	});

	it("returns null for non-json text", () => {
		const text = "no json here just text";
		const parsed = extractJSONFromText(text);
		expect(parsed).toBeNull();
	});
});
