import type {Config} from 'jest'

const config: Config = {
  roots: ['<rootDir>/src/features', '<rootDir>/src/tests'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/jest-setup.ts',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src/common/util', __dirname],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/common/attributes/**',
    '!src/common/map/**',
    '!src/common/clientStore/**',
    '!src/common/theme/**',
    '!src/common/util/**',
  ],
}

export default config
