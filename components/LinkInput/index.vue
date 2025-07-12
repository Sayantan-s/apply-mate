<template>
  <div
    role="textbox"
    class="relative border-b border-purple-900 py-0.5 focus-within:border-purple-700"
    @blur.stop
    @click.stop="handleFocus"
    @focus.stop
  >
    <span class="text-gray-600 pointer-events-none text-">https://</span>
    <input
      ref="inputRef"
      :value="value"
      type="link"
      class="focus:outline-none text-gray-50 text-sm bg-transparent"
      placeholder="drive.usercont..."
      @input.stop.prevent="handleChange"
      @keydown="handleFireAllowUpload"
      @blur.stop
      @click.stop
      @focus.stop
    />
    <span class="text-[9px] text-gray-500">Press Enter</span>
  </div>
</template>

<script setup lang="ts">
import { useSonner } from "../context/Sonner/hook";

interface IProps {
  value: string;
}

interface IHanders {
  (e: "update:value" | "onAllowUpload", value: string): void;
}

defineProps<IProps>();

const emit = defineEmits<IHanders>();
const inputRef = ref<HTMLInputElement | null>(null);
const { dispatchToast } = useSonner();

const handleChange = (e: Event) => {
  const { value: textValue } = e.target as HTMLInputElement;
  const computedTextValue = textValue.replace(/https?:\/\//gi, "");
  emit("update:value", computedTextValue);
};

const handleFireAllowUpload = (e: KeyboardEvent) => {
  const { value: textValue } = e.target as HTMLInputElement;
  if (e.key === "Enter") {
    event?.preventDefault();
    const { error } = httpUrlSchema.safeParse(textValue);
    if (error?.errors.length) {
      const [err] = error.errors;
      dispatchToast({
        variant: "error",
        title: "Resume Link",
        description: err.message,
      });
    } else emit("onAllowUpload", textValue);
  }
};

const handleFocus = () => inputRef?.value?.focus();
</script>

<style></style>
