<script setup lang="ts"></script>

<template>
  <ContextSonner>
    <ContextDataProvider><App /></ContextDataProvider>
  </ContextSonner>
</template>

<style>
:root {
  --display: "Space Grotesk";
}

* {
  font-family: var(--display);
}
</style>
