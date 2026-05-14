import type { Config } from 'jest'

const config: Config = {
  // Use jsdom to simulate a browser environment for React component tests
  testEnvironment: 'jsdom',

  // Run jest.setup.ts after the test framework is installed in the environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Resolve the @/ path alias defined in tsconfig.json paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Transform TypeScript and TSX files using ts-jest.
  // The main tsconfig.json uses "module": "esnext" and "moduleResolution": "bundler"
  // which ts-jest does not support, so we override those settings for Jest only.
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          jsx: 'react-jsx',
        },
      },
    ],
  },

  // Discover test files under src/__tests__/
  testMatch: ['<rootDir>/src/__tests__/**/*.(test|spec).(ts|tsx)'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/favicon.ico',
    '!src/app/globals.css',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}

export default config
