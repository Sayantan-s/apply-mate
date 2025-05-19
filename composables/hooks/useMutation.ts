// composables/useMutation.ts

import type { HTTPMethods } from "@upstash/qstash";

export default function <TData = unknown, TError = unknown>(
  url: string,
  method: HTTPMethods = "POST",
  errorCallback?: (error: TError) => string
): [
  (
    payload: RequestInit["body"] | Record<string, unknown>
  ) => Promise<TData | null>,
  {
    loading: boolean;
    error: string | null;
    data: TData;
  }
] {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<TData | null>(null);

  const mutate = async (
    payload: RequestInit["body"] | Record<string, unknown>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      data.value = await $fetch<TData>(url, {
        method,
        body: payload,
      });
      return data.value;
    } catch (err) {
      const errorMessage = errorCallback?.(err as TError);
      error.value = errorMessage || "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  return [
    mutate,
    { loading: loading.value, error: error.value, data: data.value },
  ];
}
