'use client'

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { SortOption } from '@/lib/utils'

const DEFAULT_SORT: SortOption = 'name-asc'
const DEBOUNCE_DELAY = 150

function isSortOption(value: string | null): value is SortOption {
  return (
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'pending-desc' ||
    value === 'pending-asc'
  )
}

export default function UserFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentQuery = searchParams.get('q') ?? ''
  const rawSort = searchParams.get('sort')
  const currentSort = isSortOption(rawSort) ? rawSort : DEFAULT_SORT
  
  const [searchValue, setSearchValue] = useState(currentQuery)
  const [isPending, startTransition] = useTransition()
  const debounceTimeoutRef = useRef<number | null>(null)
  const isTypingRef = useRef(false)

  useEffect(() => {
    if (!isTypingRef.current) {
      setSearchValue(currentQuery)
    }
  }, [currentQuery])

  const updateParams = useCallback(
    (parameterUpdates: Record<string, string | null>) => {
      const urlParams = new URLSearchParams(searchParams.toString())

      for (const [paramKey, paramValue] of Object.entries(parameterUpdates)) {
        if (!paramValue) {
          urlParams.delete(paramKey)
        } else {
          urlParams.set(paramKey, paramValue)
        }
      }

      const updatedUrl = urlParams.toString() ? `${pathname}?${urlParams.toString()}` : pathname
      
      startTransition(() => {
        router.replace(updatedUrl, { scroll: false })
      })
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const sortOptions = useMemo(
    () => [
      { value: 'name-asc', label: 'Name (A to Z)' },
      { value: 'name-desc', label: 'Name (Z to A)' },
      { value: 'pending-desc', label: 'Pending todos (Most first)' },
      { value: 'pending-asc', label: 'Pending todos (Fewest first)' },
    ] satisfies Array<{ value: SortOption; label: string }>,
    []
  )

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      sort: event.target.value === DEFAULT_SORT ? null : event.target.value,
    })
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value
    isTypingRef.current = true
    setSearchValue(newSearchValue)

    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      updateParams({ q: newSearchValue.trim() ? newSearchValue : null })
      isTypingRef.current = false
    }, DEBOUNCE_DELAY)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_180px] md:items-end">
        <div className="space-y-2">
          <label htmlFor="user-search" className="text-sm font-medium text-gray-700">
            Search by name or email
          </label>
          <div className="relative">
            <input
              id="user-search"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 animate-spin text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Loading"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="user-sort" className="text-sm font-medium text-gray-700">
            Sort by
          </label>
          <select
            id="user-sort"
            value={currentSort}
            onChange={handleSortChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
