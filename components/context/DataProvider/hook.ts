import { dataHandlerInjectionKey, dataSourceInjectionKey } from "./types";

export const useDataHandler = () => {
  const toastHandler = inject(dataHandlerInjectionKey);
  if (!toastHandler) throw new Error("Data handler not provided");
  return toastHandler;
};

export const useDataSource = () => {
  const source = inject(dataSourceInjectionKey);
  if (!source) throw new Error("Data source not provided");
  return source;
};
