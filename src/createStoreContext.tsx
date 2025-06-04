import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { type StoreApi, useStore as $useStore } from "./exports";
import { AnyObject, WithOptionalStore } from "./typings";

export function createStoreContext<S, P extends AnyObject = AnyObject>(
  storeCreator: (props?: P) => StoreApi<S>
) {
  const StoreContext = createContext<StoreApi<S> | null>(null);

  function StoreProvider(props: PropsWithChildren<WithOptionalStore<P, S>>) {
    return (
      <StoreContext.Provider
        value={useMemo(() => props.store ?? storeCreator(props), [props.store])}
      >
        {props.children}
      </StoreContext.Provider>
    );
  }

  function useCreateStore(props?: P | (() => P)) {
    const [store] = useState(() =>
      storeCreator(typeof props === "function" ? props() : props)
    );
    return store;
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
    useCreateStore,
    useStore,
    createStoreSelector,
    Subscribe,
  };
}
