# RoofManager Frontend Image Generation Prompts

This document provides AI image generation prompts for assets that would enhance the RoofManager frontend. All images should be generated in appropriate formats (PNG/WebP) and uploaded to Cloudinary for Vercel deployment.

---

## 1. Hero Section Image

**Purpose**: Main hero illustration showing roofing management SaaS concept

**Prompt**:
```
Professional modern dashboard interface illustration for roofing management SaaS application. 
Show a clean, dark-themed admin panel with:
- Interactive roof inspection map with satellite/drone imagery overlay
- AI analysis badges showing structural health scores
- Job management cards with status indicators
- Property portfolio statistics
- Ghana flag color accents (red, gold, green)

Style: Modern tech illustration, flat design with subtle gradients, dark background (slate/navy), 
professional corporate look, 16:9 aspect ratio, high detail, suitable for web hero section
```

**Recommended Size**: 1920x1080px
**Placement**: Replace or complement the 3D roof model in [`LandingHero.tsx`](frontend/components/landing/LandingHero.tsx:1)

---

## 2. Feature Section Icons/Illustrations

### Feature 1 - AI Roof Inspection
```
Drone scanning roof technology illustration, aerial view of residential/commercial building 
with AI scanning overlay, heat map showing damaged areas, clean vector style, blue and white 
color scheme, circular icon format, 200x200px, transparent background
```

### Feature 2 - Job Management
```
Task management board with roof job cards, calendar integration, team assignment icons, 
checklist items, status progress bars, modern flat design, purple and white tones, 
circular icon format, 200x200px, transparent background
```

### Feature 3 - Customer Portal
```
Customer engagement portal showing mobile phone with quote approval interface, 
digital signature capture, payment button, notification bell, clean modern design, 
green accent colors for success states, circular icon format, 200x200px, transparent background
```

### Feature 4 - Invoice & Payments
```
Invoice document with payment processing elements, credit card, Ghana Cedis currency symbol,
payment success checkmark, analytics chart behind, professional business style, 
gold and green accents, circular icon format, 200x200px, transparent background
```

### Feature 5 - SMS Notifications
```
SMS notification design showing phone with WhatsApp-style message, Hubtel integration,
roofing job update text, Ghana phone number format, notification bell, modern messaging 
design, green color scheme, circular icon format, 200x200px, transparent background
```

### Feature 6 - Analytics Dashboard
```
Data analytics dashboard with charts, graphs, performance metrics, revenue trends,
property health scores, professional business intelligence look, blue and teal accents,
circular icon format, 200x200px, transparent background
```

**Recommended Size**: 200x200px each
**Placement**: [`FeaturesSection.tsx`](frontend/components/landing/FeaturesSection.tsx:1) feature cards

---

## 3. Testimonial User Avatars

**Prompt Template**:
```
Professional headshot portrait, Ghanaian business person, corporate attire, 
neutral expression, soft lighting, clean background, professional headshot style,
100x100px or 150x150px, circular crop, transparent background
```

**Variations to generate**:
- Ghanaian male roofing contractor
- Ghanaian female business owner
- Mixed gender for diversity
- Construction site manager

**Recommended Size**: 100x100px (circular)
**Placement**: [`Testimonials.tsx`](frontend/components/landing/Testimonials.tsx:1) - Currently uses CSS-generated avatars

---

## 4. Pricing Section Background/Graphics

**Prompt**:
```
Abstract background pattern for SaaS pricing section, geometric shapes, subtle roof/shingle 
motifs integrated, Ghana colors (red, gold, green) as accent highlights, dark navy 
background, professional gradient, seamless pattern, 1920x600px
```

**Recommended Size**: 1920x600px
**Placement**: [`PricingSection.tsx`](frontend/components/landing/PricingSection.tsx:1) background

---

## 5. Landing Page Background Elements

### Background Texture
```
Subtle dark background texture, noise pattern, professional corporate look, 
slate/navy gradient, no visible shapes or objects, 1920x1080px
```

### Decorative Accent Shapes
```
Modern geometric accent shapes, circles and lines, Ghana colors (red, gold, green),
subtle transparency, modern tech decorative elements, various sizes for UI accents
```

---

## 6. Company Logo Placeholder

**Prompt**:
```
Professional company logo placeholder, roof/shingle icon with modern tech aesthetic,
text "YOUR LOGO" below icon, scalable vector style, dark and light versions,
PNG with transparent background, 400x150px
```

**Placement**: [`quote/[publicLink]/page.tsx`](frontend/app/quote/[publicLink]/page.tsx:171) and [`customer/[token]/page.tsx`](frontend/app/customer/[token]/page.tsx:106) for companies without uploaded logos

---

## 7. Error/Empty State Images

### 404 Page
```
404 error illustration, roof/construction theme, friendly character or mascot,
professional design, dark theme compatible, 500x400px
```

### Empty State - No Leads
```
Empty leads inbox illustration, folder with question mark, friendly design,
professional corporate style, 300x200px
```

### Empty State - No Jobs
```
No jobs scheduled illustration, calendar with checkmark, clean design, 300x200px
```

---

## 8. Social Proof/Trust Badges

**Prompt**:
```
Security and trust badge, shield with checkmark, GDPR compliant icon, 
ISO certification style, professional badge design, 150x150px, transparent background
```

**Variations**:
- SSL Security badge
- Data Protection badge
- 24/7 Support badge
- Mobile App Ready badge

---

## Image Generation Guidelines

### Color Palette (Ghana-Inspired)
- **Primary**: #EF2B2D (Ghana Red)
- **Secondary**: #FFD700 (Ghana Gold)
- **Accent**: #009E49 (Ghana Green)
- **Background**: #0F172A (Slate 900)
- **Text**: #F8FAFC (Slate 50)

### Style Consistency
- Modern flat design
- Dark theme compatible
- Professional corporate look
- Consistent line weights
- Unified corner radii

### File Specifications
| Image Type | Format | Max Size | Compression |
|------------|--------|----------|-------------|
| Hero Images | WebP | 500KB | 80% quality |
| Icons/Logos | PNG | 100KB | Lossless |
| Backgrounds | WebP | 800KB | 75% quality |
| Avatars | WebP | 50KB | 70% quality |

---

## Cloudinary Upload Configuration

After generating images, upload to Cloudinary with these settings:
- **Folder**: `roofmanager/assets`
- **Tags**: `frontend`, `marketing`, `[feature-name]`
- **Format**: Auto (Cloudinary will optimize)
- **Transformation presets**: `auto`, `q_auto`, `f_auto`

---

## Implementation Checklist

- [ ] Generate hero image
- [ ] Generate 6 feature icons
- [ ] Generate 4 testimonial avatars
- [ ] Generate pricing background
- [ ] Generate company logo placeholder
- [ ] Generate 404 error illustration
- [ ] Generate empty state images
- [ ] Generate trust badges
- [ ] Upload all to Cloudinary
- [ ] Update frontend code to use new images
- [ ] Test on Vercel deployment

---

## HuggingFace Image Generation

HuggingFace offers free image generation using models like FLUX, Stable Diffusion, and others. Here's how to generate the images:

### Option 1: HuggingFace Spaces (Web)

1. Go to https://huggingface.co/spaces and search for image generation models:
   - **FLUX.1-schnell** - Fast, free generation
   - **Stable Diffusion XL** - High quality
   - **Stable Diffusion 3** - Latest model

2. Recommended Spaces:
   - https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell
   - https://huggingface.co/spaces/stabilityai/stable-diffusion

3. Use the prompts below with these models

### Option 2: HuggingFace API (Programmatic)

```bash
# Install required packages
pip install huggingface_hub

# Generate image using Python
from huggingface_hub import InferenceClient

client = InferenceClient(token="your_hf_token")
image = client.text_to_image(
    "Your prompt here",
    model="black-forest-labs/FLUX.1-schnell"
)
image.save("output.png")
```

### Shortened Prompts for HuggingFace

Use these shortened prompts for better results with FLUX/SD models:

#### Hero Image
```
Modern dark dashboard UI for roofing management SaaS, roof inspection map, AI analysis badges, Ghana flag colors red gold green, professional corporate tech illustration, 1920x1080
```

#### Feature Icons (200x200px circular)
- **Roof Inspection**: Drone scanning roof aerial view, AI heat map overlay, blue white vector icon, circular
- **Job Management**: Task board with roof job cards, calendar, progress bars, purple white flat icon, circular
- **Customer Portal**: Mobile phone quote approval UI, signature, payment button, green accents, circular icon
- **Payments**: Invoice document, credit card, Ghana Cedis GHS symbol, success checkmark, gold green, circular
- **SMS**: Phone message UI, Hubtel style, roofing job notification, green messaging app, circular
- **Analytics**: Dashboard charts graphs, revenue metrics, blue teal business data, circular icon

#### Testimonial Avatars
- Male: Professional Ghanaian business man headshot portrait, corporate attire, neutral expression, 100x100
- Female: Professional Ghanaian woman headshot portrait, corporate attire, friendly expression, 100x100
- Male 2: Ghanaian construction manager headshot, safety gear hint, professional, 100x100
- Female 2: Ghanaian business owner headshot, corporate suit, confident smile, 100x100

#### Pricing Background
```
Abstract geometric pattern SaaS pricing, Ghana colors red gold green accents, dark navy background, modern tech gradient, seamless 1920x600
```

#### Company Logo Placeholder
```
Roofing company logo icon, modern tech style, shingle house icon, text YOUR LOGO below, dark transparent background, professional vector 400x150
```

#### Error/Empty States
- **404**: 404 error roof construction theme, friendly mascot illustration, dark theme, 500x400
- **Empty Leads**: Empty folder with question mark, roof business theme, corporate illustration, 300x200
- **Empty Jobs**: Calendar with checkmark, no jobs scheduled, clean modern design, 300x200

#### Trust Badges
```
Security shield badge with checkmark, GDPR compliant icon, ISO certification style, professional flat design, 150x150 transparent
```

### Getting Your HuggingFace Token

1. Create account at https://huggingface.co
2. Go to Settings → Access Tokens
3. Create new token with "read" permission
4. Use token in API calls

---

## Alternative: Use Existing Generated Images

The following images have been partially generated:
- ✅ `hero-dashboard.png`
- ✅ `feature-roof-inspection.png`
- ✅ `feature-job-management.png`
- ✅ `feature-customer-portal.png`

To continue, add more credits to OpenRouter or use HuggingFace for the remaining images.
