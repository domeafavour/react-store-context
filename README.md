# React Store Context

A simple and lightweight store context for React built on top of [Zustand](https://github.com/pmndrs/zustand).

## Installation

### npm

```bash
npm install @domeadev/react-store-context
```

### yarn

```bash
yarn add @domeadev/react-store-context
```

### pnpm

```bash
pnpm add @domeadev/react-store-context
```

## Features

- 🪶 Lightweight wrapper around Zustand
- 🧩 Context-based state sharing
- 🔄 Component subscription with minimal re-renders
- 🎯 Type-safe selectors
- 🌳 Tree-shakeable exports

## Usage

### Basic Example

```tsx
import {
  createDefaultStore,
  createStoreContext,
} from "@domeadev/react-store-context";
import React from "react";

// Define todo type
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Create a store creator function
const createTodosStore = () =>
  createDefaultStore(
    // initial state
    { todos: [] as Todo[] },
    (set) => ({
      addTodo: (text: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Math.random().toString(36).slice(2, 9), text, completed: false },
          ],
        })),
      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    })
  );

// Create the store context
const { StoreProvider, useStore, Subscribe, createStoreSelector } =
  createStoreContext(createTodosStore);

// Use selectors for type safety
const selectTodos = createStoreSelector((state) => state.todos);
const selectActions = createStoreSelector((state) => ({
  addTodo: state.addTodo,
  toggleTodo: state.toggleTodo,
  removeTodo: state.removeTodo,
}));

// TodoList component
const TodoList = () => {
  const todos = useStore(selectTodos);
  const { toggleTodo, removeTodo } = useStore(selectActions);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

// App component
const App = () => {
  return (
    <StoreProvider>
      <TodoList />
      {/* Other components that need access to the todos state */}
    </StoreProvider>
  );
};
```

### Using the Subscribe Component

You can use the `Subscribe` component for declarative subscriptions:

```tsx
const TodoCounter = () => {
  return (
    <Subscribe selector={selectTodos}>
      {(todos) => (
        <div>
          Total: {todos.length} | Completed: {todos.filter(todo => todo.completed).length}
        </div>
      )}
    </Subscribe>
  );
};
```

### Passing Initial Props

You can pass initial props to your store:

```tsx
interface TodoStoreProps {
  initialTodos?: Todo[];
}

const { StoreProvider } = createStoreContext((props?: TodoStoreProps) =>
  createDefaultStore(
    { todos: props?.initialTodos || [] },
    (set) => ({
      addTodo: (text: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Math.random().toString(36).slice(2, 9), text, completed: false },
          ],
        })),
      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    })
  )
);

// Usage
<StoreProvider initialTodos={[
  { id: '1', text: 'Learn React', completed: true },
  { id: '2', text: 'Learn TypeScript', completed: false },
]}>
  <TodoList />
</StoreProvider>;
```

## API Reference

### `createStoreContext(storeCreator)`

Creates a React context for your store.

**Parameters:**

- `storeCreator`: A function that creates a store instance

**Returns:**

- `StoreContext`: The React context object
- `StoreProvider`: A provider component for the store
- `useStore`: A hook to access the store state
- `createStoreSelector`: A utility to create typed selectors
- `Subscribe`: A component for declarative subscriptions

### `createDefaultStore(initialState, actionsCreator)`

Creates a default store with initial state and actions.

**Parameters:**

- `initialState`: The initial state object
- `actionsCreator`: A function that returns actions using Zustand's `set` function

## License

MIT © [domeafavour](https://github.com/domeafavour)
