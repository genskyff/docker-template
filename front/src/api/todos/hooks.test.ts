import { describe, expect, test } from '@rstest/core';

import { todoKeys } from './hooks';

describe('todoKeys', () => {
  test('builds a list key without params', () => {
    expect(todoKeys.list()).toEqual(['todos', undefined]);
  });

  test('carries params so different pages cache separately', () => {
    expect(todoKeys.list({ offset: 20, limit: 10 })).toEqual(['todos', { offset: 20, limit: 10 }]);
    expect(todoKeys.list({ limit: 10 })).not.toEqual(todoKeys.list({ limit: 20 }));
  });

  test('every list key starts with `all`, so invalidating it matches them all', () => {
    for (const key of [todoKeys.list(), todoKeys.list({ limit: 10 })]) {
      expect(key.slice(0, todoKeys.all.length)).toEqual([...todoKeys.all]);
    }
  });
});
