import { UserActivity } from '@/types/user'

interface UserActivityBadgeProps {
  activity: UserActivity
}

export default function UserActivityBadge({ activity }: UserActivityBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        <span className="sr-only">Posts:</span>
        <span aria-label="Posts">{activity.totalPosts}</span>
        <span className="hidden sm:inline">Posts</span>
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <span className="sr-only">Completed:</span>
        <span aria-label="Completed todos">{activity.completedTodos}</span>
        <span className="hidden sm:inline">Completed</span>
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        <span className="sr-only">Pending:</span>
        <span aria-label="Pending todos">{activity.pendingTodos}</span>
        <span className="hidden sm:inline">Pending</span>
      </span>
    </div>
  )
}
