# User Operations App — Take-Home Test

A Next.js application showcasing a modern user management dashboard with advanced filtering, sorting, and rich activity insights.

🚀 **Live Demo**: [https://take-home-test-user-operations-app.vercel.app](https://take-home-test-user-operations-app.vercel.app)

## 📋 Project Overview

This application demonstrates a full-stack implementation of a user management system with:

- **Server-side rendering** with Next.js 13+ App Router
- **Incremental Static Regeneration (ISR)** for optimal performance
- **React Query** for efficient data fetching and caching
- **Comprehensive testing** with Jest + React Testing Library
- **Property-based testing** with fast-check
- **Responsive design** with Tailwind CSS
- **Accessibility features** including keyboard navigation and semantic HTML

## 🎯 Core Features

### 1. Users List Page (`/users`)
- Fetches users from JSONPlaceholder API
- Displays responsive table (desktop) / card layout (mobile)
- **Activity Signals**: Shows posts count, completed/pending todos per user
- **Search**: Real-time search by name or email with debouncing
- **Sorting**: Sort by name (asc/desc) or pending todos (asc/desc)
- **Filtering**: Filter users with pending todos
- **Loading States**: Skeleton loaders for better UX
- **Empty States**: Messaging when no results match filters

### 2. User Detail Page (`/users/[id]`)
- Shows comprehensive user information
- Displays user's posts and todos
- Dynamic metadata for SEO (`generateMetadata`)
- Error handling for missing users
- Back link preserves search/filter state from list
- Loading and error boundaries

### 3. User Operations Workspace
- Integrates users, posts, and todos data
- Computed activity metrics for each user
- Clear navigation between list and detail views
- Graceful error handling and edge cases

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── users/
│   │   ├── page.tsx             # Users list (server component)
│   │   ├── loading.tsx          # Loading state
│   │   ├── error.tsx            # Error boundary
│   │   └── [id]/
│   │       ├── page.tsx         # User detail (server component)
│   │       ├── loading.tsx      # Detail loading state
│   │       └── error.tsx        # Detail error boundary
│   ├── globals.css
│   ├── layout.tsx               # Root layout with React Query
│   └── page.tsx                 # Home (redirects to /users)
├── components/
│   └── users/                   # User-related components
│       ├── UserActivityBadge.tsx     # Activity display
│       ├── UserCard.tsx             # Detail view card
│       ├── UserFilters.tsx          # Search/filter/sort controls
│       ├── UserPosts.tsx            # Posts list
│       ├── UserSkeleton.tsx         # Loading placeholders
│       ├── UserTable.tsx            # Main table/card layout
│       └── UserTodos.tsx            # Todos list
├── lib/
│   ├── api.ts                   # React Query hooks
│   ├── query-client.ts          # Query client factory
│   └── utils.ts                 # Utility functions (filter/sort)
├── services/
│   └── users.ts                 # Data fetching (getUsers, getPosts, etc.)
├── providers/
│   └── ReactQueryProvider.tsx   # Query provider wrapper
├── types/
│   └── user.ts                  # TypeScript types
└── __tests__/                   # Test suite
    ├── app/                     # Page integration tests
    ├── components/              # Component tests
    ├── lib/                     # Utility tests
    ├── services/                # Service tests
    └── helpers/                 # Test fixtures
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production Build

```bash
npm run build
npm run start
```

## 🧪 Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

View coverage:

```bash
npm run test:coverage
```

### Test Coverage

- **11 test suites**
- **57 tests** (all passing)
- Coverage includes:
  - Service layer (data fetching)
  - Utility functions (filtering, sorting)
  - React components (display & interactive)
  - Page-level integration tests
  - Property-based testing with fast-check

## 📦 Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **React Query 5** — Server state management
- **Clsx** — Class name utilities

### Testing & Development
- **Jest** — Test runner
- **React Testing Library** — Component testing
- **fast-check** — Property-based testing
- **ts-jest** — TypeScript support for Jest

### Data Source
- **JSONPlaceholder API** — Mock REST API

## 🎨 Design Highlights

### Responsive Design
- Desktop: Table layout with all information visible
- Mobile: Card layout with essential information
- Smooth transitions between breakpoints

### Performance
- **ISR**: Users list cached for 60s
- **Query caching**: React Query deduplicates requests
- **Lazy loading**: Components loaded on demand
- **Optimized images**: Next.js image optimization

### Accessibility
- Semantic HTML (tables, headers, buttons)
- Keyboard navigation (Enter to navigate rows)
- ARIA labels where appropriate
- Color contrast compliance
- Focus states on interactive elements

### Error Handling
- API error boundaries with recovery
- User-friendly error messages
- Graceful degradation
- Loading states for async operations

## 📊 Implementation Details

### Activity Computation
Users are enriched with activity metrics:
- **totalPosts**: Number of posts by user
- **completedTodos**: Count of completed todos
- **pendingTodos**: Count of incomplete todos

### Filtering & Sorting
- **Search**: Case-insensitive, searches name and email
- **Pending Filter**: Shows only users with unfinished todos
- **Sort Options**: 
  - Name ascending/descending
  - Pending todos ascending/descending

### State Management
- **URL Params**: Filters/sort state persisted in URL
- **React Query**: Automatic caching and refetching
- **Component State**: Debounced search input

## 🔄 Git Commit History

The project includes meaningful commits showing development progression:

1. **Infrastructure Setup** — Jest, providers, types
2. **Data Layer** — Services, utilities, React Query
3. **UI Components** — Display and interactive components
4. **Page Routes** — List, detail, error boundaries
5. **Test Suite** — Comprehensive tests
6. **CSS Fix** — Tailwind configuration cleanup
7. **Dependencies** — Package updates

View all commits:
```bash
git log --oneline
```

## 📝 Notes

- All tests use mocked API calls, no real network requests during testing
- Property-based tests with fast-check generate 100 random test cases per property
- ISR revalidation set to 60s for users list (configurable in `src/services/users.ts`)
- Search params preserved when navigating between list and detail views
- Error boundaries implemented on both list and detail routes

## 📄 License

This project is part of a take-home assessment and is for evaluation purposes.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
