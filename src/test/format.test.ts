import { describe, expect, it } from "vitest";
import { formatPct, formatUSD, humanize } from "@/lib/format";

describe("format", () => {
  it("converts decimals to percent", () => expect(formatPct(0.47)).toBe("47%"));
  it("formats dollars with commas", () => expect(formatUSD(281770.84)).toBe("$281,771"));
  it("renames other_spending", () => expect(humanize("other_spending")).toBe("Other"));
});
