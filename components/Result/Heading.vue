<template>
  <h1 :class="styles"><StarA :size="20" /> {{ text }}</h1>
</template>

<script setup lang="ts">
interface IProps {
  text: string;
  class?: string;
}

const props = defineProps<IProps>();

const styles = computed(() => {
  return ["text-xl mb-2 flex items-center gap-2", props?.class].join(" ");
});
</script>
