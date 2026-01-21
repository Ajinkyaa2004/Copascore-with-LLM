---
description: Steps to ensure the project is deployment ready
---
1.  **Environment Variables**: ensuring that all necessary environment variables are defined and accessible in a production environment. Create a `.env.example` file if one doesn't exist, stripping out actual secrets.
2.  **Type Checking**: Run `npm run type-check` or `tsc --noEmit` to ensure there are no TypeScript errors that would fail the build.
3.  **Linting**: Run `npm run lint` to catch any potential issues.
4.  **Build Verification**: Run `npm run build` locally to simulate the production build process. This is the ultimate test.
5.  **Clean Up**: Ensure no debug code or unused files remain (we already did a cleanup, but a final check is good).
6.  **Configuration**: Check `next.config.ts` (or `.js`) for any production-specific settings needed (e.g., image domains).
