'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { KeyboardEvent, useMemo } from 'react'

import UserActivityBadge from '@/components/users/UserActivityBadge'
import UserFilters from '@/components/users/UserFilters'
import { applyFilters, SortOption } from '@/lib/utils'
import { UserWithActivity } from '@/types/user'

interface UserTableProps {
  users: UserWithActivity[]
}

const DEFAULT_SORT: SortOption = 'name-asc'
const ITEMS_PER_PAGE = 5

function isSortOption(value: string | null): value is SortOption {
  return (
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'pending-desc' ||
    value === 'pending-asc'
  )
}

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawSort = searchParams.get('sort')
  const currentPage = Number(searchParams.get('page') ?? '1')

  const filters = useMemo(
    () => ({
      q: searchParams.get('q') ?? '',
      sort: isSortOption(rawSort) ? rawSort : DEFAULT_SORT,
      filter: searchParams.get('filter') ?? '',
    }),
    [rawSort, searchParams]
  )

  const filteredUsers = useMemo(() => applyFilters(users, filters), [filters, users])
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, currentPage])

  const queryString = searchParams.toString()

  const getUserHref = (userId: number) =>
    queryString ? `/users/${userId}?${queryString}` : `/users/${userId}`

  const createPageUrl = (pageNumber: number) => {
    const urlParams = new URLSearchParams(searchParams.toString())

    urlParams.set('page', String(pageNumber))

    return `?${urlParams.toString()}`
  }

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    targetHref: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      router.push(targetHref)
    }
  }

  return (
    <section className="space-y-4" aria-label="Users list">
      <UserFilters />

      {filteredUsers.length === 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600 shadow-sm"
        >
          No users match the current filters.
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Posts
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Completed Todos
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                  >
                    Pending Todos
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => {
                  const userDetailHref = getUserHref(user.id)

                  return (
                    <tr
                      key={user.id}
                      tabIndex={0}
                      role="link"
                      onClick={() => router.push(userDetailHref)}
                      onKeyDown={(event) => handleRowKeyDown(event, userDetailHref)}
                      className="cursor-pointer transition hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                    >
                      <td className="px-4 py-4 align-top">
                        <div className="min-h-11">
                          <p
                            className="max-w-48 truncate text-sm font-semibold text-gray-900"
                            title={user.name}
                          >
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            @{user.username}
                          </p>

                          <div className="mt-2">
                            <UserActivityBadge activity={user.activity} />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p
                          className="max-w-56 truncate text-sm text-gray-700"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-gray-700">
                        {user.website}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-gray-700">
                        {user.activity.totalPosts}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-gray-700">
                        {user.activity.completedTodos}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-gray-700">
                        {user.activity.pendingTodos}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {paginatedUsers.map((user) => (
              <Link
                key={user.id}
                href={getUserHref(user.id)}
                className="block min-h-11 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="space-y-3">
                  <div>
                    <p
                      className="truncate text-base font-semibold text-gray-900"
                      title={user.name}
                    >
                      {user.name}
                    </p>

                    <p
                      className="truncate text-sm text-gray-600"
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                    <span>{user.website}</span>
                    <span className="text-xs text-gray-500">
                      View details
                    </span>
                  </div>

                  <UserActivityBadge activity={user.activity} />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredUsers.length
              )}{' '}
              of {filteredUsers.length} users
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={createPageUrl(Math.max(currentPage - 1, 1))}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  currentPage === 1
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prev
              </Link>

              {Array.from({ length: totalPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1

                return (
                  <Link
                    key={pageNumber}
                    href={createPageUrl(pageNumber)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                )
              })}

              <Link
                href={createPageUrl(
                  Math.min(currentPage + 1, totalPages)
                )}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  currentPage === totalPages
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}