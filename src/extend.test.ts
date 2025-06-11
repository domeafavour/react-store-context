import { describe, expect, it } from "vitest";
import { createDefaultStore } from "./createDefaultStore";
import { extend } from "./extend";
import { select } from "./select";

describe("extend", () => {
  it("should merge extension state with store state", () => {
    const mockStore = createDefaultStore({ count: 0 }, (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));

    const extendedStore = extend(mockStore, {
      state: { status: "idle" as "idle" | "pending" | "error" | "success" },
      actions: (set) => ({
        reload: () => set({ status: "pending" }),
        incrementAsync: () =>
          setTimeout(() => select(mockStore, (s) => s.increment)(), 1000),
      }),
    });

    expect(extendedStore.getState()).toMatchObject({
      count: 0,
      status: "idle",
    });

    extendedStore.getState().reload();
    extendedStore.getState().increment();

    expect(extendedStore.getState()).toMatchObject({
      count: 1,
      status: "pending",
    });

    extendedStore.getState().incrementAsync();
    setTimeout(() => {
      expect(extendedStore.getState()).toMatchObject({
        count: 2,
        status: "pending",
      });
    }, 1200);
  });
});
