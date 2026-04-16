import { type Difficulty } from "@prisma/client";

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  hints: string[];
  solution: string;
  explanation: string;
  tags: string[];
  testCases: TestCase[];
  _count?: { submissions: number };
}

export interface TestCase {
  id: string;
  challengeId: string;
  input: string;
  expected: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  isCorrect: boolean;
  results: TestResult[] | null;
  createdAt: Date;
  challenge?: { title: string; slug: string; difficulty: Difficulty };
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  points: number;
  createdAt: Date;
  _count?: { submissions: number };
}

export interface RankingUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  points: number;
  rank: number;
  solvedCount: number;
}
