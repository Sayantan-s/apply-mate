<template>
  <ToastProvider>
    <slot />
    <Toast
      :open="toast.open"
      :description="toast.description"
      :title="toast.title"
      :variant="toast.variant"
      @close="removeToast"
    />
  </ToastProvider>
</template>
<script lang="ts" setup>
import type { IToastProps } from "~/components/Toast/index.vue";
import { sonnerHandlerInjectionKey, type IToastDispatchBody } from "./types";

defineOptions({ name: "SonnerProvider" });

const toast = useState<IToastProps>("open", () => ({
  open: false,
  variant: "info",
  title: "",
  description: "",
}));

const timer = ref<NodeJS.Timeout | null>(null);

const dispatchToast = ({ variant, title, description }: IToastDispatchBody) => {
  toast.value.open = true;
  toast.value.variant = variant;
  toast.value.title = title;
  toast.value.description = description;
  timer.value = setTimeout(removeToast, 3000);
};

const removeToast = () => {
  toast.value.open = false;
  toast.value.variant = "info";
  toast.value.title = "";
  toast.value.description = "";
  clearTimeout(timer.value as NodeJS.Timeout);
  timer.value = null;
};

const sonnerHandlers = {
  dispatchToast,
  removeToast,
};
provide(sonnerHandlerInjectionKey, sonnerHandlers);
</script>
