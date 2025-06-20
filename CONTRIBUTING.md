# Contributing to Workouts Frontend

Thank you for your interest in contributing to the Workouts Frontend project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/workouts-fe.git
   cd workouts-fe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Run type checking**
   ```bash
   pnpm check
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: All new code should be written in TypeScript with proper type annotations
- **Svelte**: Follow Svelte best practices and conventions
- **Formatting**: The project uses consistent formatting - please maintain the existing style
- **Comments**: Add comments for complex logic and component interfaces

### Component Structure

When creating new Svelte components:

```svelte
<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import type { ComponentProps } from '../types';
  
  // Props with types
  export let title: string;
  export let optional: boolean = false;
  
  // Local variables
  let loading = false;
  
  // Functions
  function handleAction() {
    // Implementation
  }
  
  // Lifecycle
  onMount(() => {
    // Initialization
  });
</script>

<!-- Template with proper accessibility -->
<div class="component-wrapper">
  <h2>{title}</h2>
  <!-- Content -->
</div>

<style>
  /* Component-specific styles */
  .component-wrapper {
    /* Styles */
  }
</style>
```

### TypeScript Guidelines

- Define proper interfaces for all data structures
- Use type assertions sparingly and prefer type guards
- Export types that might be used by other components
- Keep type definitions in `src/types.ts` for shared types

### State Management

- Use Svelte stores for shared state
- Keep component-local state in the component when possible
- Follow the existing patterns for authentication and data management

## 🧪 Testing

Currently, the project doesn't have automated tests, but when adding them:

- Write unit tests for utility functions
- Add component tests for complex components
- Test API integration functions
- Ensure accessibility compliance

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Add proper TypeScript types
   - Test your changes manually

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

### Commit Message Convention

Use conventional commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🐛 Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### Features
- Workout templates and presets
- Social features (sharing workouts)
- Data export/import functionality
- Offline mode support
- Mobile app (using Capacitor)
- Advanced analytics and charts

### Technical Improvements
- Unit and integration tests
- Performance optimizations
- Accessibility improvements
- PWA features
- Enhanced error handling
- Code splitting optimization

### UI/UX Enhancements
- Dark mode theme
- Better mobile responsiveness
- Custom workout categories
- Exercise video integration
- Progress photos
- Achievement system

### Documentation
- API documentation
- Component documentation
- User guides
- Deployment guides
- Performance optimization guides

## 🔧 Development Tools

### Recommended VS Code Extensions

- Svelte for VS Code
- TypeScript and JavaScript Language Features
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

### Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Type checking

# Code Quality
pnpm check            # Run Svelte and TypeScript checks
```

## 📚 Resources

- [Svelte Documentation](https://svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [SPA Router Documentation](https://github.com/ItalyPaleAle/svelte-spa-router)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Provide constructive feedback

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

Thank you for contributing to Workouts Frontend! 🎉
