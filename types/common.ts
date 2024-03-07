import type { StudyType } from './study';

export type SoundType = 'correct' | 'incorrect' | 'test_incorrect' | 'slide';

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectOptions = SelectOption[];

export interface MainPageParams {
  studyType: StudyType;
}

export interface MainPageQuery {
  deployId: string;
  studentId: string;
  classMode: string;
}

export interface TimerInfo {
  timer: any;
  duration: number;
  currentTime: number;
  hurryTime: number;
  isStop: boolean;
  isPause: boolean;
}
