import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultStore } from "./createDefaultStore";
import { createStoreContext } from "./createStoreContext";

interface TestState {
  count: number;
  increment: () => void;
}

function createTestStore(props?: { initial?: number }) {
  return createDefaultStore({ count: props?.initial || 0 }, (set) => ({
    count: props?.initial || 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }));
}

describe("createStoreContext", () => {
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = "";
  });

  it("should provide store through context", () => {
    const { StoreProvider, useStore } = createStoreContext(createTestStore);

    function TestComponent() {
      const count = useStore((state) => state.count);
      return <div data-testid="count">{count}</div>;
    }

    const { getByTestId } = render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    expect(getByTestId("count").textContent).toBe("0");
  });

  it("should update components when store updates", () => {
    const { StoreProvider, useStore } = createStoreContext(createTestStore);

    function TestComponent() {
      const count = useStore((state) => state.count);
      const increment = useStore((state) => state.increment);
      return (
        <div>
          <div data-testid="count">{count}</div>
          <button data-testid="increment" onClick={increment}>
            Increment
          </button>
        </div>
      );
    }

    const { getByTestId } = render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    expect(getByTestId("count").textContent).toBe("0");
    act(() => {
      getByTestId("increment").click();
    });

    expect(getByTestId("count").textContent).toBe("1");
  });

  it("should throw an error when useStore is used outside of Provider", () => {
    const { useStore } = createStoreContext(createTestStore);

    const TestComponent = () => {
      const count = useStore((state) => state.count);
      return <div>{count}</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "You must provide a store or use `useStore` within a StoreProvider"
    );
  });

  it("should allow passing a store directly to useStore", () => {
    const { useStore } = createStoreContext(createTestStore);
    const directStore = createTestStore({ initial: 1 });

    function TestComponent() {
      const count = useStore((state) => state.count, directStore);
      return <div data-testid="count">{count}</div>;
    }

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("count").textContent).toBe("1");
  });

  it("should render children with current value using Subscribe component", () => {
    const { StoreProvider, Subscribe } = createStoreContext(
      (props?: { initial?: number }) => createTestStore(props)
    );

    const { getByTestId } = render(
      <StoreProvider>
        <div>
          <Subscribe selector={(state) => state.count}>
            {(count) => <span data-testid="count">{count}</span>}
          </Subscribe>
          <Subscribe selector={(state) => state.increment}>
            {(increment) => (
              <button
                data-testid="increment"
                type="button"
                onClick={() => increment()}
              >
                +
              </button>
            )}
          </Subscribe>
        </div>
      </StoreProvider>
    );

    expect(getByTestId("count").textContent).toBe("0");
    act(() => {
      getByTestId("increment").click();
    });
    expect(getByTestId("count").textContent).toBe("1");
  });

  it("should create selectors with createStoreSelector", () => {
    const { createStoreSelector, useStore, StoreProvider } =
      createStoreContext(createTestStore);

    const selectCount = createStoreSelector((state: TestState) => state.count);

    const TestComponent = () => {
      const count = useStore(selectCount);
      return <div data-testid="count">{count}</div>;
    };

    render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );

    expect(screen.getByTestId("count").textContent).toBe("0");
  });
});
