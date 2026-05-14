import * as fc from 'fast-check'
import { getUsers, getUser, getPosts, getTodos } from '@/services/users'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Helper to create a mock fetch response
function mockFetchResponse(body: unknown, ok: boolean, status: number) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response)
}

describe('getUsers', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls /users with revalidate: 60 and returns parsed JSON', async () => {
    const mockUsers = [{ id: 1, name: 'Alice' }]
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(mockUsers, true, 200))

    const result = await getUsers()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/users`, {
      next: { revalidate: 60 },
    })
    expect(result).toEqual(mockUsers)
  })

  it('throws a descriptive Error when response is not ok', async () => {
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(null, false, 500))

    await expect(getUsers()).rejects.toThrow(Error)
    await expect(getUsers()).rejects.toThrow(/./s) // non-empty message
  })
})

describe('getUser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls /users/:id and returns parsed JSON', async () => {
    const mockUser = { id: 42, name: 'Bob' }
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(mockUser, true, 200))

    const result = await getUser(42)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/users/42`)
    expect(result).toEqual(mockUser)
  })

  it('throws a descriptive Error when response is not ok', async () => {
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(null, false, 404))

    await expect(getUser(99)).rejects.toThrow(Error)
    await expect(getUser(99)).rejects.toThrow(/./s)
  })
})

describe('getPosts', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls /posts and returns parsed JSON', async () => {
    const mockPosts = [{ userId: 1, id: 1, title: 'Post 1', body: 'Body 1' }]
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(mockPosts, true, 200))

    const result = await getPosts()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/posts`)
    expect(result).toEqual(mockPosts)
  })

  it('throws a descriptive Error when response is not ok', async () => {
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(null, false, 503))

    await expect(getPosts()).rejects.toThrow(Error)
    await expect(getPosts()).rejects.toThrow(/./s)
  })
})

describe('getTodos', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls /todos and returns parsed JSON', async () => {
    const mockTodos = [{ userId: 1, id: 1, title: 'Todo 1', completed: false }]
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(mockTodos, true, 200))

    const result = await getTodos()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/todos`)
    expect(result).toEqual(mockTodos)
  })

  it('throws a descriptive Error when response is not ok', async () => {
    global.fetch = jest.fn().mockReturnValue(mockFetchResponse(null, false, 400))

    await expect(getTodos()).rejects.toThrow(Error)
    await expect(getTodos()).rejects.toThrow(/./s)
  })
})

/**
 * Property 1: Non-2xx responses always throw
 *
 * For any HTTP status code in the range 400–599, calling any service function
 * with a mocked response returning that status SHALL throw an Error with a
 * non-empty message string.
 *
 * **Validates: Requirements 2.3**
 */
describe('Property 1: Non-2xx responses always throw', () => {
  // The four service functions under test, each with a minimal valid call signature
  const serviceFunctions: Array<{ name: string; call: () => Promise<unknown> }> = [
    { name: 'getUsers', call: () => getUsers() },
    { name: 'getUser', call: () => getUser(1) },
    { name: 'getPosts', call: () => getPosts() },
    { name: 'getTodos', call: () => getTodos() },
  ]

  for (const { name, call } of serviceFunctions) {
    it(`${name} throws Error with non-empty message for any 4xx/5xx status`, async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate any HTTP error status code in the 400–599 range
          fc.integer({ min: 400, max: 599 }),
          async (status) => {
            global.fetch = jest.fn().mockReturnValue(
              mockFetchResponse(null, false, status)
            )

            let thrownError: unknown
            try {
              await call()
            } catch (err) {
              thrownError = err
            }

            // Must have thrown
            if (!(thrownError instanceof Error)) return false

            // Error message must be non-empty
            if (thrownError.message.length === 0) return false

            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  }
})
