import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import UserDetailError from '@/app/users/[id]/error'
import UserDetailLoading from '@/app/users/[id]/loading'
import UserDetailPage, { generateMetadata } from '@/app/users/[id]/page'
import {
  createPost,
  createTodo,
  createUser,
} from '@/__tests__/helpers/user-fixtures'
import { getPosts, getTodos, getUser } from '@/services/users'

jest.mock('@/services/users', () => ({
  getUser: jest.fn(),
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

const mockedGetUser = jest.mocked(getUser)
const mockedGetPosts = jest.mocked(getPosts)
const mockedGetTodos = jest.mocked(getTodos)

describe('UserDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the user details, posts, todos, and preserved back link', async () => {
    mockedGetUser.mockResolvedValue(
      createUser({ id: 1, name: 'Alice Example', email: 'alice@example.com' })
    )
    mockedGetPosts.mockResolvedValue([
      createPost({ id: 1, userId: 1, title: 'First Post' }),
      createPost({ id: 2, userId: 2, title: 'Ignored Post' }),
    ])
    mockedGetTodos.mockResolvedValue([
      createTodo({ id: 1, userId: 1, title: 'Primary Todo', completed: true }),
      createTodo({ id: 2, userId: 2, title: 'Ignored Todo', completed: false }),
    ])

    render(
      await UserDetailPage({
        params: Promise.resolve({ id: '1' }),
        searchParams: Promise.resolve({ q: 'alice', sort: 'name-desc' }),
      })
    )

    expect(screen.getAllByText('Alice Example')[0]).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to list' })).toHaveAttribute(
      'href',
      '/users?q=alice&sort=name-desc'
    )
    expect(screen.getByText('First Post')).toBeInTheDocument()
    expect(screen.getByText('Primary Todo')).toBeInTheDocument()
    expect(screen.queryByText('Ignored Post')).not.toBeInTheDocument()
    expect(screen.queryByText('Ignored Todo')).not.toBeInTheDocument()
  })

  it('renders a not found state for an invalid id without fetching', async () => {
    render(
      await UserDetailPage({
        params: Promise.resolve({ id: 'abc' }),
        searchParams: Promise.resolve({}),
      })
    )

    expect(screen.getByText('User not found')).toBeInTheDocument()
    expect(mockedGetUser).not.toHaveBeenCalled()
    expect(mockedGetPosts).not.toHaveBeenCalled()
    expect(mockedGetTodos).not.toHaveBeenCalled()
  })

  it('uses the user name and email in generateMetadata', async () => {
    mockedGetUser.mockResolvedValue(
      createUser({ id: 7, name: 'Metadata User', email: 'meta@example.com' })
    )

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: '7' }),
    })

    expect(metadata.title).toBe('Metadata User')
    expect(metadata.description).toBe('meta@example.com')
  })

  it('renders the detail loading skeleton', () => {
    render(<UserDetailLoading />)

    expect(screen.getByLabelText('Loading user details')).toBeInTheDocument()
  })

  it('renders the detail error boundary and supports retry', () => {
    const reset = jest.fn()

    render(
      <UserDetailError error={new Error('Failed to fetch user')} reset={reset} />
    )

    expect(screen.getByText('Failed to load user details')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch user')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
