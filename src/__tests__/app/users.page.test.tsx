import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import UsersError from '@/app/users/error'
import UsersLoading from '@/app/users/loading'
import UsersPage from '@/app/users/page'
import { createPost, createTodo, createUser } from '@/__tests__/helpers/user-fixtures'
import { getPosts, getTodos, getUsers } from '@/services/users'

jest.mock('@/services/users', () => ({
  getUsers: jest.fn(),
  getPosts: jest.fn(),
  getTodos: jest.fn(),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockedGetUsers = jest.mocked(getUsers)
const mockedGetPosts = jest.mocked(getPosts)
const mockedGetTodos = jest.mocked(getTodos)

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches users, posts, and todos then renders the enriched user table', async () => {
    mockedGetUsers.mockResolvedValue([
      createUser({ id: 1, name: 'Alice Example', email: 'alice@example.com' }),
    ])
    mockedGetPosts.mockResolvedValue([
      createPost({ id: 1, userId: 1 }),
      createPost({ id: 2, userId: 1 }),
    ])
    mockedGetTodos.mockResolvedValue([
      createTodo({ id: 1, userId: 1, completed: true }),
      createTodo({ id: 2, userId: 1, completed: false }),
    ])

    render(await UsersPage())

    expect(mockedGetUsers).toHaveBeenCalledTimes(1)
    expect(mockedGetPosts).toHaveBeenCalledTimes(1)
    expect(mockedGetTodos).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Users Operations')).toBeInTheDocument()
    expect(screen.getAllByText('Alice Example')[0]).toBeInTheDocument()
    expect(screen.getAllByText('2')[0]).toBeInTheDocument()
    expect(screen.getAllByText('1')[0]).toBeInTheDocument()
  })

  it('renders the loading skeleton for the users page', () => {
    render(<UsersLoading />)

    expect(screen.getByLabelText('Loading users')).toBeInTheDocument()
  })

  it('renders the users error boundary and retries', () => {
    const reset = jest.fn()

    render(<UsersError error={new Error('Failed to fetch users')} reset={reset} />)

    expect(screen.getByText('Failed to load users')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch users')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
