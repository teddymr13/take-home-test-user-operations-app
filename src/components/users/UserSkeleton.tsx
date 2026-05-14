interface UserSkeletonProps {
  variant?: 'list' | 'detail'
}

function SkeletonBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`rounded bg-gray-200 ${className}`} />
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
          <div className="flex items-center gap-3 pt-2 md:justify-end">
            <SkeletonBlock className="h-5 w-5 rounded-sm" />
            <SkeletonBlock className="h-4 w-36" />
          </div>
        </div>
      </div>

      <div className="hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:block">
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-4 w-full" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 border-t border-gray-100 pt-3">
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-5 w-12" />
              <SkeletonBlock className="h-5 w-12" />
              <SkeletonBlock className="h-5 w-12" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-52" />
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-40" />
          <SkeletonBlock className="h-4 w-24" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <SkeletonBlock className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 border-t border-gray-100 pt-4">
                <SkeletonBlock className="h-5 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-11/12" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <SkeletonBlock className="h-6 w-28" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <SkeletonBlock className="h-5 w-5 rounded-full" />
                <SkeletonBlock className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserSkeleton({
  variant = 'list',
}: UserSkeletonProps) {
  return (
    <div
      className="animate-pulse"
      aria-label={variant === 'detail' ? 'Loading user details' : 'Loading users'}
    >
      {variant === 'detail' ? <DetailSkeleton /> : <ListSkeleton />}
    </div>
  )
}
