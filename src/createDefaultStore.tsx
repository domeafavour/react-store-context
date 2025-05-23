import { combine, createStore, StateCreator } from "./exports";
import { AnyObject } from "./typings";

/**
 * The default store creator function.
 */
export function createDefaultStore<S extends AnyObject, A extends AnyObject>(
  initialState: S,
  actionsCreator: StateCreator<S, [], [], A>
) {
  return createStore(combine(initialState, actionsCreator));
}
