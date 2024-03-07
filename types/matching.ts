import type { WordInfo } from './study';

export type MatchingOptionWord = WordInfo;
export type MatchingOptionAnswer = WordInfo;

export interface MatchingRecordInfo {
  score: number;
  attendanceNo: number;
  klassId: number;
  recodeId: number;
  studentId: number;
  submitDate: string;
}
