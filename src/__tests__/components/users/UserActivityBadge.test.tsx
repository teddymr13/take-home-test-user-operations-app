import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'

import UserActivityBadge from '@/components/users/UserActivityBadge'
import { arbitraryUserActivity } from '@/__tests__/helpers/user-fixtures'

describe('UserActivityBadge', () => {
  it('renders all three activity counts for any activity value', () => {
    fc.assert(
      fc.property(arbitraryUserActivity(), (activity) => {
        const { unmount } = render(<UserActivityBadge activity={activity} />)

        expect(screen.getByLabelText('Posts')).toHaveTextContent(
          String(activity.totalPosts)
        )
        expect(screen.getByLabelText('Completed todos')).toHaveTextContent(
          String(activity.completedTodos)
        )
        expect(screen.getByLabelText('Pending todos')).toHaveTextContent(
          String(activity.pendingTodos)
        )

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
