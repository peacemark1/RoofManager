# Kilo Code: Frontend Fix & Finish Prompts

The current frontend has some structural and styling errors. Follow these prompts in order to align the project with the `frontend_architecture.md` specifications.

---

## STEP 1: Fix Core Configuration

```text
Fix the core configuration of the Next.js frontend to match the specifications.

1. Update frontend/tailwind.config.js with the custom color palette and naming from frontend_architecture.md (Section "Design System").
   - Primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' }
   - Success: '#10b981', Warning: '#f59e0b', Danger: '#ef4444'

2. Correct frontend/app/layout.tsx:
   - Import globals.css.
   - Use the Inter font from next/font/google.
   - Add proper Metadata for "RoofManager".
   - Wrap children in a <body> with the Inter font class.

3. Create frontend/app/globals.css with Tailwind base directives:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

4. Initialize the shadcn/ui library properly if not already done.
```

---

## STEP 2: Implement API Client & State Management

```text
Build the foundation for data fetching and state management.

1. Create frontend/lib/api.ts using the implementation from frontend_architecture.md (Section 11).
2. Create frontend/lib/stores/authStore.ts using the implementation from frontend_architecture.md (Section 10).
3. Create a QueryProvider component in frontend/components/providers/QueryProvider.tsx to wrap the application with TanStack Query.
4. Update frontend/app/layout.tsx to include the QueryProvider.
```

---

## STEP 3: Build Authentication UI

```text
Implement the premium login experience.

1. Create frontend/app/(auth)/login/page.tsx using the implementation from frontend_architecture.md (Section 1).
2. Ensure it uses the shadcn/ui Card, Input, and Button components.
3. Implement the login logic using the authStore.
4. Create a similar /register page.
```

---

## STEP 4: Build Dashboard Shell

```text
Create the main application layout and navigation.

1. Create frontend/app/(dashboard)/layout.tsx with the Sidebar and Header as specified in Section 2.
2. Implement the Sidebar navigation links (Dashboard, Leads, Jobs, etc.).
3. Create the main Dashboard homepage at frontend/app/(dashboard)/dashboard/page.tsx using the StatsCards and Pipeline overview from Section 3.
```

---

## STEP 5: Build Lead Management

```text
Implement the Lead Management views.

1. Create frontend/app/(dashboard)/leads/page.tsx.
2. Build the LeadTable and LeadKanban components as described in Section 4.
3. Connect them to the backend API using custom hooks in lib/hooks/useLeads.ts.
```

---

## STEP 6: Complete Remaining Pages

```text
Finish the remaining dashboard pages:
- Jobs: /jobs and /jobs/[id] (Section 5)
- AI Estimation: /estimates/create (Section 6)
- Quoting: /quotes/[id] (Section 7)
- Invoices: /invoices
```

---

Refer to `docs/specifications/frontend_architecture.md` for all code snippets and design details.
```
