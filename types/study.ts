import type {
  TestHistory,
  TestQuestionData,
  TestPreviousQuestion,
} from './test';

export type BookType = 'word' | 'sentence';
export type StudyMode = 'study' | 'matching' | 'test';
export type StudyType = 'memorize' | 'recall' | 'spell';
export type StudyTypeServer = 'MEMORIZE' | 'RECALL' | 'SPELL' | 'TEST';
export type StudyMethod = StudyMethodWord | StudyMethodSentenceOption;
export type StudyMethodWord = 'word' | 'meaning' | 'audio' | 'example';
export type StudyMethodSentence = 'writing' | 'chunk' | 'dictation';
export type StudyMethodSentenceOption =
  | 'writing'
  | 'writingImmediate'
  | 'writingFirstLetter'
  | 'chunk'
  | 'dictation'
  | 'dictationFirstLetter';
export type CardPage = 'preview' | 'question';
export type QuestionType = 'word' | 'chunk' | 'blank';
export type QuestionAnswerKey = 'word' | 'meaning';

export interface Book {
  evalType: string;
  cardCnt: number;
  wordInfos: WordInfo[];
}

export interface WordInfo {
  cardId: number;
  word: string;
  meaning: string;
  example: string;
  audio: string;
}

export interface StudyData {
  version: number;
  bookType: BookType;
  startTime: number;
  endTime: number;
  endYn: string;
  studyType: StudyType;
  studyTypeServer?: StudyTypeServer;
  score?: number;
  questions: QuestionData[];
  testQuestions: TestQuestionData[];
  testHistories?: TestHistory[];
  testPreviousQuestions?: TestPreviousQuestion[];
  studiedAt: number;
}

export interface ServerQuestion {
  cardId: number;
  studyType: 'MEMORIZE' | 'RECALL' | 'SPELL';
  completeYn: 'Y' | 'N' | null;
  correctAnswer: string | number | null;
  studentAnswer: string | number | null;
  submitDate: string | null;
}

// 최초 문제 생성 시 사용
export interface GeneratedQuestion {
  cardId: number;
  type: QuestionType;
  studyMethod: StudyMethod;
  word: string;
  meaning: string;
  example: string;
  audio: string;
  wordIndex: number;
  questionIndex: number;
  answers: string[];
  blankChunks: string[];
  blankOptions: string[];
  correctIndex: number;
  correctAnswers: string[];
}

export interface QuestionData {
  cardId: number | '';
  type: QuestionType | '';
  studyMethod: StudyMethod | '';
  word: string;
  meaning: string;
  example: string;
  audio: string;
  wordIndex: number;
  questionIndex: number;
  answers: string[];
  blankChunks: string[];
  blankOptions: string[];
  selectedIndex: number;
  selectedAnswers: string[];
  correctIndex: number;
  correctAnswers: string[];
  spellAnswer: string;
  chunkAnswers: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
  studiedAt: number;
}

// // Question과 QuestionData를 동일하게 사용
// export type Question = QuestionData;
export type Question = GeneratedQuestion;
