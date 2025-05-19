<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value: string) => {
      return [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "error",
      ].includes(value);
    },
  },
  size: {
    type: String,
    default: "md",
    validator: (value: string) => {
      return ["sm", "md", "lg", "xl"].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<"button" | "reset" | "submit" | undefined>,
    default: "button",
  },
});

const getVariantClasses = (variant: string) => {
  const variantMap: { [key: string]: string } = {
    primary:
      "bg-brutal-primary border-brutal-black text-brutal-white hover:bg-brutal-primary/90",
    secondary:
      "bg-brutal-secondary border-brutal-black text-brutal-black hover:bg-brutal-secondary/90",
    accent:
      "bg-brutal-accent border-brutal-black text-brutal-black hover:bg-brutal-accent/90",
    success:
      "bg-brutal-success border-brutal-black text-brutal-white hover:bg-brutal-success/90",
    warning:
      "bg-brutal-warning border-brutal-black text-brutal-black hover:bg-brutal-warning/90",
    error:
      "bg-brutal-error border-brutal-black text-brutal-white hover:bg-brutal-error/90",
  };

  return variantMap[variant] || variantMap.primary;
};

const getSizeClasses = (size: string) => {
  const sizeMap: { [key: string]: string } = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return sizeMap[size] || sizeMap.md;
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'neobrutal-btn',
      getVariantClasses(variant),
      getSizeClasses(size),
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <slot />
  </button>
</template>

<style scoped>
.neobrutal-btn {
  @apply relative font-bold tracking-wide uppercase border-4 transition-all duration-200;
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 0 var(--color-black);
}

.neobrutal-btn:hover:not(:disabled) {
  @apply animate-shift-right;
  transform: translate(0px, -4px);
  box-shadow: 0px 4px 0 0 var(--color-black);
}

.neobrutal-btn:active:not(:disabled) {
  @apply animate-shift-down;
  transform: translate(0px, 0px);
  box-shadow: 0px 0px 0 0 var(--color-black);
}

/* Ensures text remains centered during transformations */
.neobrutal-btn::before {
  content: "";
  @apply absolute inset-0 pointer-events-none border-2 border-transparent;
}
</style>

function defineProps(arg0: { variant: { type: StringConstructor; default:
string; validator: (value: string) => boolean; }; size: { type:
StringConstructor; default: string; validator: (value: string) => boolean; };
disabled: { ...; }; type: { ...; }; }) { throw new Error("Function not
implemented."); }
