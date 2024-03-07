import { onKeyStroke } from '@vueuse/core';

type KeyPredicate = (event: KeyboardEvent) => boolean;
type KeyFilter = true | string | string[] | KeyPredicate;

export const useKeyStroke = (key: KeyFilter, callback: Function) => {
  onKeyStroke(true, event => {
    const { code } = event;

    const keyName = code?.toLowerCase();

    // 해당 키를 눌렀는지 확인
    let isTargetKey = false;
    if (key === true) isTargetKey = true;
    else if (typeof keyName === 'string') isTargetKey = keyName === key;
    else if (Array.isArray(key)) isTargetKey = key.includes(keyName);

    // 해당 키를 눌렀을 때, callback 실행
    if (isTargetKey && typeof callback === 'function') {
      callback(keyName);
    }
  });
};
