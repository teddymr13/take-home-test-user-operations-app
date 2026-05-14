'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getUser, getUsers, getPosts, getTodos } from '@/services/users'
import { Post, Todo, User, UserWithActivity } from '@/types/user'

export function useUsers(): UseQueryResult<UserWithActivity[]> {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers as () => Promise<UserWithActivity[]>,
  })
}

export function useUser(id: number): UseQueryResult<User> {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  })
}

export function usePosts(userId?: number): UseQueryResult<Post[]> {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const posts = await getPosts()
      return userId !== undefined ? posts.filter(post => post.userId === userId) : posts
    },
  })
}

export function useTodos(userId?: number): UseQueryResult<Todo[]> {
  return useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      const todos = await getTodos()
      return userId !== undefined ? todos.filter(todo => todo.userId === userId) : todos
    },
  })
}
