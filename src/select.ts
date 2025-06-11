import { StoreApi } from "./exports";
import { InferStoreState } from "./typings";

export function select<S extends StoreApi<any>, T>(
  store: S,
  selector: (state: InferStoreState<S>) => T
): T {
  return selector(store.getState());
}
