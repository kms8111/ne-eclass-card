import type { StudyMethodWord } from './study';

export interface SettingInfo {
  version: number;
  audioSpeed: number;
  studyMethod: SettingStudyMethod;
  test: SettingTest;
  matching: SettingMatching;
}

export interface SettingStudyMethod {
  memorize: SettingStudyMethodOption;
  recall: SettingStudyMethodOption;
  spell: SettingStudyMethodOption;
}

// 설정에 학습 방법은 단어 학습만 있음
export type SettingStudyMethodOption = StudyMethodWord | 'free';

export interface SettingMatching {
  score: number;
  duration: number;
}

export interface SettingTest {
  goalScore: number;
  answerSpeed: 'verySlow' | 'slow' | 'normal' | 'fast' | 'veryFast';
  limitCount: number;
  question: SettingTestQuestion;
  isShuffle: boolean;
  isOnlyIncorrect: boolean;
  isStrictAnswer: boolean;
}

export interface SettingTestQuestion {
  word: SettingTestQuestionTypeWord;
  sentence: SettingTestQuestionSentence;
}

export interface SettingTestQuestionTypeWord {
  multiple: SettingTestQuestionWord;
  typing: SettingTestQuestionWord;
}

export interface SettingTestQuestionWord {
  word: number;
  meaning: number;
  audio: number;
  example: number;
}

export interface SettingTestQuestionSentence {
  chunk: number;
  writing: number;
  dictation: number;
}
