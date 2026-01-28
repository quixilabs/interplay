# Interplay Brand Guidelines

## Color Palette

### Primary Colors
- **Deep Navy** (`#1e3a5f`) - Primary brand color
  - Conveys trust, stability, and academic authority
  - Use for headers, navigation, and key CTAs
  - Tailwind: `text-navy`, `bg-navy`

- **Sage Green** (`#6b8e7a`) - Secondary accent
  - Represents growth, wellness, and positive outcomes
  - Use for success states, positive metrics, and highlights
  - Tailwind: `text-sage`, `bg-sage`

### Supporting Colors
- **Warm Gray** (`#5a6c7d`) - Text and UI elements
  - Tailwind: `text-warm-gray`, `bg-warm-gray`
- **Light Gray** (`#f7f9fb`) - Backgrounds and subtle dividers
  - Tailwind: `text-light-gray`, `bg-light-gray`
- **White** (`#ffffff`) - Primary background, cards, clean space

### Data Visualization Palette
- **Flourishing Green** (`#27ae60`) - High performance, positive metrics
  - Tailwind: `text-success`, `bg-success`
- **Warning Amber** (`#f39c12`) - Attention needed, moderate risk
  - Tailwind: `text-warning`, `bg-warning`
- **Alert Coral** (`#e67e22`) - Critical issues, immediate action needed
  - Tailwind: `text-danger`, `bg-danger`
- **Neutral Blue** (`#3498db`) - Standard data, comparisons, trends
  - Tailwind: `text-info`, `bg-info`

## Typography

### Primary Typeface: Inter
- **Usage**: Headers, body text, data labels, buttons
- **Reasoning**: Designed specifically for UI/UX, highly legible at all sizes
- **Tailwind**: `font-primary`

### Secondary Typeface: Source Serif Pro
- **Usage**: Key insights, quotes, executive summaries
- **Reasoning**: Humanist serif adds warmth and academic credibility
- **Tailwind**: `font-secondary`

### Font Scale
- **h1**: 2.5rem (40px) - Inter Semibold - `text-h1`
- **h2**: 2rem (32px) - Inter Medium - `text-h2`
- **h3**: 1.5rem (24px) - Inter Medium - `text-h3`
- **h4**: 1.25rem (20px) - Inter Medium - `text-h4`
- **Body**: 1rem (16px) - Inter Regular - `text-body`
- **Small**: 0.875rem (14px) - Inter Regular - `text-small`

## Components

### Buttons
```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-navy);
  color: var(--color-white);
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-primary);
}

/* Secondary Button */
.btn-secondary {
  border: 2px solid var(--color-sage);
  color: var(--color-navy);
  background: transparent;
  border-radius: 6px;
  font-weight: 600;
}

/* Subtle Button */
.btn-subtle {
  background-color: var(--color-light-gray);
  color: var(--color-warm-gray);
  border-radius: 6px;
  font-weight: 500;
}
```

### Cards
```css
.card {
  background: var(--color-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid #e5e7eb;
}
```

### Accent Bars
- Success: `accent-success` - Left border in success green
- Warning: `accent-warning` - Left border in warning amber
- Danger: `accent-danger` - Left border in alert coral
- Sage: `accent-sage` - Left border in sage green

## CSS Custom Properties

```css
:root {
  /* Primary Colors */
  --color-navy: #1e3a5f;
  --color-sage: #6b8e7a;
  
  /* Supporting Colors */
  --color-warm-gray: #5a6c7d;
  --color-light-gray: #f7f9fb;
  --color-white: #ffffff;
  
  /* Data Visualization Palette */
  --color-success: #27ae60;
  --color-warning: #f39c12;
  --color-danger: #e67e22;
  --color-info: #3498db;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Source Serif Pro', Georgia, serif;
  
  /* Design System */
  --radius: 8px;
  --shadow: 0 2px 8px rgba(30, 58, 95, 0.08);
  --spacing: 8px;
}
```

## Tailwind Extensions

```js
// tailwind.config.js
colors: {
  navy: '#1e3a5f',
  sage: '#6b8e7a',
  'warm-gray': '#5a6c7d',
  'light-gray': '#f7f9fb',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e67e22',
  info: '#3498db',
}
```

## Usage Guidelines

### Do's
- Use navy for primary headings and important CTAs
- Use sage for positive indicators and growth metrics
- Maintain consistent spacing using 8px base unit
- Use Inter for all UI elements
- Use Source Serif Pro sparingly for emphasis

### Don'ts
- Don't use colors outside the defined palette
- Don't mix font families arbitrarily
- Don't use colors for meaning without considering accessibility
- Don't deviate from the established font scale

## Accessibility

- All text colors meet WCAG AA contrast requirements
- Focus states use sage green with sufficient contrast
- Error states use the danger color with clear visual indicators
- Form labels are clearly associated with inputs

## Brand Voice

- **Professional**: Clean, organized, data-driven
- **Trustworthy**: Consistent, reliable, transparent
- **Approachable**: Warm colors, clear language, helpful guidance
- **Expert**: Sophisticated typography, thoughtful data presentation
