import { describe, it, expect } from "vitest";

export function calculateQuizScore(
  userAnswers: Record<string, number>,
  correctAnswers: Record<string, number>
): { score: number; percentage: number; passed: boolean } {
  const total = Object.keys(correctAnswers).length;
  let correctCount = 0;

  for (const qId of Object.keys(correctAnswers)) {
    if (userAnswers[qId] === correctAnswers[qId]) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 80;

  return { score: correctCount, percentage, passed };
}

describe("Quiz Scoring Logic", () => {
  it("calculates 100% score correctly for all correct answers", () => {
    const correct = { q1: 2, q2: 0, q3: 1 };
    const user = { q1: 2, q2: 0, q3: 1 };

    const result = calculateQuizScore(user, correct);
    expect(result.score).toBe(3);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("fails quiz if percentage is below 80%", () => {
    const correct = { q1: 2, q2: 0, q3: 1, q4: 3, q5: 0 };
    const user = { q1: 2, q2: 1, q3: 1, q4: 0, q5: 0 }; // 3/5 = 60%

    const result = calculateQuizScore(user, correct);
    expect(result.score).toBe(3);
    expect(result.percentage).toBe(60);
    expect(result.passed).toBe(false);
  });
});
