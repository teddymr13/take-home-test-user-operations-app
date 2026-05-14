'use client'

interface UsersErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: UsersErrorProps) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Failed to load users</h1>
        <p className="mt-2 text-sm text-red-800">
          {error.message || 'Something went wrong while loading the users page.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
