import { format } from 'date-fns';

export const parseTimestamps = (
  timestamps: number,
  dateFormat = 'yyyy-MM-dd HH:mm:ss'
) => {
  const date = new Date(timestamps);
  const formatted = format(date, dateFormat);
  return formatted;
};

export const parseDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
};

// 입력한 날짜가 오늘인지 확인
export const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
