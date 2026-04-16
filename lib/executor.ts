import { type TestResult } from "@/lib/types";

/**
 * Sandbox code executor – simulated in-browser JS evaluation.
 * Runs the user's function against each test case input.
 */
export function runCode(code: string, testCases: { input: string; expected: string; isHidden: boolean }[]): TestResult[] {
  const results: TestResult[] = [];

  for (const tc of testCases) {
    if (tc.isHidden) continue; // don't reveal hidden cases to client
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}\nreturn solution;`)();
      if (typeof fn !== "function") {
        results.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: "Error",
          error: "A função 'solution' não foi encontrada. Certifique-se de criar uma função chamada 'solution'.",
        });
        continue;
      }

      const args = JSON.parse(`[${tc.input}]`);
      const actual = fn(...args);
      const actualStr = JSON.stringify(actual);
      const expectedStr = tc.expected.trim();

      results.push({
        passed: actualStr === expectedStr,
        input: tc.input,
        expected: expectedStr,
        actual: actualStr,
      });
    } catch (err: unknown) {
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: "Error",
        error: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  }

  return results;
}

/**
 * Server-side evaluation (also JS-based, used in API route).
 * Runs ALL test cases including hidden ones to verify correctness.
 */
export function evaluateSubmission(
  code: string,
  testCases: { input: string; expected: string; isHidden: boolean }[]
): { results: TestResult[]; isCorrect: boolean } {
  const results: TestResult[] = [];

  for (const tc of testCases) {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}\nreturn solution;`)();
      if (typeof fn !== "function") {
        results.push({
          passed: false,
          input: tc.isHidden ? "hidden" : tc.input,
          expected: tc.isHidden ? "hidden" : tc.expected,
          actual: "Error",
          error: "Função 'solution' não encontrada",
        });
        continue;
      }

      const args = JSON.parse(`[${tc.input}]`);
      const actual = fn(...args);
      const actualStr = JSON.stringify(actual);
      const expectedStr = tc.expected.trim();

      results.push({
        passed: actualStr === expectedStr,
        input: tc.isHidden ? "hidden" : tc.input,
        expected: tc.isHidden ? "hidden" : expectedStr,
        actual: tc.isHidden ? "hidden" : actualStr,
      });
    } catch (err: unknown) {
      results.push({
        passed: false,
        input: tc.isHidden ? "hidden" : tc.input,
        expected: tc.isHidden ? "hidden" : tc.expected,
        actual: "Error",
        error: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  }

  const isCorrect = results.every((r) => r.passed);
  return { results, isCorrect };
}
