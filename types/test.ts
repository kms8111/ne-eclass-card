import type {
  StudyMethod,
  StudyMethodSentence,
  StudyMethodWord,
} from './study';

export type TestQuestionType = TestQuestionTypeWord | TestQuestionTypeSentence;
export type TestQuestionTypeWord = 'multiple' | 'typing';
export type TestQuestionTypeSentence = 'sentence';
export type TestQuestionMethod = StudyMethodWord | StudyMethodSentence;
export interface TestQuestionSetting {
  type: TestQuestionType;
  method: TestQuestionMethod;
}

export interface TestHistory {
  score?: number;
  studiedAt: number;
  questions?: TestQuestionData[];
}

export interface TestPreviousQuestion {
  cardId: number;
  answers: string;
  audio: string | null;
  completeYn: string;
  correctAnswer: string;
  correctYn: string;
  question: string;
  questionNo: number;
  studentAnswer: string;
  submitDate: string;
}

export interface TestQuestionTypeInfo {
  type: TestQuestionType;
  method: TestQuestionMethod;

  // questionType: TestQuestionTypeWord | StudyMethodSentence;
  // questionMethod: TestQuestionMethod;
}

export interface TestQuestion {
  cardId: number;
  type: TestQuestionType;
  method: TestQuestionMethod;
  word: string;
  meaning: string;
  example: string;
  audio: string;
  // wordIndex: number;
  // questionIndex: number;
  answers: string[];
  blankChunks: string[];
  blankOptions: string[];
  correctAnswers: string[];
  correctIndex: number;
}

export interface TestQuestionData {
  cardId: number;
  type: TestQuestionType;
  method: TestQuestionMethod;
  word: string;
  meaning: string;
  example: string;
  audio: string;
  question: string;
  answerKey: StudyMethod | '';
  // wordIndex: number;
  // questionIndex: number;
  answers: string[];
  blankChunks: string[];
  blankOptions: string[];
  selectedIndex: number;
  selectedAnswers: string[];
  correctIndex: number;
  correctAnswers: string[];
  spellAnswer: string;
  chunkAnswers: string[];
  isCorrect: boolean;
  isAnswered: boolean;
  studiedAt: number;
}
