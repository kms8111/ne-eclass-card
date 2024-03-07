import type { SettingInfo } from './setting';
import type { Book, StudyData } from './study';

export interface DefaultResponse {
  isSuccess: boolean;
  message: string;
  data?: object;
}

export interface FetchBookResponse extends DefaultResponse {
  data: {
    book: Book;
  };
}

export interface FetchSettingResponse extends DefaultResponse {
  data: {
    settingInfo: SettingInfo;
  };
}

export interface FetchStudyDataResponse extends DefaultResponse {
  data: {
    studyData: StudyData;
  };
}
