import { sonnerHandlerInjectionKey } from "./types";

export const useSonner = () => {
  const toastHandler = inject(sonnerHandlerInjectionKey);
  if (!toastHandler) throw new Error("Sonner handler not provided");
  return toastHandler;
};
