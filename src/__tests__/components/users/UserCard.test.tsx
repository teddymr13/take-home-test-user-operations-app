import { render } from '@testing-library/react'
import * as fc from 'fast-check'

import UserCard from '@/components/users/UserCard'
import { arbitraryUser } from '@/__tests__/helpers/user-fixtures'

describe('UserCard', () => {
  it('renders all required user fields for any valid user', () => {
    fc.assert(
      fc.property(arbitraryUser(), (user) => {
        const { container, unmount } = render(<UserCard user={user} />)
        const text = container.textContent ?? ''

        expect(text).toContain(user.name)
        expect(text).toContain(`@${user.username}`)
        expect(text).toContain(user.email)
        expect(text).toContain(user.phone)
        expect(text).toContain(user.website)
        expect(text).toContain(user.company.name)
        expect(text).toContain(user.company.catchPhrase)
        expect(text).toContain(user.address.street)
        expect(text).toContain(user.address.suite)
        expect(text).toContain(user.address.city)
        expect(text).toContain(user.address.zipcode)

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
