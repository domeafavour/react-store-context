import { StoreApi } from "./exports";

export type AnyObject = Record<string, any>;

export type WithOptionalStore<Props, State> = Props & {
  store?: StoreApi<State>;
};

export type InferStoreState<T> = T extends StoreApi<infer S> ? S : never;
