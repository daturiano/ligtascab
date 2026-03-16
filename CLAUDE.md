# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run lint       # Run ESLint
npm run analyze    # Build with bundle analyzer (ANALYZE=true)
```

## Architecture

### Feature-Based Structure

The codebase follows a feature-based architecture with strict import boundaries enforced by ESLint:

```
src/features/{feature}/
  ├── actions/     # Server actions ("use server")
  ├── db/          # Database queries (cached with React cache())
  ├── schemas/     # Zod validation schemas
  └── components/  # Feature-specific React components
```

**Import rules:**
- Features cannot import from other features (enforced via `import/no-restricted-paths`)
- Features cannot import from `src/app`
- Shared code (`components`, `hooks`, `lib`) cannot import from features or app

### Supabase Integration

Two client patterns exist in `src/supabase/`:
- `server.ts` - Use `createClient()` in Server Components and Server Actions
- `client.ts` - Use `createClient()` in Client Components

Database queries in feature `db/` folders should use `cache()` wrapper for request deduplication:
```typescript
export const getAllDrivers = cache(async () => {
  const supabase = await createClient();
  // ...
});
```

### Authentication & Routing

Middleware (`src/supabase/middleware.ts`) handles:
- Route protection (private vs public routes)
- Role-based redirects (`operator`, `driver`, `authority`)
- New user redirect to `/account-setup`
- Authority users are restricted to `/authority/*` routes

User roles are stored in `user_metadata.role`.

### Data Flow Pattern

1. **Pages** call server actions from features
2. **Server actions** validate with Zod, call db functions, create logs
3. **Client pages** use React Query with server actions as `queryFn`

Example pattern:
```typescript
// Client Component
const { data } = useQuery({
  queryKey: ["drivers"],
  queryFn: fetchAllDriversFromOperator,  // Server action
});
```

## Conventions

- **File/folder naming**: kebab-case (enforced via `eslint-plugin-check-file`)
- **UI components**: shadcn/ui new-york style with Lucide icons
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with Prettier plugin for class sorting
- **Forms**: react-hook-form with Zod resolvers

## Key Domain Concepts

- **Operators**: Fleet owners who manage drivers and tricycles
- **Drivers**: Work for operators, have licenses and compliance documents
- **Tricycles**: Vehicles with registration, franchise, and maintenance tracking
- **Shifts**: Driver work sessions linked to tricycles
- **Logs**: Audit trail for all CRUD operations
