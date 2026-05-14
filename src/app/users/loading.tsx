import UserSkeleton from '@/components/users/UserSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users Operations</h1>
        <p className="mt-2 text-slate-600">Loading user activity dashboard...</p>
      </div>

      <UserSkeleton variant="list" />
    </main>
  )
}
