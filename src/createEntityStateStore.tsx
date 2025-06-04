import {
  Comparer,
  createEntityAdapter,
  EntityMap,
  IdSelector,
  Predicate,
  Update,
} from "entity-state-adapter";

import { createDefaultStore } from "./createDefaultStore";

export function createEntityStateStore<T>(options?: {
  entities?: T[];
  selectId?: IdSelector<T>;
  sortComparer?: false | Comparer<T>;
}) {
  const adapter = createEntityAdapter<T>(options);
  let initialState = adapter.getInitialState();
  if (options?.entities?.length) {
    initialState = adapter.addAll(options.entities, initialState);
  }
  return createDefaultStore(initialState, (set, get) => {
    function removeOne(key: string): void;
    function removeOne(key: number): void;
    function removeOne(key: string | number): void {
      set(adapter.removeOne(key as string, get()));
    }
    function removeMany(keys: string[]): void;
    function removeMany(keys: number[]): void;
    function removeMany(predicate: Predicate<T>): void;
    function removeMany(keysOrPredicate: any) {
      set(adapter.removeMany(keysOrPredicate, get()));
    }
    const { selectAll, selectEntities, selectIds, selectTotal } =
      adapter.getSelectors();
    return {
      addOne: (entity: T) => {
        set(adapter.addOne(entity, get()));
      },
      addMany: (entities: T[]) => {
        set(adapter.addMany(entities, get()));
      },
      addAll: (entities: T[]) => {
        set(adapter.addAll(entities, get()));
      },
      removeOne,
      removeMany,
      removeAll: () => {
        set(adapter.removeAll(get()));
      },
      updateOne: (update: Update<T>) => {
        set(adapter.updateOne(update, get()));
      },
      updateMany: (updates: Update<T>[]) => {
        set(adapter.updateMany(updates, get()));
      },
      upsertOne: (entity: T) => {
        set(adapter.upsertOne(entity, get()));
      },
      upsertMany: (entities: T[]) => {
        set(adapter.upsertMany(entities, get()));
      },
      map: (mapFn: EntityMap<T>) => {
        set(adapter.map(mapFn, get()));
      },
      // selectors
      selectIds: () => selectIds(get()),
      selectEntities: () => selectEntities(get()),
      selectAll: () => selectAll(get()),
      selectTotal: () => selectTotal(get()),
      selectOne: (id: string | number) => selectEntities(get())[id],
    };
  });
}
