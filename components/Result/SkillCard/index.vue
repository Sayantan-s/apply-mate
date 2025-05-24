<template>
  <div class="flex gap-1 flex-wrap">
    <div
      v-for="(skill, index) in skills"
      :key="index"
      class="bg-black text-white px-3 py-1 text-sm"
      role="button"
    >
      {{ skill }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  skills: string[];
}
defineProps<IProps>();
</script>

<style></style>
