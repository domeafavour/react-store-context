import { StateCreator, StoreApi } from "./exports";
import { AnyObject, InferStoreState } from "./typings";

export function extend<
  Store extends StoreApi<any>,
  S extends AnyObject = AnyObject,
  A extends AnyObject = AnyObject
>(
  store: Store,
  extension: {
    state: S;
    actions?: StateCreator<S, [], [], A>;
  }
) {
  store.setState({
    ...extension.state,
    ...extension.actions?.(store.setState, store.getState, store),
  });
  return {
    ...store,
    getInitialState: () => ({
      ...store.getInitialState(),
      ...extension.state,
    }),
  } as StoreApi<InferStoreState<Store> & S & A>;
}
