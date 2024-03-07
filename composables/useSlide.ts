import type { UseSwipeDirection } from '@vueuse/core';

interface SlideOptions {
  mouseThreshold?: number;
  touchThreshold?: number;
  isMouseSlide?: boolean;
  isTouchSlide?: boolean;
  onSwipe?: (options: SlideCallbackOptions) => void;
  onSwipeEnd?: (options: SlideCallbackOptions) => void;
}

export interface SlideCallbackOptions {
  direction?: UseSwipeDirection;
  moveX: number;
  moveY: number;
}

export const useSlide = (
  target: Ref<HTMLElement | null>,
  options: SlideOptions = {}
) => {
  const {
    mouseThreshold,
    touchThreshold,
    isMouseSlide = true,
    isTouchSlide = true,
    onSwipe,
    onSwipeEnd,
  } = options;
  const isSwiping = ref(false);

  if (isTouchSlide) {
    const { lengthX, lengthY } = useSwipe(target, {
      threshold: touchThreshold,

      onSwipe(_: TouchEvent) {
        isSwiping.value = true;

        if (typeof onSwipe === 'function')
          onSwipe({ moveX: lengthX.value, moveY: lengthY.value });
      },

      onSwipeEnd(_: TouchEvent, direction: UseSwipeDirection) {
        if (typeof onSwipeEnd === 'function')
          onSwipeEnd({ direction, moveX: lengthX.value, moveY: lengthY.value });

        setTimeout(() => {
          isSwiping.value = false;

          // swipe 완료 시 아무곳이나 클릭 이벤트 발생 시킴
          // [iOS 에서, swipe 후 첫 번째 클릭이 안되는 버그 수정용]
          document.body.click();
        }, 100);
      },
    });
  }

  if (isMouseSlide) {
    const { distanceX, distanceY } = usePointerSwipe(target, {
      threshold: mouseThreshold,

      onSwipe(_: PointerEvent) {
        isSwiping.value = true;

        if (typeof onSwipe === 'function')
          onSwipe({ moveX: distanceX.value, moveY: distanceY.value });
      },

      onSwipeEnd(event: PointerEvent, direction: UseSwipeDirection) {
        if (typeof onSwipeEnd === 'function')
          onSwipeEnd({
            direction,
            moveX: distanceX.value,
            moveY: distanceY.value,
          });

        setTimeout(() => {
          isSwiping.value = false;

          // swipe 완료 시 아무곳이나 클릭 이벤트 발생 시킴
          // [iOS 에서, swipe 후 첫 번째 클릭이 안되는 버그 수정용]
          document.body.click();
        }, 100);
      },
    });
  }

  return {
    isSwiping,
  };
};
