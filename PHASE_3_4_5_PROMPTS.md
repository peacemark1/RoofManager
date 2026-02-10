# Kilo Code: Phases 3, 4, & 5 Prompts

The backend and web dashboard foundation are COMPLETE. Now we will implement AI integration, Quoting, and the Mobile PWA.

---

## PHASE 3: AI Integration (Basic)

```text
Implement AI-powered estimation using the local Ollama provider.

1. Create backend/ai/estimator.js as specified in docs/specifications/backend_implementation.md.
2. Update backend/controllers/estimate.controller.js to use the AI estimator when `useAI: true` is sent in the request.
3. Update frontend/app/(dashboard)/estimates/create/page.tsx to show the AI Estimate Preview card (Frontend Specs Section 6).
4. Connect the "Generate AI Estimate" button to the backend POST /api/estimates endpoint.
```

**ATTACH:** 
- `docs/specifications/backend_implementation.md`
- `docs/specifications/frontend_architecture.md`

---

## PHASE 4: Quoting & Proposals

```text
Build the PDF generation and public quote view system.

1. Implement the Quote PDF generation on the backend using Puppeteer (Backend Specs Section "PDF Generation").
2. Create the frontend Quote Detail page at frontend/app/(dashboard)/quotes/[id]/page.tsx (Frontend Specs Section 7).
3. Implement the Public Quote View at frontend/app/quotes/[publicLink]/page.tsx so customers can view and sign quotes without logging in.
4. Add the "Send to Customer" logic to email the quote link (using Nodemailer in backend).
```

**ATTACH:** 
- `docs/specifications/api_specification.md`
- `docs/specifications/frontend_architecture.md`
- `docs/specifications/backend_implementation.md`

---

## PHASE 5: Mobile PWA (Field Crew)

```text
Finalize the Mobile PWA experience for field workers.

1. Configure the PWA manifest at frontend/public/manifest.json and update next.config.js (Frontend Specs Section 9).
2. Build the Mobile Job List and Detail views at frontend/app/(mobile)/mobile/jobs/... (Frontend Specs Section 8).
3. Implement the GPS Check-In and Photo Upload components with mobile optimization.
4. Set up the basic offline-first store using Zustand and localStorage for job data.
```

**ATTACH:** 
- `docs/specifications/frontend_architecture.md`

---

Refer to the documentation in `docs/specifications/` for all logic and design details.
