import type {
  SettingTestQuestionSentence,
  SettingTestQuestionWord,
} from '~/types/setting';

export const SETTING_STUDY_TYPE_TEXT_INFO = {
  memorize: '암기학습',
  recall: '리콜학습',
  spell: '스펠학습',
  test: '테스트',
};

export const SETTING_TEST_QUESTION_TEXT_INFO = {
  multiple: '객관식',
  typing: '주관식',
  chunk: '어순배열',
  writing: '문장입력',
  dictation: '딕테이션',
};

export const SETTING_TEST_ANSWER_SPEED_TEXT_INFO = {
  verySlow: '매우느림',
  slow: '느림',
  normal: '보통',
  fast: '빠름',
  veryFast: '매우빠름',
};

export const SETTING_TEST_STUDY_METHOD_WORD: (keyof SettingTestQuestionWord)[] =
  ['word', 'meaning', 'audio', 'example'];

export const SETTING_TEST_STUDY_METHOD_SENTENCE: (keyof SettingTestQuestionSentence)[] =
  ['chunk', 'writing', 'dictation'];

export const SETTING_STUDY_METHOD_TEXT_INFO = {
  word: '단어제시',
  meaning: '의미제시',
  audio: '발음제시',
  example: '예문제시',
  chunk: '어순배열',
  writing: '문장입력',
  dictation: '딕테이션',
};

export const SETTING_STUDY_PRESENTED_OPTION_TEXT_INFO = {
  word: '의미선택',
  meaning: '단어선택',
  audio: '의미선택',
  example: '단어선택',
};

export const SETTING_TEST_QUESTION_WORD_TEXT_INFO = {
  multiple: '객관식',
  typing: '주관식',
};

export const SETTING_MATCHING_DURATIONS = [1, 2, 3, 4, 5, 10, 15, 20];
