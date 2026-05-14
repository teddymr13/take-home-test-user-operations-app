import * as fc from 'fast-check'
import {
  cn,
  computeUserActivity,
  filterBySearch,
  filterByPending,
  sortUsers,
  applyFilters,
  type SortOption,
} from '@/lib/utils'
import type { User, Post, Todo, UserWithActivity } from '@/types/user'

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

function arbitraryUser(): fc.Arbitrary<User> {
  return fc.record({
    id: fc.integer({ min: 1, max: 10_000 }),
    name: fc.string({ minLength: 1, maxLength: 80 }),
    username: fc.string({ minLength: 1, maxLength: 40 }),
    email: fc.emailAddress(),
    phone: fc.string({ minLength: 1, maxLength: 20 }),
    website: fc.domain(),
    company: fc.record({
      name: fc.string({ minLength: 1, maxLength: 60 }),
      catchPhrase: fc.string({ minLength: 1, maxLength: 120 }),
    }),
    address: fc.record({
      street: fc.string({ minLength: 1, maxLength: 60 }),
      suite: fc.string({ minLength: 1, maxLength: 40 }),
      city: fc.string({ minLength: 1, maxLength: 60 }),
      zipcode: fc.string({ minLength: 1, maxLength: 20 }),
    }),
  })
}

function arbitraryPost(userId?: number): fc.Arbitrary<Post> {
  const userIdArb =
    userId !== undefined
      ? fc.constant(userId)
      : fc.integer({ min: 1, max: 10_000 })

  return fc.record({
    userId: userIdArb,
    id: fc.integer({ min: 1, max: 100_000 }),
    title: fc.string({ minLength: 1, maxLength: 120 }),
    body: fc.string({ minLength: 1, maxLength: 500 }),
  })
}

function arbitraryTodo(userId?: number): fc.Arbitrary<Todo> {
  const userIdArb =
    userId !== undefined
      ? fc.constant(userId)
      : fc.integer({ min: 1, max: 10_000 })

  return fc.record({
    userId: userIdArb,
    id: fc.integer({ min: 1, max: 100_000 }),
    title: fc.string({ minLength: 1, maxLength: 120 }),
    completed: fc.boolean(),
  })
}

function arbitraryUserWithActivity(): fc.Arbitrary<UserWithActivity> {
  return fc
    .record({
      user: arbitraryUser(),
      totalPosts: fc.integer({ min: 0, max: 200 }),
      completedTodos: fc.integer({ min: 0, max: 200 }),
      pendingTodos: fc.integer({ min: 0, max: 200 }),
    })
    .map(({ user, totalPosts, completedTodos, pendingTodos }) => ({
      ...user,
      activity: { totalPosts, completedTodos, pendingTodos },
    }))
}

// ---------------------------------------------------------------------------
// cn utility tests
// ---------------------------------------------------------------------------

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Property 2: UserWithActivity computation is correct
// Validates: Requirements 3.2
// ---------------------------------------------------------------------------

describe('computeUserActivity', () => {
  // Feature: user-management-app, Property 2: UserWithActivity computation is correct
  it('totalPosts equals count of posts with matching userId', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUser(), { maxLength: 20 }),
        fc.array(arbitraryPost(), { maxLength: 100 }),
        fc.array(arbitraryTodo(), { maxLength: 100 }),
        (users, posts, todos) => {
          const result = computeUserActivity(users, posts, todos)

          return result.every((uwa) => {
            const expected = posts.filter((p) => p.userId === uwa.id).length
            return uwa.activity.totalPosts === expected
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 2: UserWithActivity computation is correct
  it('completedTodos equals count of completed todos with matching userId', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUser(), { maxLength: 20 }),
        fc.array(arbitraryPost(), { maxLength: 100 }),
        fc.array(arbitraryTodo(), { maxLength: 100 }),
        (users, posts, todos) => {
          const result = computeUserActivity(users, posts, todos)

          return result.every((uwa) => {
            const expected = todos.filter(
              (t) => t.userId === uwa.id && t.completed === true
            ).length
            return uwa.activity.completedTodos === expected
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 2: UserWithActivity computation is correct
  it('pendingTodos equals count of incomplete todos with matching userId', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUser(), { maxLength: 20 }),
        fc.array(arbitraryPost(), { maxLength: 100 }),
        fc.array(arbitraryTodo(), { maxLength: 100 }),
        (users, posts, todos) => {
          const result = computeUserActivity(users, posts, todos)

          return result.every((uwa) => {
            const expected = todos.filter(
              (t) => t.userId === uwa.id && t.completed === false
            ).length
            return uwa.activity.pendingTodos === expected
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 2: UserWithActivity computation is correct
  it('output length equals input users length', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUser(), { maxLength: 20 }),
        fc.array(arbitraryPost(), { maxLength: 100 }),
        fc.array(arbitraryTodo(), { maxLength: 100 }),
        (users, posts, todos) => {
          const result = computeUserActivity(users, posts, todos)
          return result.length === users.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 3: Search filter only returns matching users
// Validates: Requirements 3.7
// ---------------------------------------------------------------------------

describe('filterBySearch', () => {
  // Feature: user-management-app, Property 3: Search filter only returns matching users
  it('returns only users whose name or email contains q (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (users, q) => {
          const result = filterBySearch(users, q)
          const lower = q.toLowerCase()

          return result.every(
            (u) =>
              u.name.toLowerCase().includes(lower) ||
              u.email.toLowerCase().includes(lower)
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 3: Search filter only returns matching users
  it('never excludes a user whose name or email contains q', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (users, q) => {
          const result = filterBySearch(users, q)
          const lower = q.toLowerCase()

          const shouldMatch = users.filter(
            (u) =>
              u.name.toLowerCase().includes(lower) ||
              u.email.toLowerCase().includes(lower)
          )

          // Every user that should match must appear in the result
          return shouldMatch.every((u) => result.some((r) => r.id === u.id))
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 3: Search filter only returns matching users
  it('returns all users when q is empty', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = filterBySearch(users, '')
          return result.length === users.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 4: Sort order invariant
// Validates: Requirements 3.8
// ---------------------------------------------------------------------------

const sortOptions: SortOption[] = ['name-asc', 'name-desc', 'pending-desc', 'pending-asc']

describe('sortUsers', () => {
  // Feature: user-management-app, Property 4: Sort order invariant
  it('returns an array of the same length for any sort option', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.constantFrom(...sortOptions),
        (users, sort) => {
          const result = sortUsers(users, sort)
          return result.length === users.length
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('adjacent elements satisfy the sort comparator for name-asc', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = sortUsers(users, 'name-asc')
          for (let i = 0; i < result.length - 1; i++) {
            if (result[i].name.localeCompare(result[i + 1].name) > 0) return false
          }
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('adjacent elements satisfy the sort comparator for name-desc', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = sortUsers(users, 'name-desc')
          for (let i = 0; i < result.length - 1; i++) {
            if (result[i].name.localeCompare(result[i + 1].name) < 0) return false
          }
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('adjacent elements satisfy the sort comparator for pending-desc', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = sortUsers(users, 'pending-desc')
          for (let i = 0; i < result.length - 1; i++) {
            if (result[i].activity.pendingTodos < result[i + 1].activity.pendingTodos)
              return false
          }
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('adjacent elements satisfy the sort comparator for pending-asc', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = sortUsers(users, 'pending-asc')
          for (let i = 0; i < result.length - 1; i++) {
            if (result[i].activity.pendingTodos > result[i + 1].activity.pendingTodos)
              return false
          }
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('result is a permutation of the input (same elements)', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.constantFrom(...sortOptions),
        (users, sort) => {
          const result = sortUsers(users, sort)
          // Every input id appears in the output exactly once
          const inputIds = users.map((u) => u.id).sort((a, b) => a - b)
          const resultIds = result.map((u) => u.id).sort((a, b) => a - b)
          return JSON.stringify(inputIds) === JSON.stringify(resultIds)
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 4: Sort order invariant
  it('does not mutate the input array', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.constantFrom(...sortOptions),
        (users, sort) => {
          const copy = [...users]
          sortUsers(users, sort)
          // Original array order should be unchanged
          return users.every((u, i) => u === copy[i])
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 5: Pending filter only returns users with pending todos
// Validates: Requirements 3.9
// ---------------------------------------------------------------------------

describe('filterByPending', () => {
  // Feature: user-management-app, Property 5: Pending filter only returns users with pending todos
  it('returns only users where pendingTodos > 0', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = filterByPending(users)
          return result.every((u) => u.activity.pendingTodos > 0)
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 5: Pending filter only returns users with pending todos
  it('includes every user from the input that has pendingTodos > 0', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = filterByPending(users)
          const shouldInclude = users.filter((u) => u.activity.pendingTodos > 0)

          return shouldInclude.every((u) => result.some((r) => r.id === u.id))
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 5: Pending filter only returns users with pending todos
  it('excludes every user from the input that has pendingTodos === 0', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = filterByPending(users)
          const shouldExclude = users.filter((u) => u.activity.pendingTodos === 0)

          return shouldExclude.every((u) => !result.some((r) => r.id === u.id))
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 6: applyFilters composes all filters correctly
// Validates: Requirements 3.7, 3.8, 3.9
// ---------------------------------------------------------------------------

describe('applyFilters', () => {
  // Feature: user-management-app, Property 6: applyFilters composes all filters correctly
  it('applies search filter when q is non-empty', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.constantFrom(...sortOptions),
        (users, q, sort) => {
          const result = applyFilters(users, { q, sort, filter: '' })
          const lower = q.toLowerCase()

          return result.every(
            (u) =>
              u.name.toLowerCase().includes(lower) ||
              u.email.toLowerCase().includes(lower)
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 6: applyFilters composes all filters correctly
  it('applies pending filter when filter is "pending"', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.constantFrom(...sortOptions),
        (users, sort) => {
          const result = applyFilters(users, { q: '', sort, filter: 'pending' })

          return result.every((u) => u.activity.pendingTodos > 0)
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 6: applyFilters composes all filters correctly
  it('applies sort after filters', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.constantFrom(...sortOptions),
        (users, sort) => {
          const result = applyFilters(users, { q: '', sort, filter: '' })

          // Check if result is sorted according to the sort option
          for (let i = 0; i < result.length - 1; i++) {
            if (sort === 'name-asc') {
              if (result[i].name.localeCompare(result[i + 1].name) > 0) return false
            } else if (sort === 'name-desc') {
              if (result[i].name.localeCompare(result[i + 1].name) < 0) return false
            } else if (sort === 'pending-desc') {
              if (result[i].activity.pendingTodos < result[i + 1].activity.pendingTodos)
                return false
            } else if (sort === 'pending-asc') {
              if (result[i].activity.pendingTodos > result[i + 1].activity.pendingTodos)
                return false
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 6: applyFilters composes all filters correctly
  it('applies both search and pending filters together', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.constantFrom(...sortOptions),
        (users, q, sort) => {
          const result = applyFilters(users, { q, sort, filter: 'pending' })
          const lower = q.toLowerCase()

          return result.every(
            (u) =>
              (u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)) &&
              u.activity.pendingTodos > 0
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  // Feature: user-management-app, Property 6: applyFilters composes all filters correctly
  it('returns all users when no filters are applied', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryUserWithActivity(), { maxLength: 50 }),
        (users) => {
          const result = applyFilters(users, { q: '', sort: 'name-asc', filter: '' })

          return result.length === users.length
        }
      ),
      { numRuns: 100 }
    )
  })
})
