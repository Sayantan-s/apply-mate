<template>
  <div
    role="textbox"
    class="relative border-b border-purple-900 py-0.5 focus-within:border-purple-700"
    @blur.stop
    @click.stop="handleFocus"
    @focus.stop
  >
    <span class="text-gray-600 pointer-events-none">https://</span>
    <input
      ref="inputRef"
      :value="value"
      type="link"
      class="focus:outline-none text-gray-50 text-sm bg-transparent"
      placeholder="drive.usercont..."
      @input.stop.prevent="handleChange"
      @blur.stop
      @click.stop
      @focus.stop
    />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  value: string;
}

interface IHanders {
  (e: "update:value", value: string): void;
}

defineProps<IProps>();

const emit = defineEmits<IHanders>();
const inputRef = ref<HTMLInputElement | null>(null);

const handleChange = (e: Event) => {
  const { value: textValue } = e.target as HTMLInputElement;
  const computedTextValue = textValue.replace(/https?:\/\//gi, "");
  emit("update:value", computedTextValue);
};

const handleFocus = () => inputRef?.value?.focus();
</script>

<style></style>
