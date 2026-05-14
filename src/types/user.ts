export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
}

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export interface UserActivity {
  totalPosts: number
  completedTodos: number
  pendingTodos: number
}

export interface UserWithActivity extends User {
  activity: UserActivity
}