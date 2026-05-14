import { type ClassValue, clsx } from 'clsx'
import type { User, Post, Todo, UserWithActivity } from '@/types/user'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export type SortOption = 'name-asc' | 'name-desc' | 'pending-desc' | 'pending-asc'

export function filterBySearch(users: UserWithActivity[], searchQuery: string): UserWithActivity[] {
  if (!searchQuery) return users
  const lowerCaseQuery = searchQuery.toLowerCase()
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery)
  )
}

export function filterByPending(users: UserWithActivity[]): UserWithActivity[] {
  return users.filter((user) => user.activity.pendingTodos > 0)
}

export function sortUsers(users: UserWithActivity[], sortOption: SortOption): UserWithActivity[] {
  const sortedUsers = [...users]
  switch (sortOption) {
    case 'name-asc':
      return sortedUsers.sort((firstUser, secondUser) => firstUser.name.localeCompare(secondUser.name))
    case 'name-desc':
      return sortedUsers.sort((firstUser, secondUser) => secondUser.name.localeCompare(firstUser.name))
    case 'pending-desc':
      return sortedUsers.sort((firstUser, secondUser) => secondUser.activity.pendingTodos - firstUser.activity.pendingTodos)
    case 'pending-asc':
      return sortedUsers.sort((firstUser, secondUser) => firstUser.activity.pendingTodos - secondUser.activity.pendingTodos)
    default:
      return sortedUsers
  }
}

export function applyFilters(
  users: UserWithActivity[],
  { q: searchQuery, sort: sortOption, filter: filterType }: { q: string; sort: SortOption; filter: string }
): UserWithActivity[] {
  let filteredUsers = users

  if (searchQuery) {
    filteredUsers = filterBySearch(filteredUsers, searchQuery)
  }

  if (filterType === 'pending') {
    filteredUsers = filterByPending(filteredUsers)
  }

  filteredUsers = sortUsers(filteredUsers, sortOption)

  return filteredUsers
}
export function computeUserActivity(
  users: User[],
  posts: Post[],
  todos: Todo[]
): UserWithActivity[] {
  return users.map((user) => {
    const totalPosts = posts.filter((post) => post.userId === user.id).length
    const userTodos = todos.filter((todo) => todo.userId === user.id)
    const completedTodos = userTodos.filter((todo) => todo.completed === true).length
    const pendingTodos = userTodos.filter((todo) => todo.completed === false).length

    return {
      ...user,
      activity: {
        totalPosts,
        completedTodos,
        pendingTodos,
      },
    }
  })
}
