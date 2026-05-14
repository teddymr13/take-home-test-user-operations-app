import { render, screen } from '@testing-library/react'

import UserSkeleton from '@/components/users/UserSkeleton'

describe('UserSkeleton', () => {
  it('renders the list variant by default', () => {
    render(<UserSkeleton />)

    expect(screen.getByLabelText('Loading users')).toBeInTheDocument()
  })

  it('renders the detail variant when requested', () => {
    render(<UserSkeleton variant="detail" />)

    expect(screen.getByLabelText('Loading user details')).toBeInTheDocument()
  })

  it('uses animated placeholders', () => {
    const { container } = render(<UserSkeleton variant="list" />)

    expect(container.firstChild).toHaveClass('animate-pulse')
  })
})
