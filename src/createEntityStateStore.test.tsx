import { describe, expect, it } from "vitest";
import { createEntityStateStore } from "./createEntityStateStore";

interface TestEntity {
  id: number;
  name: string;
}

describe("createEntityStateStore", () => {
  const initialEntities: TestEntity[] = [
    { id: 1, name: "Entity 1" },
    { id: 2, name: "Entity 2" },
  ];

  it("should initialize with empty state when no entities provided", () => {
    const store = createEntityStateStore<TestEntity>();
    expect(store.getState().ids).toEqual([]);
    expect(store.getState().entities).toEqual({});
  });

  it("should initialize with provided entities", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    expect(store.getState().selectAll()).toEqual(initialEntities);
  });

  it("should add one entity", () => {
    const store = createEntityStateStore<TestEntity>();
    const newEntity = { id: 1, name: "New Entity" };
    store.getState().addOne(newEntity);
    expect(store.getState().selectOne(1)).toEqual(newEntity);
  });

  it("should not add an entity with duplicate id", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    const duplicateEntity = { id: 1, name: "Duplicate Entity" };
    store.getState().addOne(duplicateEntity);
    expect(store.getState().selectOne(1)).toBe(initialEntities[0]);
  });

  it("should remove one entity", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    store.getState().removeOne(1);
    expect(store.getState().selectOne(1)).toBeUndefined();
    expect(store.getState().selectTotal()).toBe(1);
  });

  it("should update one entity", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    store.getState().updateOne({ id: 1, changes: { name: "Updated Entity" } });
    expect(store.getState().selectOne(1)?.name).toBe("Updated Entity");
  });

  it("should upsert one entity", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    const upsertEntity = { id: 1, name: "Upserted Entity" };
    store.getState().upsertOne(upsertEntity);
    expect(store.getState().selectOne(1)).toEqual(upsertEntity);
    expect(store.getState().selectTotal()).toBe(2);
  });

  it("should remove many entities by ids", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    store.getState().removeMany([1, 2]);
    expect(store.getState().selectTotal()).toBe(0);
  });

  it("should remove many entities by predicate", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    store.getState().removeMany((entity) => entity.id === 1);
    expect(store.getState().selectOne(1)).toBeUndefined();
    expect(store.getState().selectTotal()).toBe(1);
  });

  it("should select all entities", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    expect(store.getState().selectAll()).toEqual(initialEntities);
    expect(store.getState().selectTotal()).toBe(2);
  });

  it("should map entities using a custom function", () => {
    const store = createEntityStateStore<TestEntity>({
      entities: initialEntities,
    });
    store.getState().map((entity) => ({
      ...entity,
      name: entity.name.toUpperCase(),
    }));
    expect(store.getState().selectAll()).toEqual([
      { id: 1, name: "ENTITY 1" },
      { id: 2, name: "ENTITY 2" },
    ]);
  });
});
