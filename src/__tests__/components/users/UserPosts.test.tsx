import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'

import UserPosts from '@/components/users/UserPosts'
import { arbitraryPost } from '@/__tests__/helpers/user-fixtures'

describe('UserPosts', () => {
  it('renders every title and body for a non-empty posts array', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryPost(), { minLength: 1, maxLength: 8 }),
        (posts) => {
          const { container, unmount } = render(<UserPosts posts={posts} />)
          const text = container.textContent ?? ''

          posts.forEach((post) => {
            expect(text).toContain(post.title)
            expect(text).toContain(post.body)
          })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders an empty state when there are no posts', () => {
    render(<UserPosts posts={[]} />)

    expect(screen.getByText('No posts found')).toBeInTheDocument()
  })
})
