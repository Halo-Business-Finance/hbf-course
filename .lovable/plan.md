

# Fix: Remove Unused Heavy Dependencies Causing Build Failures

## Problem
The live preview keeps crashing intermittently during the build step. The root cause is **bloated dependencies** in `package.json`. Several large, server-side packages are installed as frontend dependencies even though they are NOT imported anywhere in the `src/` folder:

- `pg` (PostgreSQL client -- Node.js only)
- `http-proxy` (Node.js only)
- `drizzle-orm` / `drizzle-kit` (server-side ORM)
- `@types/pg` (type definitions for unused package)
- `@react-three/drei`, `@react-three/fiber`, `three` (heavy 3D libraries -- not imported anywhere)
- `terser` (build tool -- should be devDependency at most)
- `fabric` (canvas library -- only used in one admin component, but very heavy)

These packages collectively add hundreds of megabytes to the `node_modules` install, causing the build environment to run out of memory or time out intermittently.

## Solution

### Step 1: Remove unused dependencies from `package.json`
Remove these packages that have zero imports in the frontend source code:
- `pg`
- `@types/pg`
- `http-proxy`
- `drizzle-orm`
- `drizzle-kit`
- `@react-three/drei`
- `@react-three/fiber`
- `three`
- `terser`

### Step 2: Move `fabric` to a dynamic import (optional optimization)
The `fabric` package is only used in `src/components/admin/CourseImageEditor.tsx`. It can stay for now since it's actually used, but could be dynamically imported later for further optimization.

### Step 3: Remove `@mendable/firecrawl-js` if unused
Verify whether this package is imported anywhere; if not, remove it too.

## Technical Details

**Files to modify:**
- `package.json` -- Remove 9 unused dependencies from the `dependencies` section

**Risk:** None. All removed packages have zero imports in the `src/` directory. The `server/` directory files (`server/db.ts`, `shared/schema.ts`) reference some of these, but those files are NOT part of the Vite frontend build.

**Expected outcome:** Faster, more reliable builds with significantly reduced `node_modules` size, eliminating the intermittent "issue starting the live preview" errors.

