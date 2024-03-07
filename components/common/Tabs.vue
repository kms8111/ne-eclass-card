<template>
  <TabView v-if="tabs.length > 0" class="tabs" v-model:activeIndex="tabIndex">
    <TabPanel v-for="tab in tabs" :key="tab" :header="tab" />
  </TabView>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: string[];
}>();
const { tabs } = toRefs(props);

const tabIndex = defineModel<number>();
</script>
