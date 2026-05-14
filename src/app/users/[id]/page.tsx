import Link from 'next/link'
import type { Metadata } from 'next'

import UserCard from '@/components/users/UserCard'
import UserPosts from '@/components/users/UserPosts'
import UserTodos from '@/components/users/UserTodos'
import { getPosts, getTodos, getUser } from '@/services/users'

type DetailPageProps = PageProps<'/users/[id]'>

function buildBackHref(searchParams: Record<string, string | string[] | undefined>) {
  const urlParams = new URLSearchParams()

  for (const [paramKey, paramValue] of Object.entries(searchParams)) {
    if (typeof paramValue === 'string' && paramValue.length > 0) {
      urlParams.set(paramKey, paramValue)
    }

    if (Array.isArray(paramValue)) {
      paramValue.forEach((arrayItem) => {
        if (arrayItem.length > 0) {
          urlParams.append(paramKey, arrayItem)
        }
      })
    }
  }

  const queryString = urlParams.toString()

  return queryString ? `/users?${queryString}` : '/users'
}

function isNotFoundError(error: unknown) {
  return error instanceof Error && error.message === 'User not found'
}

function NotFoundState({ backHref }: { backHref: string }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">User not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The requested user does not exist or the URL is invalid.
        </p>
        <Link
          href={backHref}
          className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to list
        </Link>
      </div>
    </main>
  )
}

export async function generateMetadata({
  params,
}: Pick<DetailPageProps, 'params'>): Promise<Metadata> {
  const { id: userIdParam } = await params
  const userId = Number(userIdParam)

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      title: 'User not found',
      description: 'The requested user could not be found.',
    }
  }

  try {
    const user = await getUser(userId)

    return {
      title: user.name,
      description: user.email,
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        title: 'User not found',
        description: 'The requested user could not be found.',
      }
    }

    throw error
  }
}

export default async function UserDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const [{ id: userIdParam }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const backHref = buildBackHref(resolvedSearchParams)
  const userId = Number(userIdParam)

  if (!Number.isInteger(userId) || userId <= 0) {
    return <NotFoundState backHref={backHref} />
  }

  let user
  let userPosts
  let userTodos

  try {
    const [resolvedUser, allPosts, allTodos] = await Promise.all([
      getUser(userId),
      getPosts(),
      getTodos(),
    ])

    user = resolvedUser
    userPosts = allPosts.filter((post) => post.userId === userId)
    userTodos = allTodos.filter((todo) => todo.userId === userId)
  } catch (error) {
    if (isNotFoundError(error)) {
      return <NotFoundState backHref={backHref} />
    }

    throw error
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex w-fit rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
        >
          Back to list
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="mt-2 text-slate-600">User profile, posts, and todos</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <UserCard user={user} />

        <div className="space-y-6">
          <section aria-labelledby="posts-heading" className="space-y-4">
            <div>
              <h2 id="posts-heading" className="text-xl font-semibold text-gray-900">
                Posts
              </h2>
              <p className="text-sm text-gray-600">Latest posts from this user.</p>
            </div>
            <UserPosts posts={userPosts} />
          </section>

          <section aria-labelledby="todos-heading" className="space-y-4">
            <div>
              <h2 id="todos-heading" className="text-xl font-semibold text-gray-900">
                Todos
              </h2>
              <p className="text-sm text-gray-600">
                Completion status for this user&apos;s tasks.
              </p>
            </div>
            <UserTodos todos={userTodos} />
          </section>
        </div>
      </div>
    </main>
  )
}
