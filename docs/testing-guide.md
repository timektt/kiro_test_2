# Testing Guide

This document provides comprehensive guidance on testing the community platform application.

## Overview

The testing strategy follows a multi-layered approach:

- **Unit Tests**: Test individual components, hooks, utilities, and stores in isolation
- **Integration Tests**: Test API endpoints, user flows, and component interactions
- **Performance Tests**: Validate performance optimizations and bundle sizes
- **Security Tests**: Ensure security measures are working correctly

## Test Structure

```
src/__tests__/
├── components/          # React component tests
├── hooks/              # Custom hook tests
├── lib/                # Utility and library tests
├── stores/             # State management tests
├── api/                # API endpoint tests
└── integration/        # End-to-end flow tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run comprehensive test suite with reporting
npm run test:all
```

### Specific Test Categories

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Component tests only
npm run test:components

# Hook tests only
npm run test:hooks

# API tests only
npm run test:api

# Store tests only
npm run test:stores

# Library/utility tests only
npm run test:lib

# CI/CD pipeline tests
npm run test:ci
```

## Test Categories

### 1. Component Tests

Located in `src/__tests__/components/`

**Purpose**: Test React components in isolation with proper mocking of dependencies.

**Key Areas Tested**:
- Rendering behavior
- User interactions
- Props handling
- State changes
- Accessibility features
- Error boundaries

**Example Test Structure**:
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and initial state
  })

  it('should render correctly', () => {
    // Test basic rendering
  })

  it('should handle user interactions', () => {
    // Test click, input, etc.
  })

  it('should be accessible', () => {
    // Test ARIA labels, keyboard navigation
  })
})
```

### 2. Hook Tests

Located in `src/__tests__/hooks/`

**Purpose**: Test custom React hooks and their state management logic.

**Key Areas Tested**:
- Hook return values
- State updates
- Side effects
- Error handling
- Performance optimizations

**Example Test Structure**:
```typescript
describe('useHookName', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useHookName())
    expect(result.current.state).toBe(expectedValue)
  })

  it('should update state correctly', async () => {
    const { result } = renderHook(() => useHookName())
    
    await act(async () => {
      await result.current.updateFunction(newValue)
    })
    
    expect(result.current.state).toBe(newValue)
  })
})
```

### 3. API Tests

Located in `src/__tests__/api/`

**Purpose**: Test API endpoints and route handlers.

**Key Areas Tested**:
- Request/response handling
- Authentication and authorization
- Input validation
- Error responses
- Database interactions

**Example Test Structure**:
```typescript
describe('/api/endpoint', () => {
  beforeEach(() => {
    // Mock database and external services
  })

  it('should handle valid requests', async () => {
    const response = await handler(mockRequest)
    expect(response.status).toBe(200)
  })

  it('should validate input', async () => {
    const response = await handler(invalidRequest)
    expect(response.status).toBe(400)
  })

  it('should require authentication', async () => {
    const response = await handler(unauthenticatedRequest)
    expect(response.status).toBe(401)
  })
})
```

### 4. Integration Tests

Located in `src/__tests__/integration/`

**Purpose**: Test complete user flows and system interactions.

**Key Areas Tested**:
- Authentication flows
- Post creation and interaction
- Admin functionality
- User management
- Real-time features

**Example Test Structure**:
```typescript
describe('User Authentication Flow', () => {
  it('should complete registration process', async () => {
    // Test complete registration flow
    // 1. Submit registration form
    // 2. Verify email validation
    // 3. Check user creation
    // 4. Verify session establishment
  })
})
```

### 5. Store Tests

Located in `src/__tests__/stores/`

**Purpose**: Test Zustand stores and state management logic.

**Key Areas Tested**:
- Initial state
- State mutations
- Action dispatching
- Store persistence
- Performance optimizations

### 6. Library Tests

Located in `src/__tests__/lib/`

**Purpose**: Test utility functions, performance optimizations, and security measures.

**Key Areas Tested**:
- Caching mechanisms
- Database optimizations
- Security validations
- Bundle optimizations
- Performance monitoring

## Testing Best Practices

### 1. Test Organization

- **Group related tests**: Use `describe` blocks to group related test cases
- **Clear test names**: Use descriptive test names that explain what is being tested
- **Setup and teardown**: Use `beforeEach`/`afterEach` for consistent test setup
- **Mock external dependencies**: Mock APIs, databases, and external services

### 2. Component Testing

```typescript
// Good: Test behavior, not implementation
it('should display error message when form is invalid', () => {
  render(<LoginForm />)
  fireEvent.click(screen.getByRole('button', { name: /login/i }))
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})

// Avoid: Testing implementation details
it('should set error state to true', () => {
  // Don't test internal state directly
})
```

### 3. Async Testing

```typescript
// Use waitFor for async operations
it('should load posts after component mounts', async () => {
  render(<PostFeed />)
  
  await waitFor(() => {
    expect(screen.getByText('First Post')).toBeInTheDocument()
  })
})

// Use act for state updates
it('should update state when button is clicked', async () => {
  const { result } = renderHook(() => useCounter())
  
  await act(async () => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

### 4. Mocking Strategies

```typescript
// Mock external modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock React hooks
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: mockSession,
    status: 'authenticated',
  })),
}))

// Mock API calls
jest.mock('@/hooks/use-api', () => ({
  useApi: () => ({
    get: jest.fn().mockResolvedValue(mockData),
    post: jest.fn().mockResolvedValue(mockResponse),
  }),
}))
```

### 5. Accessibility Testing

```typescript
it('should be accessible', () => {
  render(<Button>Click me</Button>)
  
  const button = screen.getByRole('button', { name: /click me/i })
  expect(button).toBeInTheDocument()
  expect(button).not.toHaveAttribute('aria-disabled')
})

it('should support keyboard navigation', async () => {
  const user = userEvent.setup()
  render(<NavigationMenu />)
  
  await user.tab()
  expect(screen.getByRole('menuitem')).toHaveFocus()
})
```

## Coverage Requirements

### Minimum Coverage Targets

- **Overall Coverage**: 80%
- **Components**: 85%
- **Hooks**: 90%
- **API Routes**: 95%
- **Utilities**: 90%
- **Stores**: 85%

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Performance Testing

### Bundle Size Testing

```typescript
// Test bundle size limits
describe('Bundle Size', () => {
  it('should not exceed size limits', () => {
    const bundleStats = getBundleStats()
    expect(bundleStats.main).toBeLessThan(200 * 1024) // 200KB
    expect(bundleStats.vendor).toBeLessThan(500 * 1024) // 500KB
  })
})
```

### Performance Monitoring

```typescript
// Test performance optimizations
describe('Performance', () => {
  it('should load components within time limit', async () => {
    const startTime = performance.now()
    render(<HeavyComponent />)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(100) // 100ms
  })
})
```

## Security Testing

### Input Validation

```typescript
describe('Input Validation', () => {
  it('should sanitize user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>'
    const result = await sanitizeInput(maliciousInput)
    expect(result).not.toContain('<script>')
  })
})
```

### Authentication Testing

```typescript
describe('Authentication', () => {
  it('should require valid session', async () => {
    const response = await protectedHandler(requestWithoutAuth)
    expect(response.status).toBe(401)
  })
})
```

## Continuous Integration

### GitHub Actions Configuration

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit && npm run lint",
      "pre-push": "npm run test:ci"
    }
  }
}
```

## Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` and `act` appropriately
2. **Mock Cleanup**: Ensure mocks are cleared between tests
3. **DOM Cleanup**: Use `cleanup` from testing library
4. **Memory Leaks**: Clear timers and subscriptions

### Debug Commands

```bash
# Run specific test file
npm test -- --testPathPattern=component-name

# Run tests with verbose output
npm test -- --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Run tests with coverage for specific file
npm test -- --coverage --testPathPattern=component-name
```

## Test Data Management

### Mock Data

Create reusable mock data in `src/__tests__/__mocks__/`:

```typescript
// mockData.ts
export const mockUser = {
  id: 'user-123',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
}

export const mockPost = {
  id: 'post-123',
  content: 'Test post content',
  author: mockUser,
  createdAt: new Date().toISOString(),
}
```

### Test Utilities

Create helper functions for common test operations:

```typescript
// testUtils.tsx
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <StoreProvider>
        {ui}
      </StoreProvider>
    </SessionProvider>
  )
}

export const createMockRequest = (options: RequestOptions) => {
  return new NextRequest('http://localhost:3000/api/test', options)
}
```

## Reporting and Metrics

### Test Reports

The comprehensive test runner generates detailed reports:

- **JSON Report**: `test-report.json` - Machine-readable results
- **Console Report**: Detailed breakdown by test category
- **Coverage Report**: HTML coverage visualization
- **Performance Metrics**: Test execution times and recommendations

### Key Metrics Tracked

- Test pass/fail rates by category
- Code coverage percentages
- Test execution times
- Performance benchmarks
- Security validation results

### Quality Gates

Tests must pass these quality gates:

- ✅ All tests passing
- ✅ Minimum 80% code coverage
- ✅ No security vulnerabilities
- ✅ Performance benchmarks met
- ✅ Accessibility standards compliance

## Maintenance

### Regular Tasks

1. **Update test dependencies** monthly
2. **Review and update mock data** when APIs change
3. **Add tests for new features** as part of development
4. **Refactor tests** when components are refactored
5. **Monitor test performance** and optimize slow tests

### Test Debt Management

- Identify and fix flaky tests
- Remove obsolete tests
- Update tests when requirements change
- Maintain test documentation
- Regular test code reviews

This comprehensive testing strategy ensures the community platform maintains high quality, performance, and security standards throughout development and deployment.