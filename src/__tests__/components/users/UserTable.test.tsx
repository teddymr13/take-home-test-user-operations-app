import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'

import UserTable from '@/components/users/UserTable'
import { createUserWithActivity } from '@/__tests__/helpers/user-fixtures'

const pushMock = jest.fn()
let searchParamsMock = ''

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: pushMock,
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/users',
  useSearchParams: () => new URLSearchParams(searchParamsMock),
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

const users = [
  createUserWithActivity({
    id: 1,
    name: 'Alice Zephyr',
    email: 'alice@example.com',
    website: 'alice.dev',
    activity: { totalPosts: 2, completedTodos: 1, pendingTodos: 3 },
  }),
  createUserWithActivity({
    id: 2,
    name: 'Bob Yellow',
    email: 'bob@example.com',
    website: 'bob.dev',
    activity: { totalPosts: 1, completedTodos: 2, pendingTodos: 0 },
  }),
  createUserWithActivity({
    id: 3,
    name: 'Charlie Xeno',
    email: 'charlie@example.com',
    website: 'charlie.dev',
    activity: { totalPosts: 4, completedTodos: 3, pendingTodos: 1 },
  }),
]

describe('UserTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    searchParamsMock = ''
  })

  it('renders the expected table headers and user content', () => {
    render(<UserTable users={users} />)

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Website' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Posts' })).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Completed Todos' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Pending Todos' })
    ).toBeInTheDocument()
    expect(screen.getAllByText('Alice Zephyr')[0]).toBeInTheDocument()
    expect(screen.getAllByText('bob@example.com')[0]).toBeInTheDocument()
  })

  it('filters rows by search params', () => {
    searchParamsMock = 'q=charlie'
    const { container } = render(<UserTable users={users} />)
    const tbody = container.querySelector('tbody')

    expect(tbody).not.toBeNull()
    expect(within(tbody as HTMLElement).getByText('Charlie Xeno')).toBeInTheDocument()
    expect(within(tbody as HTMLElement).queryByText('Alice Zephyr')).not.toBeInTheDocument()
    expect(within(tbody as HTMLElement).queryByText('Bob Yellow')).not.toBeInTheDocument()
  })

  it('filters users with pending todos only', () => {
    searchParamsMock = 'filter=pending'
    const { container } = render(<UserTable users={users} />)
    const tbody = container.querySelector('tbody')

    expect(within(tbody as HTMLElement).getByText('Alice Zephyr')).toBeInTheDocument()
    expect(within(tbody as HTMLElement).getByText('Charlie Xeno')).toBeInTheDocument()
    expect(within(tbody as HTMLElement).queryByText('Bob Yellow')).not.toBeInTheDocument()
  })

  it('sorts rows by pending todos descending', () => {
    searchParamsMock = 'sort=pending-desc'
    const { container } = render(<UserTable users={users} />)
    const rows = Array.from(container.querySelectorAll('tbody tr'))

    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveTextContent('Alice Zephyr')
    expect(rows[1]).toHaveTextContent('Charlie Xeno')
    expect(rows[2]).toHaveTextContent('Bob Yellow')
  })

  it('renders an empty state when no users match the current filters', () => {
    searchParamsMock = 'q=missing'
    render(<UserTable users={users} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'No users match the current filters.'
    )
  })

  it('navigates to the user details page while preserving filter state', () => {
    searchParamsMock = 'q=alice&sort=name-desc'
    const { container } = render(<UserTable users={users} />)
    const firstRow = container.querySelector('tbody tr')

    fireEvent.click(firstRow as HTMLElement)

    expect(pushMock).toHaveBeenCalledWith('/users/1?q=alice&sort=name-desc')
  })
})
