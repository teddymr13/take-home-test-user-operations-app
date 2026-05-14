import * as fc from 'fast-check'

import type { Post, Todo, User, UserActivity, UserWithActivity } from '@/types/user'

function nonBlankString(maxLength: number) {
  return fc
    .string({ minLength: 1, maxLength })
    .filter((value) => value.trim().length > 0)
}

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@example.com',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
    },
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
    },
    ...overrides,
  }
}

export function createPost(overrides: Partial<Post> = {}): Post {
  return {
    userId: 1,
    id: 1,
    title: 'qui est esse',
    body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque',
    ...overrides,
  }
}

export function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
    ...overrides,
  }
}

export function createUserActivity(
  overrides: Partial<UserActivity> = {}
): UserActivity {
  return {
    totalPosts: 3,
    completedTodos: 2,
    pendingTodos: 1,
    ...overrides,
  }
}

export function createUserWithActivity(
  overrides: Partial<UserWithActivity> = {}
): UserWithActivity {
  return {
    ...createUser(),
    activity: createUserActivity(),
    ...overrides,
  }
}

export function arbitraryUser(): fc.Arbitrary<User> {
  return fc.record({
    id: fc.integer({ min: 1, max: 10_000 }),
    name: nonBlankString(60),
    username: nonBlankString(30),
    email: fc.emailAddress(),
    phone: nonBlankString(30),
    website: fc.domain(),
    company: fc.record({
      name: nonBlankString(60),
      catchPhrase: nonBlankString(100),
    }),
    address: fc.record({
      street: nonBlankString(60),
      suite: nonBlankString(30),
      city: nonBlankString(60),
      zipcode: nonBlankString(20),
    }),
  })
}

export function arbitraryPost(userId?: number): fc.Arbitrary<Post> {
  return fc.record({
    userId:
      userId === undefined
        ? fc.integer({ min: 1, max: 10_000 })
        : fc.constant(userId),
    id: fc.integer({ min: 1, max: 10_000 }),
    title: nonBlankString(120),
    body: nonBlankString(400),
  })
}

export function arbitraryTodo(userId?: number): fc.Arbitrary<Todo> {
  return fc.record({
    userId:
      userId === undefined
        ? fc.integer({ min: 1, max: 10_000 })
        : fc.constant(userId),
    id: fc.integer({ min: 1, max: 10_000 }),
    title: nonBlankString(120),
    completed: fc.boolean(),
  })
}

export function arbitraryUserActivity(): fc.Arbitrary<UserActivity> {
  return fc.record({
    totalPosts: fc.integer({ min: 0, max: 200 }),
    completedTodos: fc.integer({ min: 0, max: 200 }),
    pendingTodos: fc.integer({ min: 0, max: 200 }),
  })
}

export function arbitraryUserWithActivity(): fc.Arbitrary<UserWithActivity> {
  return fc
    .record({
      user: arbitraryUser(),
      activity: arbitraryUserActivity(),
    })
    .map(({ user, activity }) => ({
      ...user,
      activity,
    }))
}
