# Contributing to Interlink

Thank you for your interest in contributing to Interlink! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Supabase account
- Familiarity with Next.js, TypeScript, and React

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/interlink.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see SETUP.md)
5. Run the development server: `npm run dev`

## Development Workflow

### Branch Naming
Use descriptive branch names:
- `feature/user-profile-editing`
- `fix/authentication-bug`
- `docs/api-documentation`
- `refactor/database-queries`

### Commit Messages
Follow conventional commit format:
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

Examples:
- `feat(auth): add password reset functionality`
- `fix(dashboard): resolve client data loading issue`
- `docs(readme): update installation instructions`
- `refactor(components): extract reusable form components`

### Pull Request Process

1. **Create a Feature Branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   \`\`\`bash
   npm run test
   npm run build
   npm run lint
   \`\`\`

4. **Commit Your Changes**
   \`\`\`bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   \`\`\`

5. **Push to Your Fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

6. **Create Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Add screenshots for UI changes

## Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

\`\`\`typescript
// Good
interface UserProfile {
  id: string
  fullName: string
  email: string
  role: 'admin' | 'company' | 'client'
}

// Avoid
const data: any = getUserData()
\`\`\`

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for prop types
- Follow component composition patterns

\`\`\`typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  onClick: () => void
  children: React.ReactNode
}

export function Button({ variant, size, onClick, children }: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
\`\`\`

### CSS/Tailwind
- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Maintain consistent spacing

\`\`\`typescript
// Good
<div className="flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-md rounded-lg">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
\`\`\`

### File Organization
\`\`\`
components/
├── ui/              # Reusable UI components
├── forms/           # Form components
├── layout/          # Layout components
└── feature/         # Feature-specific components
\`\`\`

## Testing Guidelines

### Unit Tests
Write unit tests for:
- Utility functions
- Custom hooks
- Component logic
- Server actions

\`\`\`typescript
// Example test
import { formatCurrency } from '@/lib/utils'

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
})
\`\`\`

### Integration Tests
Test component interactions and user flows:

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { SignInForm } from '@/components/auth/signin-form'

describe('SignInForm', () => {
  it('should submit form with valid data', async () => {
    render(<SignInForm />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    
    // Assert expected behavior
  })
})
\`\`\`

### Test Commands
\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- SignInForm.test.tsx
\`\`\`

## Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props and usage
- Include examples in documentation

\`\`\`typescript
/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
\`\`\`

### README Updates
Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying setup process
- Adding new dependencies

## Database Changes

### Migration Scripts
- Create numbered SQL files in `scripts/` folder
- Include both up and down migrations
- Test migrations thoroughly
- Document breaking changes

\`\`\`sql
-- 013-add-user-preferences.sql
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'system',
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
\`\`\`

## Security Guidelines

### Authentication
- Never store passwords in plain text
- Use Supabase Auth for authentication
- Implement proper session management
- Add rate limiting for auth endpoints

### Authorization
- Implement role-based access control
- Use Row Level Security (RLS)
- Validate permissions on server side
- Never trust client-side validation alone

### Data Validation
- Validate all inputs on server side
- Use TypeScript for type safety
- Sanitize user inputs
- Use parameterized queries

## Performance Guidelines

### Code Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize database queries
- Use proper caching strategies

### Bundle Optimization
- Import only what you need
- Use dynamic imports for large components
- Optimize images and assets
- Monitor bundle size

## Issue Reporting

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos
- Environment details

### Feature Requests
Include:
- Clear description of the feature
- Use cases and benefits
- Proposed implementation approach
- Mockups or wireframes (if applicable)

## Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met

### Review Timeline
- Initial review within 2 business days
- Follow-up reviews within 1 business day
- Merge after approval from maintainers

## Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Database migrations tested
- [ ] Performance benchmarks met
- [ ] Security review completed

## Getting Help

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Communication
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for questions and ideas
- Email: dev@interlink.com for sensitive issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Interlink! 🚀
