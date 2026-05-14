import { Post, Todo, User } from '@/types/user'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}

export async function getUser(userId: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${userId}`)

  if (!response.ok) {
    throw new Error('User not found')
  }

  return response.json()
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${BASE_URL}/todos`)

  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }

  return response.json()
}