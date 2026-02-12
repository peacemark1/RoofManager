# Roofing Business UI Design Specifications

## Google Stitch Project Details

- **Project Name:** Roofing Business UI
- **Project ID:** `10825072607518409926`
- **Project Type:** PROJECT_DESIGN
- **Visibility:** PRIVATE
- **Created:** 2026-02-12

---

## 1. Landing Page Hero Section

### Screen Overview
A compelling hero section designed to capture visitor attention and drive conversions for the roofing business landing page.

### Design Specifications

#### Layout
- **Type:** Full-width hero section
- **Background:** High-quality image of professional roofing work or residential/commercial roof
- **Content Alignment:** Centered content overlay
- **Height:** Full viewport height (100vh) with optional scroll indicator

#### Typography
- **Headline:** "Professional Roofing Services"
  - Font: Bold, Sans-serif (Inter or similar)
  - Size: 48px+ (desktop), 32px+ (mobile)
  - Color: White (#FFFFFF)
  - Weight: 700 (Bold)
- **Subheadline:** "Quality craftsmanship, reliable service, and durable solutions for all your roofing needs"
  - Font: Regular, Sans-serif
  - Size: 18-20px (desktop), 16px (mobile)
  - Color: White (#FFFFFF) with slight opacity (0.9)
  - Weight: 400 (Regular)

#### Call-to-Action Buttons
1. **Primary Button - "Get Quote"**
   - Background: Orange (#F97316)
   - Text Color: White (#FFFFFF)
   - Size: Large (px-8, py-3)
   - Border Radius: Rounded (8px)
   - Hover Effect: Darken to (#EA580C)
   - Font Weight: 600

2. **Secondary Button - "View Services"**
   - Background: Transparent
   - Border: 2px solid White (#FFFFFF)
   - Text Color: White (#FFFFFF)
   - Size: Large (px-8, py-3)
   - Border Radius: Rounded (8px)
   - Hover Effect: White background with orange text
   - Font Weight: 600

#### Navigation Header
- **Logo:** Left-aligned company branding (text or icon)
- **Navigation Links (Center):**
  - Services
  - About
  - Portfolio
  - Contact
- **Login Button (Right):**
  - Style: Ghost button or outline
  - Color: White (#FFFFFF) or matching theme

#### Trust Badges (Below CTA)
- Layout: Horizontal row or icon grid
- Content:
  - "Licensed & Insured"
  - "25+ Years Experience"
  - "100% Satisfaction Guaranteed"
- Style: White text/icons on dark overlay or contrasting background

### Color Scheme
| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Blue | #1E3A8A | Header, accents, footer |
| Secondary Orange | #F97316 | CTA buttons, highlights |
| White | #FFFFFF | Text on dark, backgrounds |
| Dark Gray | #1F2937 | Body text, secondary elements |
| Light Gray | #F3F4F6 | Section backgrounds |

### Responsive Behavior
- **Desktop (1024px+):** Full hero with centered content, background image covers full width
- **Tablet (768px-1023px):** Adjusted font sizes, reduced padding
- **Mobile (<768px):** Stacked layout, smaller text (32px headline), hamburger menu for navigation, vertical button stack

### Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React

### Google Stitch Prompt
```
Create a compelling Landing Page Hero section for a Professional Roofing Services website. Design specifications:

Layout:
- Full-width hero section with a high-quality background image of a roofer working on a roof or a beautiful residential/commercial roof
- Headline: "Professional Roofing Services" in large, bold white text (48px+)
- Subheadline: "Quality craftsmanship, reliable service, and durable solutions for all your roofing needs"
- Two CTA buttons: "Get Quote" (primary, orange #F97316 background, white text) and "View Services" (secondary, transparent with white border, white text)
- Navigation header at top with logo (left), links (center): Services, About, Portfolio, Contact, and a "Login" button (right)
- Include trust badges below CTA: "Licensed & Insured", "25+ Years Experience", "100% Satisfaction Guaranteed"

Color Scheme:
- Primary: Deep blue (#1E3A8A) for header/accents
- Secondary: Orange (#F97316) for CTA buttons
- White (#FFFFFF) for text on dark backgrounds
- Dark gray (#1F2937) for body text

Responsive Behavior:
- Desktop: Full hero with centered content, background image covers full width
- Mobile: Stacked layout, smaller text, hamburger menu for navigation

Tech Stack: Next.js with Tailwind CSS, Lucide React icons
```

---

## 2. Dashboard Overview

### Screen Overview
Main dashboard displaying key business metrics, recent activity, and quick action buttons for the roofing business management system.

### Design Specifications

#### Layout
- **Type:** Grid-based dashboard layout
- **Sidebar:** Collapsible navigation sidebar (fixed left)
- **Header:** Top navigation with user profile, notifications, search
- **Main Content:** Dashboard metrics, charts, activity feed, quick actions

#### Key Metrics Cards (Top Row)
1. **Jobs Completed**
   - Icon: CheckCircle or Briefcase
   - Value: Number (e.g., 127)
   - Trend: Up arrow with percentage (e.g., "+12%")
   - Color: Green (#10B981) accent
   - Card Style: White background, rounded corners, subtle shadow

2. **Revenue**
   - Icon: DollarSign or TrendingUp
   - Value: Currency (e.g., $45,230)
   - Trend: Up arrow with percentage (e.g., "+8%")
   - Color: Blue (#3B82F6) accent
   - Card Style: White background, rounded corners, subtle shadow

3. **Pending Quotes**
   - Icon: FileText or Clock
   - Value: Number (e.g., 15)
   - Trend: Neutral or down arrow
   - Color: Orange (#F97316) accent
   - Card Style: White background, rounded corners, subtle shadow

4. **Active Jobs**
   - Icon: Hammer or Wrench
   - Value: Number (e.g., 8)
   - Status indicator: Live/pulsing dot
   - Color: Purple (#8B5CF6) accent
   - Card Style: White background, rounded corners, subtle shadow

#### Recent Activity Feed
- **Type:** Vertical list
- **Content:**
  - New lead added (e.g., "John Doe - New Lead")
  - Quote sent (e.g., "Quote #456 sent to Sarah Smith")
  - Job completed (e.g., "Job #789 completed - 123 Main St")
  - Payment received (e.g., "$2,500 payment from ABC Corp")
- **Style:** Timeline format with icons, timestamps, and action links

#### Quick Action Buttons
1. **Create New Quote**
   - Icon: Plus or FilePlus
   - Label: "New Quote"
   - Color: Primary Blue (#1E3A8A)

2. **Add New Lead**
   - Icon: UserPlus
   - Label: "Add Lead"
   - Color: Green (#10B981)

3. **Schedule Job**
   - Icon: Calendar
   - Label: "Schedule Job"
   - Color: Purple (#8B5CF6)

4. **View Reports**
   - Icon: BarChart or PieChart
   - Label: "Reports"
   - Color: Gray (#6B7280)

#### Revenue Chart
- **Type:** Line or Bar chart
- **Data:** Revenue over time (last 6 months)
- **Style:** Clean, minimal axis labels, tooltips on hover
- **Library:** Recharts or Chart.js

### Color Scheme
| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Blue | #1E3A8A | Buttons, links, active states |
| Success Green | #10B981 | Success metrics, completed jobs |
| Warning Orange | #F97316 | Pending items, highlights |
| Purple | #8B5CF6 | Active jobs, schedule |
| Gray | #6B7280 | Inactive elements, borders |
| Background | #F3F4F6 | Dashboard background |

### Responsive Behavior
- **Desktop:** Full grid with 4 metric cards, sidebar visible, charts at full width
- **Tablet:** 2x2 metric card grid, collapsible sidebar, stacked charts
- **Mobile:** Single column metric cards, hidden sidebar (hamburger menu), stacked content

### Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React
- Charts: Recharts
- Data Fetching: TanStack Query

### Google Stitch Prompt
```
Create a Dashboard Overview screen for a Roofing Business Management System. Design specifications:

Layout:
- Grid-based dashboard with collapsible sidebar navigation (left) and top header with user profile/notifications
- Four metric cards in top row: Jobs Completed (127, +12%), Revenue ($45,230, +8%), Pending Quotes (15), Active Jobs (8)
- Recent activity feed on right side showing timeline of recent actions (new leads, quotes sent, jobs completed, payments)
- Quick action buttons section: "New Quote", "Add Lead", "Schedule Job", "View Reports"
- Revenue chart (line or bar) showing revenue over last 6 months

Component Requirements:
- Metric cards: White background, rounded corners, icon + value + trend indicator
- Activity feed: Timeline format with icons and timestamps
- Quick actions: Grid of buttons with icons and labels
- Charts: Clean, minimal design with tooltips

Color Scheme:
- Primary: Deep blue (#1E3A8A)
- Success: Green (#10B981)
- Warning: Orange (#F97316)
- Purple (#8B5CF6) for active jobs
- Light gray (#F3F4F6) background

Responsive Behavior:
- Desktop: Full sidebar, 4 metric cards in row, activity feed on right
- Tablet: Collapsible sidebar, 2x2 metric grid
- Mobile: Hamburger menu, single column cards, stacked content

Tech Stack: Next.js with Tailwind CSS, Lucide React icons, Recharts
```

---

## 3. Job Management View (Kanban)

### Screen Overview
Kanban-style board for managing roofing jobs through different stages: New Lead, Scheduled, In Progress, Completed.

### Design Specifications

#### Layout
- **Type:** Horizontal Kanban board with vertical columns
- **Header:** Page title, search bar, filter dropdowns, "Add Job" button
- **Columns:** 4 columns (New Lead, Scheduled, In Progress, Completed)

#### Columns

1. **New Lead**
   - Header Color: Gray (#6B7280)
   - Icon: User or Incoming
   - Count badge: Number of leads
   - Cards: New lead opportunities

2. **Scheduled**
   - Header Color: Blue (#3B82F6)
   - Icon: Calendar
   - Count badge: Number scheduled
   - Cards: Jobs scheduled for future dates

3. **In Progress**
   - Header Color: Orange (#F97316)
   - Icon: Hammer or Wrench
   - Count badge: Number in progress
   - Cards: Active jobs with progress indicators

4. **Completed**
   - Header Color: Green (#10B981)
   - Icon: CheckCircle
   - Count badge: Number completed
   - Cards: Finished jobs

#### Job Cards
- **Card Content:**
  - Job Title (e.g., "Smith Residence - Roof Replacement")
  - Customer Name
  - Address
  - Due Date
  - Priority indicator (High/Medium/Low)
  - Job Value (optional)
  - Assignee avatar(s)
- **Card Style:**
  - White background
  - Rounded corners (8px)
  - Subtle shadow
  - Hover effect: Lift and shadow increase
  - Draggable handle indicator

#### Filters & Actions
- **Search:** Search jobs by title, customer, address
- **Filter by:** Status, Priority, Assignee, Date Range
- **Sort by:** Due Date, Priority, Value, Created Date
- **View Options:** Kanban, List, Calendar

#### Add Job Modal
- **Fields:**
  - Job Title
  - Customer (select or create new)
  - Address
  - Job Type (Repair, Replacement, Installation)
  - Priority (High, Medium, Low)
  - Scheduled Date
  - Estimated Value
  - Notes

### Color Scheme
| Element | Color Code | Usage |
|---------|-----------|-------|
| New Lead | #6B7280 | Column header, badge |
| Scheduled | #3B82F6 | Column header, badge |
| In Progress | #F97316 | Column header, badge |
| Completed | #10B981 | Column header, badge |
| High Priority | #EF4444 | Red indicator |
| Medium Priority | #F97316 | Orange indicator |
| Low Priority | #10B981 | Green indicator |

### Responsive Behavior
- **Desktop:** Full Kanban with 4 columns, horizontal scroll
- **Tablet:** 2 columns visible, horizontal scroll for others
- **Mobile:** Single column view with tab switcher for columns, card stack

### Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React
- Drag & Drop: @dnd-kit or react-beautiful-dnd
- State Management: React Context or Zustand

### Google Stitch Prompt
```
Create a Job Management Kanban Board for a Roofing Business. Design specifications:

Layout:
- Horizontal Kanban board with 4 columns: New Lead, Scheduled, In Progress, Completed
- Page header with title, search bar, filters (Status, Priority, Assignee), and "Add Job" button
- Each column has header with icon, title, and count badge

Columns:
1. New Lead (Gray header): New lead opportunities awaiting scheduling
2. Scheduled (Blue header): Jobs scheduled for future dates with calendar icon
3. In Progress (Orange header): Active jobs with progress indicators
4. Completed (Green header): Finished jobs with checkmark icon

Job Cards:
- White cards with rounded corners and subtle shadow
- Content: Job title, customer name, address, due date, priority indicator (High/Medium/Low), assignee avatar
- Draggable with hover lift effect

Filters & Actions:
- Search jobs by title, customer, address
- Filter by: Status, Priority, Assignee, Date Range
- Sort by: Due Date, Priority, Value, Created Date

Color Scheme:
- New Lead: Gray (#6B7280)
- Scheduled: Blue (#3B82F6)
- In Progress: Orange (#F97316)
- Completed: Green (#10B981)
- High Priority: Red (#EF4444)
- Medium Priority: Orange (#F97316)
- Low Priority: Green (#10B981)
- Background: Light gray (#F3F4F6)

Responsive Behavior:
- Desktop: 4 columns with horizontal scroll
- Tablet: 2 visible columns with scroll
- Mobile: Single column with tab switcher

Tech Stack: Next.js with Tailwind CSS, Lucide React icons, @dnd-kit for drag and drop
```

---

## 4. Quote Generator

### Screen Overview
Form for creating professional roofing quotes with material selection, labor costs, and customer details.

### Design Specifications

#### Layout
- **Type:** Multi-section form with progress indicator
- **Sections:**
  1. Customer Information
  2. Job Details
  3. Materials Selection
  4. Labor & Costs
  5. Summary & Export

#### Section 1: Customer Information
- **Fields:**
  - Customer Name (text input)
  - Email (email input)
  - Phone (tel input)
  - Company Name (optional, text input)
  - Address (text input with city, state, zip)
  - Preferred Contact Method (dropdown: Email, Phone, SMS)

#### Section 2: Job Details
- **Fields:**
  - Job Type (dropdown: Repair, Replacement, New Installation)
  - Property Type (dropdown: Residential, Commercial, Industrial)
  - Roof Type (dropdown: Shingle, Tile, Metal, Flat, Other)
  - Estimated Start Date (date picker)
  - Estimated Completion (date picker or duration)
  - Job Address (if different from customer)
  - Project Description (textarea)
  - Priority Level (radio: Standard, Rush, Emergency)

#### Section 3: Materials Selection
- **Components:**
  - **Roofing Material Selector:**
    - Shingles (asphalt, architectural, luxury) with pricing per sq ft
    - Tile (concrete, clay, slate) with pricing per sq ft
    - Metal (standing seam, corrugated) with pricing per sq ft
    - Flat roof (EPDM, TPO, PVC) with pricing per sq ft
  - **Material Quantity Calculator:**
    - Area input (sq ft) with auto-calculation
    - Waste factor percentage (default 10%)
    - Underlayment type and pricing
    - Flashing type and pricing
    - Ventilation options
  - **-onsAdd Section:**
    - Gutters
    - Downspouts
    - Skylights
    - Solar panels integration

#### Section 4: Labor & Costs
- **Components:**
  - **Labor Rates:**
    - Base labor rate per hour or per sq ft
    - Number of workers
    - Estimated hours
  - **Equipment Rental:**
    - Scaffolding
    - Crane
    - Dumpster
  - **Additional Costs:**
    - Permit fees
    - Disposal fees
    - Travel expenses
  - **Discounts:**
    - Percentage or fixed amount
    - Promo code input
  - **Tax Calculation:**
    - Tax rate input
    - Tax amount display

#### Section 5: Summary & Export
- **Components:**
  - **Quote Summary:**
    - Line items with descriptions, quantities, unit prices, totals
    - Subtotal
    - Tax
    - Discount
    - Grand Total
  - **Terms & Conditions:**
    - Acceptance period
    - Payment terms
    - Warranty information
    - Cancellation policy
  - **Actions:**
    - Preview Quote (opens modal)
    - Save as Draft
    - Send to Customer (email)
    - Download PDF
    - Approve Quote

### Color Scheme
| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary | #1E3A8A | Headers, buttons, accents |
| Secondary | #F97316 | CTA buttons, highlights |
| Success | #10B981 | Save confirmation, success states |
| Warning | #F59E0B | Important notices |
| Error | #EF4444 | Validation errors |
| Border | #E5E7EB | Input borders |
| Background | #F9FAFB | Form background |

### Responsive Behavior
- **Desktop:** Full-width form with sidebar for progress
- **Tablet:** Stacked form sections, collapsible progress indicator
- **Mobile:** Single column, stepper navigation, stacked inputs

### Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React
- Forms: React Hook Form + Zod validation
- Date Picker: React Datepicker
- PDF Generation: jsPDF or react-pdf

### Google Stitch Prompt
```
Create a Quote Generator Form for a Roofing Business. Design specifications:

Layout:
- Multi-section form with progress indicator (5 steps)
- Step 1: Customer Information (name, email, phone, company, address)
- Step 2: Job Details (type, property type, roof type, dates, description, priority)
- Step 3: Materials Selection (shingles, tile, metal, flat roof options with pricing per sq ft, area calculator, add-ons)
- Step 4: Labor & Costs (labor rates, equipment rental, additional costs, discounts, tax)
- Step 5: Summary & Export (line items, totals, terms, export options)

Form Components:
- Input fields with labels, placeholders, and validation states
- Dropdown selectors for job types and materials
- Date pickers for scheduling
- Calculator for material quantities and costs
- Dynamic line items with add/remove functionality
- Summary section with subtotal, tax, discount, and grand total

Color Scheme:
- Primary: Deep blue (#1E3A8A)
- Secondary: Orange (#F97316) for CTAs
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)
- Light gray backgrounds (#F9FAFB)
- White (#FFFFFF) form cards

Actions:
- Save as Draft
- Preview Quote
- Send to Customer
- Download PDF
- Approve Quote

Tech Stack: Next.js with Tailwind CSS, Lucide React icons, React Hook Form, Zod validation
```

---

## 5. Customer Portal

### Screen Overview
Public-facing page for customers to view their quote, approve/reject, and make payments for their roofing project.

### Design Specifications

#### Layout
- **Type:** Single-page portal with sections
- **Header:** Company logo, customer welcome message, logout button
- **Sections:**
  1. Quote Overview
  2. Quote Details
  3. Approval Actions
  4. Payment Section
  5. Communication/Updates

#### Section 1: Quote Overview
- **Components:**
  - Quote Number (e.g., Q-2024-001)
  - Quote Date
  - Expiration Date
  - Total Amount
  - Status Badge (Pending, Approved, Rejected, Expired)
  - Project Timeline (Start Date, Completion Date)

#### Section 2: Quote Details
- **Components:**
  - **Job Summary:**
    - Property address
    - Job type (Repair/Replacement/New)
    - Roof type
    - Property size (sq ft)
  - **Materials List:**
    - Roofing material with specifications
    - Underlayment and flashing
    - Additional materials
  - **Labor & Services:**
    - Labor costs
    - Equipment rental
    - Permit fees
  - **Cost Breakdown:**
    - Itemized list with descriptions, quantities, unit prices, totals
    - Subtotal
    - Tax
    - Total

#### Section 3: Approval Actions
- **Components:**
  - **Approval Options:**
    - "Approve Quote" button (prominent, primary action)
    - "Reject Quote" button (secondary, with reason modal)
    - "Request Changes" button (tertiary, with change request form)
  - **Terms & Conditions:**
    - Checkbox for acceptance of terms
    - Link to full terms document
    - Signature input (optional, for digital signature)
  - **Action Confirmation:**
    - Modal or confirmation screen after approval
    - Email notification preview

#### Section 4: Payment Section
- **Components:**
  - **Payment Options:**
    - Pay Full Amount
    - Payment Plan (if enabled)
    - Deposit Payment (typically 50%)
  - **Payment Methods:**
    - Credit/Debit Card
    - Bank Transfer
    - Check
  - **Payment Form:**
    - Card details (Stripe/Paystack integration)
    - Billing address
  - **Payment History:**
    - List of previous payments
    - Receipt downloads

#### Section 5: Communication/Updates
- **Components:**
  - **Message Center:**
    - Send message to company
    - View message history
  - **Project Updates:**
    - Timeline of project status changes
    - Photos uploaded by crew
    - Completion photos
  - **Documents:**
    - Contract download
    - Invoice downloads
    - Warranty documents

### Color Scheme
| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Blue | #1E3A8A | Headers, primary buttons |
| Success Green | #10B981 | Approved status, payment success |
| Warning Orange | #F97316 | Pending status, CTAs |
| Error Red | #EF4444 | Rejected status, errors |
| Background | #F3F4F6 | Page background |
| Card Background | #FFFFFF | Content cards |

### Responsive Behavior
- **Desktop:** Full-width layout with sidebar or tabs for navigation
- **Tablet:** Responsive grid, collapsible sections
- **Mobile:** Single column, stacked sections, mobile-optimized payment form

### Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Icons: Lucide React
- Payments: Stripe/Paystack integration
- Auth: JWT or session-based with token
- File Download: Blob handling

### Google Stitch Prompt
```
Create a Customer Portal page for viewing and acting on roofing quotes. Design specifications:

Layout:
- Public-facing customer portal with company header, welcome message, and logout
- Sections: Quote Overview, Quote Details, Approval Actions, Payment Section, Communication/Updates

Quote Overview:
- Quote number (e.g., Q-2024-001), dates, total amount, status badge
- Project timeline (start/completion dates)

Quote Details:
- Job summary (address, type, roof type, property size)
- Materials list with specifications and pricing
- Labor & services breakdown
- Cost breakdown: itemized list, subtotal, tax, total

Approval Actions:
- "Approve Quote" (primary, green), "Reject Quote" (secondary), "Request Changes" (tertiary)
- Terms & Conditions checkbox with signature input
- Confirmation modal for approval actions

Payment Section:
- Payment options: Full amount, payment plan, deposit
- Payment methods: Credit card, bank transfer, check
- Integrated payment form (Stripe/Paystack)
- Payment history with receipts

Communication/Updates:
- Message center for customer-company communication
- Project updates timeline with photos
- Document downloads (contract, invoice, warranty)

Color Scheme:
- Primary: Deep blue (#1E3A8A)
- Success: Green (#10B981)
- Warning: Orange (#F97316)
- Error: Red (#EF4444)
- Light gray background (#F3F4F6)
- White (#FFFFFF) cards

Responsive Behavior:
- Desktop: Full layout with sidebar/tabs
- Tablet: Responsive grid
- Mobile: Single column, stacked sections

Tech Stack: Next.js with Tailwind CSS, Lucide React icons, Stripe/Paystack integration
```

---

## Generation Instructions

### For Each Screen

1. **Create the base screen using `generate_screen_from_text`:**
   ```
   mcporter call google-stitch.generate_screen_from_text \
     deviceType="DESKTOP" \
     modelId="GEMINI_3_PRO" \
     projectId="10825072607518409926" \
     prompt="[Screen-specific prompt from above]"
   ```

2. **Generate mobile variants using `generate_variants`:**
   ```
   mcporter call google-stitch.generate_variants \
     deviceType="MOBILE" \
     projectId="10825072607518409926" \
     prompt="Mobile responsive variant of the [screen name]" \
     selectedScreenIds="[screen_id]" \
     variantOptions='{"variantCount": 2, "creativeRange": "REFINE", "aspects": ["LAYOUT", "COLOR_SCHEME"]}'
   ```

### Project ID
**`10825072607518409926`**

### Useful Commands
- List project screens: `mcporter call google-stitch.list_screens projectId="10825072607518409926"`
- Get project details: `mcporter call google-stitch.get_project name="projects/10825072607518409926"`
- Get screen details: `mcporter call google-stitch.get_screen name="projects/10825072607518409926/screens/[screen_id]" projectId="10825072607518409926" screenId="[screen_id]"`

---

## Notes

- All screens follow a consistent design language with the professional roofing color palette (blues, oranges, whites)
- Components are designed to be reusable across screens
- Responsive behavior ensures mobile-first approach
- Integration points for backend APIs are documented in each section
- Accessibility considerations (ARIA labels, keyboard navigation, color contrast) should be verified during implementation
