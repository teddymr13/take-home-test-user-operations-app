import { Post } from '@/types/user'

interface UserPostsProps {
  posts: Post[]
}

export default function UserPosts({ posts }: UserPostsProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No posts found
      </div>
    )
  }

  return (
    <ul className="space-y-4" aria-label="Posts">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h3 className="mb-2 text-sm font-semibold capitalize text-gray-900">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm text-gray-600">{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
