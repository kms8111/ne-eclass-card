export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const getRandomIndex = (arr: Array<any> = []) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return randomIndex;
};

export const getRandomItem = (arr: Array<any> = []) => {
  const randomIndex = getRandomIndex(arr);
  return arr[randomIndex];
};

export const isNumber = (str: string) => {
  const regex = /^[0-9]+$/;
  return regex.test(str);
};

export const shuffleArray = (arr: Array<any> = []) => {
  const sortedArr = [...arr];
  sortedArr.sort(() => Math.random() - 0.5);
  return sortedArr;
};

export const checkSpellAnswer = (
  answer: string = '',
  correctAnswer: string = '',
  isStrict: boolean = false
) => {
  if (isStrict) return answer === correctAnswer;
  else {
    const answerText = answer
      .replace(/[.,?!"']/g, '')
      .toLowerCase()
      .trim();
    const correctText = correctAnswer
      .replace(/[.,?!"']/g, '')
      .toLowerCase()
      .trim();
    return answerText === correctText;
  }
};

export const isNil = (value: any) => value === null || value === undefined;

export const isEmptyString = (value: any) => isNil(value) || value === '';

export const addUrlQuery = (url: string, query: Record<string, string>) => {
  const isQuestionMarkExist = url.includes('?');
  if (!isQuestionMarkExist) url += '?';
  else url += '&';

  const queryStrings = Object.entries(query).map(([key, value]) => {
    return `${key}=${value}`;
  });
  url += queryStrings.join('&');
  return url;
};

export const groupArray = (arr: Array<any>, key: string) => {
  return arr.reduce((acc, cur) => {
    const groupKey = cur[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(cur);
    return acc;
  }, {});
};

export const openStudyWindow = (url: string, name: string = 'study') => {
  const windowFeatures =
    'toolbar=no,scrollbars=no,status=no,menubar=no,top=0,left=0';
  window.open(url, name, windowFeatures);
};

export const preventClose = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  // event.returnValue = ''; //Chrome에서 동작하도록; deprecated
};

export const turnOnPreventClose = () => {
  window.addEventListener('beforeunload', preventClose);
};

export const turnOffPreventClose = () => {
  window.removeEventListener('beforeunload', preventClose);
};

export const closeWindow = (isForce = false) => {
  if (isForce) turnOffPreventClose();

  window.close();
};
