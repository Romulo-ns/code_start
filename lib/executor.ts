import { type TestResult, type TestCase } from "@/lib/types";

/**
 * Executes JavaScript code in a simulated environment.
 */
function runJS(code: string, tc: { input: string; expected: string; isHidden: boolean }): TestResult {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`${code}\nreturn solution;`)();
    if (typeof fn !== "function") {
      throw new Error("Função 'solution' não encontrada");
    }

    const args = JSON.parse(`[${tc.input}]`);
    const actual = fn(...args);
    const actualStr = JSON.stringify(actual);
    const expectedStr = tc.expected.trim();

    return {
      passed: actualStr === expectedStr,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : expectedStr,
      actual: tc.isHidden ? "hidden" : actualStr,
    };
  } catch (err: unknown) {
    return {
      passed: false,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : tc.expected,
      actual: "Error",
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}

/**
 * Executes C code using Piston API.
 */
async function runC(code: string, tc: { input: string; expected: string; isHidden: boolean }): Promise<TestResult> {
  const hasMain = code.includes("int main") || code.includes("void main");
  const wrapper = hasMain 
    ? code 
    : `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

${code}

int main(int argc, char **argv) {
    ${tc.input}
    return 0;
}
`;

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify({
        language: "c",
        version: "10.2.0",
        files: [{ content: wrapper }],
        args: tc.input.startsWith("ARGV:") ? tc.input.replace("ARGV:", "").split(",") : [],
      }),
    });

    const result = await response.json();

    if (result.message) {
      throw new Error(result.message);
    }

    const actual = result.run.stdout.trim() || result.run.stderr.trim();
    const expected = tc.expected.replace(/\\n/g, "\n").trim();

    return {
      passed: actual === expected,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : expected,
      actual: tc.isHidden ? "hidden" : actual,
      error: result.run.code !== 0 ? result.run.stderr : undefined,
    };
  } catch (err: unknown) {
    return {
      passed: false,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : tc.expected,
      actual: "Error",
      error: err instanceof Error ? err.message : "Erro ao conectar com servidor de execução",
    };
  }
}

/**
 * Executes Shell scripts using Piston API.
 */
async function runShell(code: string, tc: { input: string; expected: string; isHidden: boolean }): Promise<TestResult> {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify({
        language: "bash",
        version: "5.0.0",
        files: [{ content: code }],
        args: tc.input.startsWith("ARGV:") ? tc.input.replace("ARGV:", "").split(",") : [],
      }),
    });

    const result = await response.json();
    const actual = result.run.stdout.trim() || result.run.stderr.trim();
    const expected = tc.expected.replace(/\\n/g, "\n").trim();

    return {
      passed: actual === expected,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : expected,
      actual: tc.isHidden ? "hidden" : actual,
      error: result.run.code !== 0 ? result.run.stderr : undefined,
    };
  } catch (err: unknown) {
    return {
      passed: false,
      input: tc.isHidden ? "hidden" : tc.input,
      expected: tc.isHidden ? "hidden" : tc.expected,
      actual: "Error",
      error: "Erro ao conectar com servidor de execução",
    };
  }
}

/**
 * Client-side "Run" (Browser for JS, Remote for others)
 */
export async function runCode(
  code: string,
  testCases: TestCase[],
  language: string = "javascript"
): Promise<TestResult[]> {
  const visibleCases = testCases.filter((tc) => !tc.isHidden);
  
  if (language === "javascript") {
    return visibleCases.map((tc) => runJS(code, tc));
  }

  if (language === "bash" || language === "shell") {
    return await Promise.all(visibleCases.map((tc) => runShell(code, tc)));
  }

  // Remote execution for C
  return await Promise.all(visibleCases.map((tc) => runC(code, tc)));
}

/**
 * Server-side evaluation for submissions.
 */
export async function evaluateSubmission(
  code: string,
  testCases: TestCase[],
  language: string = "javascript"
): Promise<{ results: TestResult[]; isCorrect: boolean }> {
  let results: TestResult[];

  if (language === "javascript") {
    results = testCases.map((tc) => runJS(code, tc));
  } else if (language === "bash" || language === "shell") {
    results = [];
    for (const tc of testCases) {
      results.push(await runShell(code, tc));
    }
  } else {
    results = [];
    for (const tc of testCases) {
      results.push(await runC(code, tc));
    }
  }

  const isCorrect = results.every((r) => r.passed);
  return { results, isCorrect };
}

