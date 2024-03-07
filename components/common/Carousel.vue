<template>
  <div class="carousel-container">
    <div ref="wrapper" class="carousel-wrapper" :style="style">
      <slot></slot>
    </div>

    <div class="carousel-navigation" v-if="isNavigation">
      <Button
        class="carousel-navigation__btn carousel-navigation__btn-prev"
        icon="pi pi-chevron-left"
        size="large"
        :text="true"
        @click="prevSlide()"
      />
      <Button
        class="carousel-navigation__btn carousel-navigation__btn-next"
        icon="pi pi-chevron-right"
        size="large"
        :text="true"
        @click="nextSlide()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits();
const props = defineProps<{
  pageIndex: number;
  space?: number;
  isNavigation?: boolean;
}>();
const { space = 0, isNavigation = false } = props;
const { pageIndex } = toRefs(props);

const currentIndex = ref(pageIndex.value);
const wrapper = ref<HTMLDivElement | null>(null);
const itemWidth = ref(0);

const itemCount = computed(() => {
  if (!wrapper.value) return 0;

  return wrapper.value.children.length;
});

const style = computed(() => {
  if (!wrapper.value || !itemWidth.value) return {};

  const eachWidth = itemWidth.value + space;
  const width = eachWidth * itemCount.value - space;

  return {
    width: `${width}px`,
    gap: `${space}px`,
    transform: `translateX(-${eachWidth * currentIndex.value}px)`,
  };
});

const handleResize = () => {
  setItems();
};

const setItems = () => {
  if (!wrapper.value) return;

  // wrapper 아래 있는 Carousel Item 들의 width를 구해서 wrapper의 width를 설정한다.
  const items = wrapper.value.children;

  // Carousel Item 들을 전부 .carousel-item 클래스로 감싼다.
  Object.values(items).forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('carousel-item');
    item.parentNode?.insertBefore(wrapper, item);
    wrapper.appendChild(item);
  });

  const itemElement = items[0] as HTMLElement;

  // wrapper 아래 있는 Carousel Item 하나의 width를 구해서 itemWidth에 저장한다.
  itemWidth.value = itemElement.clientWidth;
};

const nextSlide = () => {
  if (!wrapper.value) return;

  currentIndex.value = (currentIndex.value + 1) % itemCount.value;
};
const prevSlide = () => {
  if (!wrapper.value) return;

  currentIndex.value =
    (currentIndex.value - 1 + itemCount.value) % itemCount.value;
};

// props로 받은 pageIndex가 바뀌면 currentIndex도 바꿔준다.
watch(pageIndex, () => {
  currentIndex.value = pageIndex.value;
});

// currentIndex가 바뀌면 emits로 신호를 전달하여, pageIndex를 바꿔준다.
watch(
  () => currentIndex.value,
  () => {
    emits('update:pageIndex', currentIndex.value);
  }
);

onMounted(setItems);
onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
