import UserTable from '@/components/users/UserTable'
import { computeUserActivity } from '@/lib/utils'
import { getPosts, getTodos, getUsers } from '@/services/users'

export default async function UsersPage() {
  const [users, posts, todos] = await Promise.all([
    getUsers(),
    getPosts(),
    getTodos()
  ])

  const enrichedUsers = computeUserActivity(users, posts, todos)

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users Operations</h1>
        <p className="mt-2 text-slate-600">
          User activity dashboard
        </p>
      </div>

      <UserTable users={enrichedUsers} />
    </main>
  )
}
