import { afterEach, beforeEach, describe, expect, rs, test } from '@rstest/core';

import { todoApi } from './todo';
import type { PaginationParams } from './types';

let lastUrl: string;
let lastInit: RequestInit | undefined;

/**
 * Replace fetch with a stub and record what the client sent.
 * `todoApi` only ever passes a string URL, so the stub narrows to that.
 */
const stubFetch = (respond: () => Response) => {
  rs.stubGlobal(
    'fetch',
    rs.fn((url: string, init?: RequestInit) => {
      lastUrl = url;
      lastInit = init;
      return Promise.resolve(respond());
    }),
  );
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const header = (name: string) => new Headers(lastInit?.headers).get(name);

describe('todoApi', () => {
  beforeEach(() => stubFetch(() => json([])));
  afterEach(() => {
    rs.unstubAllGlobals();
  });

  describe('getTodos', () => {
    test('omits the query string when no params are given', async () => {
      await todoApi.getTodos();
      expect(lastUrl).toBe('/api/todos');
    });

    test('serialises pagination params', async () => {
      await todoApi.getTodos({ offset: 20, limit: 10 });
      expect(lastUrl).toBe('/api/todos?offset=20&limit=10');
    });

    test('drops params without a value', async () => {
      // `exactOptionalPropertyTypes` rejects `{ offset: undefined }` in typed code,
      // but the runtime guard still matters for params crossing an untyped boundary.
      const fromUntypedSource = { offset: undefined, limit: 5 } as unknown as PaginationParams;

      await todoApi.getTodos(fromUntypedSource);
      expect(lastUrl).toBe('/api/todos?limit=5');
    });

    test('returns the parsed body', async () => {
      const todos = [{ id: '1', text: 'one', completed: false }];
      stubFetch(() => json(todos));

      await expect(todoApi.getTodos()).resolves.toEqual(todos);
    });
  });

  describe('mutations', () => {
    test('createTodo posts the input as JSON', async () => {
      await todoApi.createTodo({ text: 'one' });

      expect(lastUrl).toBe('/api/todos');
      expect(lastInit?.method).toBe('POST');
      expect(lastInit?.body).toBe('{"text":"one"}');
      expect(header('Content-Type')).toBe('application/json');
    });

    test('updateTodo patches a single todo', async () => {
      await todoApi.updateTodo('abc', { completed: true });

      expect(lastUrl).toBe('/api/todos/abc');
      expect(lastInit?.method).toBe('PATCH');
      expect(lastInit?.body).toBe('{"completed":true}');
    });

    test('deleteTodo resolves to undefined on 204', async () => {
      stubFetch(() => new Response(null, { status: 204 }));

      await expect(todoApi.deleteTodo('abc')).resolves.toBeUndefined();
      expect(lastUrl).toBe('/api/todos/abc');
      expect(lastInit?.method).toBe('DELETE');
    });
  });

  test('rejects on a non-ok response', async () => {
    stubFetch(() => new Response('nope', { status: 500 }));

    await expect(todoApi.getTodos()).rejects.toThrow('HTTP error! status: 500');
  });
});
