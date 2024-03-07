import type {
  QuestionData,
  StudyMethod,
  StudyType,
  WordInfo,
} from '~/types/study';

export const STUDY_TYPES: StudyType[] = ['memorize', 'recall', 'spell'];
export const WORD_STUDY_METHODS: StudyMethod[] = [
  'word',
  'meaning',
  'audio',
  'example',
];
export const SENTENCE_STUDY_METHODS: StudyMethod[] = [
  'writing',
  'writingImmediate',
  'writingFirstLetter',
  'chunk',
  'dictation',
  'dictationFirstLetter',
];
export const STUDY_METHODS: StudyMethod[] = [
  ...WORD_STUDY_METHODS,
  ...SENTENCE_STUDY_METHODS,
];

export const BOOK_TYPE_TEXT_INFO = {
  word: '단어',
  sentence: '문장',
};

export const STUDY_TYPE_TEXT_INFO = {
  memorize: '암기 학습',
  recall: '리콜 학습',
  spell: '스펠 학습',
};

export const STUDY_METHOD_TEXT_INFO = {
  word: '단어 제시',
  meaning: '의미 제시',
  audio: '발음 제시',
  example: '예문 제시',
  writing: '영작 (완료 후 오답표시)',
  writingImmediate: '영작 (즉시 오답표시)',
  writingFirstLetter: '첫 글자 영작',
  chunk: '어순배열',
  dictation: '딕테이션',
  dictationFirstLetter: '첫 글자 딕테이션',
};

export const STUDY_MULTIPLE_ANSWER_COUNT = 4;
export const STUDY_BLANK_ANSWER_COUNT = 4;
export const STUDY_BLANK_TEXT = '_____';

export const GET_INITIAL_QUESTION_DATA = (
  wordInfo: WordInfo
): QuestionData => ({
  cardId: wordInfo.cardId,
  type: '',
  studyMethod: '',
  word: wordInfo.word,
  meaning: wordInfo.meaning,
  example: wordInfo.example,
  audio: wordInfo.audio,
  wordIndex: -1,
  questionIndex: -1,
  answers: [],
  blankChunks: [],
  blankOptions: [],
  selectedIndex: -1,
  selectedAnswers: [],
  correctIndex: -1,
  correctAnswers: [],
  spellAnswer: '',
  chunkAnswers: [],
  isCompleted: false,
  isBookmarked: false,
  studiedAt: 0,
});
