import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { type StoreApi, useStore as $useStore } from "./exports";
import { AnyObject } from "./typings";

export function createStoreContext<S, P extends AnyObject = AnyObject>(
  storeCreator: (props?: P) => StoreApi<S>
) {
  const StoreContext = createContext<StoreApi<S> | null>(null);

  function StoreProvider(props: PropsWithChildren<P>) {
    return (
      <StoreContext.Provider value={useMemo(() => storeCreator(props), [])}>
        {props.children}
      </StoreContext.Provider>
    );
  }

  function useStoreContext() {
    return useContext(StoreContext);
  }

  function useStore<T>(selector: (state: S) => T, store?: StoreApi<S>) {
    const storeContext = useStoreContext();
    const storeToUse = store || storeContext;
    if (!storeToUse) {
      throw new Error(
        "You must provide a store or use `useStore` within a StoreProvider"
      );
    }
    return $useStore(storeToUse, selector);
  }

  function createStoreSelector<T>(selector: (state: S) => T) {
    return selector;
  }

  function Subscribe<T>({
    selector,
    children,
    store,
  }: {
    selector: (state: S) => T;
    children: (value: T) => ReactNode;
    store?: StoreApi<S>;
  }) {
    const value = useStore(selector, store);
    return <>{children(value)}</>;
  }

  return {
    StoreContext,
    StoreProvider,
    useStore,
    createStoreSelector,
    Subscribe,
  };
}
