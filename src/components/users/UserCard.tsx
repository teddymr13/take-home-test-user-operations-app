import { User } from '@/types/user'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-blue-100 mt-1">@{user.username}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Info */}
        <section aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3"
          >
            Contact
          </h2>
          <dl className="space-y-2">
            <div className="flex items-start gap-2">
              <dt className="w-20 shrink-0 text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900 break-all">{user.email}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="w-20 shrink-0 text-sm font-medium text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">{user.phone}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="w-20 shrink-0 text-sm font-medium text-gray-500">Website</dt>
              <dd className="text-sm text-gray-900">{user.website}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-gray-100" />

        {/* Company Info */}
        <section aria-labelledby="company-heading">
          <h2
            id="company-heading"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3"
          >
            Company
          </h2>
          <dl className="space-y-2">
            <div className="flex items-start gap-2">
              <dt className="w-20 shrink-0 text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{user.company.name}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="w-20 shrink-0 text-sm font-medium text-gray-500">Tagline</dt>
              <dd className="text-sm text-gray-900 italic">{user.company.catchPhrase}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-gray-100" />

        {/* Address */}
        <section aria-labelledby="address-heading">
          <h2
            id="address-heading"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3"
          >
            Address
          </h2>
          <address className="not-italic text-sm text-gray-900 space-y-1">
            <p>{user.address.street}</p>
            <p>{user.address.suite}</p>
            <p>
              {user.address.city}, {user.address.zipcode}
            </p>
          </address>
        </section>
      </div>
    </div>
  )
}
