import { Todo } from '@/types/user'

interface UserTodosProps {
  todos: Todo[]
}

export default function UserTodos({ todos }: UserTodosProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No todos found
      </div>
    )
  }

  return (
    <ul className="space-y-3" aria-label="Todos">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={[
                'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                todo.completed
                  ? 'border-green-600 bg-green-100 text-green-700'
                  : 'border-yellow-600 bg-yellow-100 text-yellow-700',
              ].join(' ')}
            >
              {todo.completed ? '✓' : '!'}
            </span>
            <div className="space-y-1">
              <p
                className={[
                  'text-sm text-gray-900',
                  todo.completed ? 'line-through text-gray-500' : 'font-medium',
                ].join(' ')}
              >
                {todo.title}
              </p>
              <p
                className={[
                  'text-xs font-medium',
                  todo.completed ? 'text-green-700' : 'text-yellow-700',
                ].join(' ')}
                aria-label={`Status: ${todo.completed ? 'Completed' : 'Pending'}`}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
