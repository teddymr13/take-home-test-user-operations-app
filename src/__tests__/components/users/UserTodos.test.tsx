import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'

import UserTodos from '@/components/users/UserTodos'
import { arbitraryTodo } from '@/__tests__/helpers/user-fixtures'

describe('UserTodos', () => {
  it('renders every todo title and completion status for a non-empty array', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryTodo(), { minLength: 1, maxLength: 8 }),
        (todos) => {
          const { container, unmount } = render(<UserTodos todos={todos} />)
          const text = container.textContent ?? ''

          todos.forEach((todo) => {
            expect(text).toContain(todo.title)
            expect(text).toContain(todo.completed ? 'Completed' : 'Pending')
          })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders an empty state when there are no todos', () => {
    render(<UserTodos todos={[]} />)

    expect(screen.getByText('No todos found')).toBeInTheDocument()
  })
})
