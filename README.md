# NyumbaPlug — Verified Kenya Rentals

Frontend for the Kenyan house-hunting / anti-scam rental platform. Three distinct surfaces — tenant browse, landlord dashboard, admin trust & safety console — sharing a common design-token system but each with its own layout density and visual language.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript | Broad ecosystem, type safety |
| Bundler | Vite 5 | Fast HMR, native ESM |
| Routing | react-router-dom v6 | Standard SPA routing |
| Styling | Tailwind CSS 3.4 | Utility-first, design tokens via `tailwind.config.js` |
| Icons | Lucide React | Consistent icon set across all three surfaces |
| State (client) | In-memory mock `ApiService` | Enables full demo without backend; swap for TanStack Query when connecting to real API |
| Forms | Native HTML + controlled inputs | Lightweight for current scope; add react-hook-form + zod when validation complexity grows |

## Surface Design Languages

### 1. Tenant Browse (`/`)
- **Role**: Consumer / public unauthenticated
- **Vibe**: Warm, visual, marketplace-like. Mobile-first (primary users on mid-range Android).
- **Key**: Full-bleed real-photo hero, property cards with verified badge, contact gating, scam reporting.
- **Routes**: `/` (browse/search), `/properties/:id` (detail + unit list + contact reveal)

### 2. Landlord Dashboard (`/landlord`)
- **Role**: `landlord` (gated by `verificationStatus`)
- **Vibe**: Dense, utilitarian, work-focused. Optimized for speed of listing/updating units.
- **Key**: Verification banner (pending/verified/revoked states), property + unit CRUD, caretaker relationship display.
- **Routes**: `/landlord` (dashboard)

### 3. Admin Console (`/admin`)
- **Role**: `admin`
- **Vibe**: High-density trust & safety tool. Triage queues, inline evidence review, serious revoke flow.
- **Key**: Verification queue with ID document preview, reports queue with reason picker, narrative audit log, revoke modal with blast radius calculation.
- **Routes**: `/admin` (dashboard)

## Business Rules Enforced by the UI

| Rule | Enforcement |
|------|-------------|
| **1. Verified-only creation** | "Add Property" button disabled unless `verificationStatus === 'verified'` |
| **2. Revoked landlords hidden** | `getProperties()` filters out non-verified landlords at the mock API layer |
| **3. Contact gating** | `ContactRevealModal` shows 3 states: available (with tel + wa.me links), occupied (gated reason), unverified (gated reason) |
| **4. Audit trail** | Every approve/revoke/resolve writes to the audit log with admin identity, action, target, reason, and timestamp |
| **5. Caretaker chain** | Approve flow checks parent landlord verification status before allowing caretaker approval |
| **6. Zero unreachable states** | All list/detail views handle loading, empty, error, and edge-case states |

## Route/Role Mapping

```
PUBLIC (no auth)
  /                     → BrowsePage
  /properties/:id       → PropertyDetailPage
  /login                → LoginPage
  /register             → RegisterPage

TENANT (any auth)
  /                     → BrowsePage (with report flow enabled)

LANDLORD
  /landlord             → LandlordDashboard (gated; non-verified → redirect to explainer)

ADMIN
  /admin                → AdminDashboard (gated)
```

## Running Locally

```bash
npm install
npm run dev        # → http://localhost:5173
```

## Testing, Build, and E2E

```bash
npm run typecheck
npm run build
npm run test -- --run

# Start the Vite app in one terminal
npm run dev

# In a second terminal, run Cypress headlessly
npm run cypress:run
```

Use `npm run cypress:open` for interactive local debugging.

### Demo Accounts

Use the role switcher in the navbar or the login page:

| Phone | Role | Notes |
|-------|------|-------|
| `+254700000000` | Admin | Full verification/reports/audit access |
| `+254711223344` | Landlord (verified) | Can add properties and units |
| Any other | Tenant | Browse, search, report scams |

## Project Structure

```
src/
├── components/
│   ├── common/        # Shared: Navbar, Footer, VerifiedBadge, UnitStatusBadge, ContactRevealModal, EmptyState
│   ├── tenant/        # PropertyCard, PropertySearchFilter, ReportModal
│   ├── landlord/      # VerificationBanner, AddPropertyModal, AddUnitModal
│   └── admin/         # VerificationQueue, RevokeModal, ReportsQueue, AuditLogView
├── context/
│   └── AuthContext.tsx # Auth state + demo role switching
├── pages/
│   ├── auth/          # LoginPage, RegisterPage
│   ├── tenant/        # BrowsePage, PropertyDetailPage
│   ├── landlord/      # LandlordDashboard
│   └── admin/         # AdminDashboard
├── services/
│   ├── api.ts         # In-memory mock API (swap for real HTTP calls)
│   └── mockData.ts    # Seed data: 2 properties, 3 landlords, 1 report, 2 audit logs
├── types/
│   └── index.ts       # TypeScript interfaces mirroring backend models
├── App.tsx            # Router + role-based route protection
├── main.tsx           # Entry point
└── index.css          # Tailwind directives + scrollbar utilities
```

## Design Decisions & Assumptions

- **Token storage**: Current backend issues a bearer token; the frontend stores it in memory (not localStorage) as a security baseline. If the backend adds httpOnly cookie support, no frontend changes are needed for token handling.
- **Image upload**: The current mock API uses placeholder Unsplash URLs. Production would need a file upload flow (multipart to backend or signed S3 URL). The `idDocumentUrl` field on `LandlordProfile` anticipates this.
- **No map**: Location is free-text Kenyan estate names as described in the schema. A map (Leaflet/Mapbox) is optional and deliberately excluded until location data has reliable coordinates.
- **TanStack Query not yet added**: The app uses an in-memory mock API that doesn't need cache invalidation. When connecting to the real backend, TanStack Query should be added for server-state management with proper cache invalidation on mutations (especially revoke → property list invalidation).
- **shadcn/ui not yet added**: The current component set is hand-built with Tailwind. Adding shadcn/ui would accelerate form development with accessible primitives, but the current scope doesn't require it.

## Connecting to the Backend

1. Set `VITE_API_BASE_URL=http://localhost:8081/api/v1` in `.env`
2. Replace `ApiService` methods with `fetch`/`axios` calls using the JWT from `AuthContext`
3. Add TanStack Query for cache management:
   - Invalidate property lists on landlord approve/revoke
   - Invalidate audit log on new actions
   - Invalidate reports on resolve
