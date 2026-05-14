import '@testing-library/jest-dom'

// Mock Next.js navigation hooks globally so client components that use
// useRouter / useSearchParams / usePathname can be rendered in tests
// without a real Next.js runtime.
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))
