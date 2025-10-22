# Filter Bar Visual Reference Guide

## Mode 1: Normal (Initial View)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎛️ Filter Dashboard                        (2 filters active)   │
│                                    [🔄 Clear All] [More Filters▼]│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Year in School ▼]  [Enrollment ▼]  [Age Range ▼]  [Gender ▼]  │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ─── Secondary Filters (when expanded) ───                        │
│                                                                   │
│  [Race/Ethnicity ▼]  [International ▼]  [Employment ▼]          │
│  [Caregiving ▼]      [Greek Life ▼]     [Study Mode ▼]          │
│  [Transfer ▼]                                                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Active Filters:                                                  │
│  [YEAR: Freshman ×]  [STATUS: Full-time ×]                      │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Full padding (p-6)
- Rounded corners (rounded-xl)
- Shadow and border
- Active filters displayed at bottom
- All dropdowns functional
- "More Filters" expands/collapses secondary section

---

## Mode 2: Sticky Collapsed (Scrolling Down)

### Desktop View:
```
╔═══════════════════════════════════════════════════════════════╗
║ ▼ [Year: Freshman] [Status: Full-time] [Age: 18-24] +2 more  ║
║                                                [🔄 Clear All]  ║
╚═══════════════════════════════════════════════════════════════╝
─────────────────────────────────────────────────────────────────
Dashboard Content Below (scrolling underneath)
```

**When NO filters active:**
```
╔═══════════════════════════════════════════════════════════════╗
║ ▼ No filters applied                           [🔄 Clear All] ║
╚═══════════════════════════════════════════════════════════════╝
```

### Tablet View (768px-1024px):
```
╔═══════════════════════════════════════════════════════════╗
║ ▼ [Year: Freshman] [Status: Full-time] +3 more [Clear]  ║
╚═══════════════════════════════════════════════════════════╝
```

### Mobile View (<768px):
```
╔═══════════════════════════════════════════╗
║ ▼ [3 Filters Active - Tap to view] [🔄]  ║
╚═══════════════════════════════════════════╝
```

**Characteristics:**
- Compact height (~56-60px)
- Positioned: `position: sticky; top: 0; z-index: 40`
- Shadow for depth
- Chevron down (▼) to expand
- Only shows active filter badges
- Smart badge truncation with "+X more"
- Mobile shows count instead of badges

---

## Mode 3: Sticky Expanded (Manual Toggle)

```
╔═══════════════════════════════════════════════════════════════╗
║ ▲ 🎛️ Filter Dashboard                   (2 filters active)    ║
║                                   [🔄 Clear All] [More Filters]║
╠═══════════════════════════════════════════════════════════════╣
║                                                                 ║
║  [Year in School ▼]  [Enrollment ▼]  [Age Range ▼]  [Gender ▼]║
║                                                                 ║
╠═══════════════════════════════════════════════════════════════╣
║ ─── Secondary Filters (when "More Filters" clicked) ───        ║
║                                                                 ║
║  [Race/Ethnicity ▼]  [International ▼]  [Employment ▼]        ║
║  [Caregiving ▼]      [Greek Life ▼]     [Study Mode ▼]        ║
║  [Transfer ▼]                                                  ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
─────────────────────────────────────────────────────────────────
Dashboard Content Below (scrolling underneath)
```

**Characteristics:**
- Full filter functionality (same as normal mode)
- Positioned: `position: sticky; top: 0; z-index: 40`
- Max height: `max-h-[80vh]` with scroll if needed
- Chevron up (▲) to collapse
- All dropdowns functional
- Shadow and border styling
- Same padding as normal mode

---

## Transition Flow

### User Scrolls Down:
```
Normal Mode
    │
    │ (Scroll past filter bar)
    │ (Intersection Observer triggers)
    ↓
Sticky Collapsed Mode
    │
    │ (User clicks chevron ▼)
    ↓
Sticky Expanded Mode
    │
    │ (User clicks chevron ▲)
    ↓
Sticky Collapsed Mode
```

### User Scrolls Back Up:
```
Sticky Mode (Collapsed or Expanded)
    │
    │ (Scroll back to top)
    │ (Sentinel becomes visible)
    ↓
Normal Mode
    │
    │ (manuallyExpanded reset to false)
```

---

## Filter Badge Anatomy

### Single Selection:
```
┌─────────────────────┐
│ YEAR: Freshman    × │
└─────────────────────┘
```

### Multiple Selections (2-3 items):
```
┌─────────────────────────┐
│ GENDER: Female +2     × │
└─────────────────────────┘
```

### Multiple Selections (4+ items):
```
┌─────────────────────┐
│ RACE: 5 selected  × │
└─────────────────────┘
```

### Long Value Truncation:
```
┌─────────────────────────────────┐
│ TRANSFER: No, I started a...  × │
└─────────────────────────────────┘
```

**Badge Styling:**
- Background: `bg-sage/10` (light sage)
- Border: `border-sage/20`
- Text: `text-sage`
- Hover: `hover:bg-sage/15`
- Remove button: `hover:text-danger`
- Rounded: `rounded-full`
- Padding: `px-3 py-1.5`

---

## Interaction States

### Chevron Button States:

**Collapsed (can expand):**
```
[ ▼ ] ← Click to expand
```

**Expanded (can collapse):**
```
[ ▲ ] ← Click to collapse
```

### Badge Click Behavior:

**In Collapsed Mode:**
```
[Year: Freshman ×] ← Click anywhere
         ↓
    Expands sticky bar
```

**Remove Button:**
```
[Year: Freshman ×] ← Click × only
         ↓
    Removes that filter
```

---

## Responsive Breakpoint Behavior

### Desktop (1024px+):
- 4-column grid for primary filters
- 3-column grid for secondary filters
- Shows up to 3-4 filter badges in collapsed mode
- Full "Clear All" text visible

### Tablet (768px-1024px):
- 2-column grid for primary filters
- 2-column grid for secondary filters  
- Shows up to 2 filter badges in collapsed mode
- Full "Clear All" text visible

### Mobile (<768px):
- 1-column grid (vertical stack)
- Shows filter count only in collapsed mode
- "Clear All" icon only (no text)
- Larger touch targets

---

## Color Scheme

```css
/* Active filters */
bg-sage/10      /* Light sage background */
text-sage       /* Sage text */
border-sage/20  /* Subtle sage border */

/* Hover states */
hover:bg-sage/15       /* Slightly darker on hover */
hover:text-sage-dark   /* Darker text on hover */
hover:text-danger      /* Red for remove actions */

/* Normal elements */
bg-white               /* White background */
text-warm-gray         /* Warm gray text */
border-warm-gray/20    /* Subtle gray borders */

/* Shadows */
shadow-sm              /* Normal mode subtle shadow */
shadow-md              /* Sticky mode medium shadow */
```

---

## Animation Timing

All transitions use:
```css
transition-all duration-300 ease-in-out
```

**What animates:**
- Height changes (expanding/collapsing)
- Shadow intensity (normal ↔ sticky)
- Background colors (hover states)
- Border colors (focus states)
- Opacity (appearing/disappearing elements)

**Duration:** 300ms (0.3 seconds)
**Easing:** ease-in-out (smooth start and end)

---

## Z-Index Layering

```
┌─────────────────────────────────┐  z-index: 50
│   Filter Dropdown Menus         │  (When open)
└─────────────────────────────────┘

┌─────────────────────────────────┐  z-index: 40
│   Sticky Filter Bar             │  (When sticky)
└─────────────────────────────────┘

┌─────────────────────────────────┐  z-index: auto
│   Dashboard Header              │  (Can be made sticky)
└─────────────────────────────────┘

┌─────────────────────────────────┐  z-index: auto
│   Dashboard Content             │  (Scrolls normally)
└─────────────────────────────────┘
```

**If header needs to be sticky:**
```typescript
// DashboardHeader.tsx
className="sticky top-0 z-50" // Above filter bar

// DashboardFilters.tsx - sticky modes
className="sticky top-16 z-40" // Below header (16 = 4rem = 64px header height)
```

---

## Edge Cases Handled

### No Active Filters:
```
╔═══════════════════════════════════════╗
║ ▼ No filters applied      [🔄]       ║
╚═══════════════════════════════════════╝
```

### All Filters Active (11 filters):
```
╔═════════════════════════════════════════════════════╗
║ ▼ [Year: Freshman] [Status: Full-time] [Age: 18... ║
║    +8 more                              [🔄 Clear]  ║
╚═════════════════════════════════════════════════════╝
```

### Very Long Filter Value:
```
┌──────────────────────────────────────────────┐
│ TRANSFER: No, I started at this univers... × │
└──────────────────────────────────────────────┘
(Truncates at ~15 characters)
```

### Rapid Filter Changes:
- All state updates are batched
- React handles re-renders efficiently
- No animation jank or flashing

---

## Accessibility Visual Indicators

### Keyboard Focus (Tab Navigation):
```
┌─────────────────────────┐
│ ╔═══════════════════╗   │  ← Blue focus ring
│ ║ Year: Freshman  × ║   │     (focus:ring-2 focus:ring-sage/50)
│ ╚═══════════════════╝   │
└─────────────────────────┘
```

### Screen Reader Announcements:
- "Expand filters" / "Collapse filters"
- "Remove [filter name] filter"
- "Clear all filters"
- "Filter controls region"
- "[X] filters active"

### ARIA Live Regions (Future Enhancement):
```html
<div aria-live="polite" aria-atomic="true">
  2 filters active: Year in School - Freshman, Enrollment Status - Full-time
</div>
```

---

## Quick Reference: CSS Classes by Mode

### Normal Mode:
```css
bg-white
rounded-xl
shadow-sm
border border-warm-gray/20
p-6
mb-8
transition-all duration-300 ease-in-out
```

### Sticky Collapsed:
```css
sticky top-0 z-40
bg-white
border-b border-warm-gray/20
shadow-md
transition-all duration-300 ease-in-out
py-3 px-4 sm:px-6 lg:px-8
```

### Sticky Expanded:
```css
sticky top-0 z-40
bg-white
border-b border-warm-gray/20
shadow-md
transition-all duration-300 ease-in-out
max-h-[80vh] overflow-y-auto
py-4 px-4 sm:px-6 lg:px-8
```

---

This visual guide should help you understand exactly how each mode looks and behaves!

