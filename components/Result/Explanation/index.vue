<template>
  <p>{{ value }}</p>
</template>

<script setup lang="ts">
interface IProps {
  value: string;
}

defineProps<IProps>();
</script>

<style></style>
