# Generated Images Documentation

This document catalogs all generated images for the roofing business frontend.

## Design System Colors
- **Primary Blue**: `#1E3A8A` (Deep Blue)
- **Accent Orange**: `#F97316` (Bright Orange)

---

## Hero Image

### `hero.svg`
- **Description**: Hero section background featuring a stylized illustration of professional roofing services with a gradient sky background (blue to orange) and silhouetted roof structures.
- **Where to use**: [`LandingHero.tsx`](../frontend/components/landing/LandingHero.tsx) - Main hero section background.
- **Alt text**: "Professional roofing services - Quality workmanship, reliable service, affordable pricing"
- **Dimensions**: 1920x1080px
- **Format**: SVG (scalable)

---

## Feature Icons (4 icons)

### `feature-quotes.svg`
- **Description**: Diamond-shaped icon with hexagonal interior, representing quick quotes and estimates.
- **Where to use**: [`FeaturesSection.tsx`](../frontend/components/landing/FeaturesSection.tsx) - Feature card for "Quick Quotes".
- **Alt text**: "Quick quotes icon"
- **Dimensions**: 64x64px
- **Format**: SVG

### `feature-craftsmanship.svg`
- **Description**: Diamond-shaped icon with checkmark, representing quality craftsmanship and verified work.
- **Where to use**: [`FeaturesSection.tsx`](../frontend/components/landing/FeaturesSection.tsx) - Feature card for "Expert Craftsmanship".
- **Alt text**: "Expert craftsmanship icon"
- **Dimensions**: 64x64px
- **Format**: SVG

### `feature-service.svg`
- **Description**: Diamond-shaped icon with crosshairs/reticle, representing reliable and precise service.
- **Where to use**: [`FeaturesSection.tsx`](../frontend/components/landing/FeaturesSection.tsx) - Feature card for "Reliable Service".
- **Alt text**: "Reliable service icon"
- **Dimensions**: 64x64px
- **Format**: SVG

### `feature-pricing.svg`
- **Description**: Diamond-shaped icon with grid pattern and dots, representing transparent and affordable pricing.
- **Where to use**: [`FeaturesSection.tsx`](../frontend/components/landing/FeaturesSection.tsx) - Feature card for "Affordable Pricing".
- **Alt text**: "Affordable pricing icon"
- **Dimensions**: 64x64px
- **Format**: SVG

---

## Background Pattern

### `pattern-bg.svg`
- **Description**: Subtle repeating geometric pattern with blue/orange color scheme. Features grid lines, corner dots, and accent circles for section backgrounds.
- **Where to use**: Section backgrounds in [`FeaturesSection.tsx`](../frontend/components/landing/FeaturesSection.tsx), [`Testimonials.tsx`](../frontend/components/landing/Testimonials.tsx), and other landing page sections.
- **Alt text**: "Background pattern"
- **Dimensions**: 100x100px (pattern tile)
- **Format**: SVG (pattern)

---

## Testimonial Avatars (3 avatars)

### `testimonial-1.svg`
- **Description**: Placeholder avatar with blue background and orange accent, for testimonial customer photos.
- **Where to use**: [`Testimonials.tsx`](../frontend/components/landing/Testimonials.tsx) - Avatar for first testimonial (Kwame Asante).
- **Alt text**: "Photo of Kwame Asante"
- **Dimensions**: 200x200px
- **Format**: SVG (placeholder - replace with actual customer photo)

### `testimonial-2.svg`
- **Description**: Placeholder avatar with orange background and blue accent, for testimonial customer photos.
- **Where to use**: [`Testimonials.tsx`](../frontend/components/landing/Testimonials.tsx) - Avatar for second testimonial (Adaeze Okafor).
- **Alt text**: "Photo of Adaeze Okafor"
- **Dimensions**: 200x200px
- **Format**: SVG (placeholder - replace with actual customer photo)

### `testimonial-3.svg`
- **Description**: Placeholder avatar with blue background and orange accent, for testimonial customer photos.
- **Where to use**: [`Testimonials.tsx`](../frontend/components/landing/Testimonials.tsx) - Avatar for third testimonial (Emmanuel Mensah).
- **Alt text**: "Photo of Emmanuel Mensah"
- **Dimensions**: 200x200px
- **Format**: SVG (placeholder - replace with actual customer photo)

---

## Trust Badges (4 badges)

### `trust-licensed.svg`
- **Description**: Star-shaped badge indicating licensed and insured status.
- **Where to use**: [`TrustBadges.tsx`](../frontend/components/landing/TrustBadges.tsx) - Trust badge for "Licensed & Insured".
- **Alt text**: "Licensed and insured badge"
- **Dimensions**: 64x64px
- **Format**: SVG

### `trust-rated.svg`
- **Description**: Star rating badge for 5-star customer ratings.
- **Where to use**: [`TrustBadges.tsx`](../frontend/components/landing/TrustBadges.tsx) - Trust badge for "5-Star Rated".
- **Alt text**: "5-star rated badge"
- **Dimensions**: 64x64px
- **Format**: SVG

### `trust-experience.svg`
- **Description**: Calendar/time badge indicating years of experience.
- **Where to use**: [`TrustBadges.tsx`](../frontend/components/landing/TrustBadges.tsx) - Trust badge for "20+ Years Experience".
- **Alt text**: "20+ years experience badge"
- **Dimensions**: 64x64px
- **Format**: SVG

### `trust-fast.svg`
- **Description**: Checkmark/arrow badge indicating fast response times.
- **Where to use**: [`TrustBadges.tsx`](../frontend/components/landing/TrustBadges.tsx) - Trust badge for "Fast Response".
- **Alt text**: "Fast response badge"
- **Dimensions**: 64x64px
- **Format**: SVG

---

## Usage Instructions

### Replacing Placeholder Images

For the testimonial avatars, replace the SVG placeholders with actual customer photos:
1. Use professional headshots (200x200px recommended)
2. Ensure consistent lighting and composition
3. Use consistent aspect ratios across all avatars

### Image Optimization

For production deployment:
- Convert SVG hero to optimized PNG/JPG for faster loading
- Use WebP format for better compression
- Implement lazy loading for below-the-fold images

### CSS Usage Example

```css
.hero-section {
  background-image: url('/images/hero.svg');
  background-size: cover;
  background-position: center;
}

.feature-icon {
  background-image: url('/images/feature-quotes.svg');
  width: 64px;
  height: 64px;
}

.testimonial-avatar {
  background-image: url('/images/testimonial-1.svg');
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
```

---

## Notes

- All images follow the Deep Blue (#1E3A8A) and Orange (#F97316) color scheme
- SVG format provides scalability without quality loss
- Icons use consistent 64x64px dimensions for uniform appearance
- Trust badges reinforce credibility and customer confidence
- Pattern tile can be used as CSS background for section containers
