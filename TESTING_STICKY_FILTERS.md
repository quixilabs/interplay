# Testing Guide: Sticky Collapsible Filter Bar

## Quick Start Testing

### 1. Launch the Application
```bash
npm run dev
```

### 2. Navigate to Dashboard
- Log in as an admin user
- Navigate to the Dashboard view
- You should see the filter bar below the header

---

## Test Scenarios

### Scenario 1: Basic Sticky Behavior
**Steps:**
1. Open the dashboard
2. Note the filter bar position (normal mode)
3. Scroll down past the filter bar
4. **Expected:** Filter bar becomes sticky at top and auto-collapses

**✅ Success Criteria:**
- Filter bar sticks to top of viewport
- Height reduces from ~120px to ~60px
- Smooth 300ms transition
- Shadow appears for depth

---

### Scenario 2: Active Filters Display
**Steps:**
1. In normal mode, select "First year/Freshman" from Year in School
2. Scroll down to trigger sticky mode
3. **Expected:** Badge shows "Year: First year/Freshman"
4. Click the "×" on the badge
5. **Expected:** Filter clears, badge disappears

**✅ Success Criteria:**
- Only selected filters appear in collapsed mode
- Badge shows short label format
- Remove button works in collapsed mode
- "No filters applied" shows when all cleared

---

### Scenario 3: Multiple Active Filters
**Steps:**
1. Select multiple filters:
   - Year in School: Freshman
   - Enrollment Status: Full-time
   - Age Range: 18-19, 20-21
   - Gender Identity: Woman, Man, Non-binary
2. Scroll down to sticky mode
3. **Expected:** See first 3 badges + "+X more"

**✅ Success Criteria:**
- Up to 3 badges visible on desktop
- Remaining count shown as "+X more"
- Badge text truncates if too long
- All badges are clickable

---

### Scenario 4: Badge Click to Expand
**Steps:**
1. Have 2-3 filters active
2. Scroll down to collapsed sticky mode
3. Click on any filter badge (not the ×)
4. **Expected:** Sticky bar expands to show all filters

**✅ Success Criteria:**
- Bar expands smoothly (300ms)
- All filter dropdowns become visible
- Chevron changes from ▼ to ▲
- Can interact with all filters

---

### Scenario 5: Manual Expand/Collapse
**Steps:**
1. Scroll down to sticky collapsed mode
2. Click the chevron (▼) button
3. **Expected:** Bar expands
4. Click chevron (▲) again
5. **Expected:** Bar collapses

**✅ Success Criteria:**
- Chevron toggles icon direction
- Expansion is smooth
- State persists while scrolling (stays expanded)
- Collapses when manually triggered

---

### Scenario 6: Scroll Back to Top
**Steps:**
1. In sticky mode (collapsed or expanded)
2. Scroll back to the top of the page
3. **Expected:** Returns to normal mode

**✅ Success Criteria:**
- Sticky positioning releases
- Returns to natural flow in document
- Border/shadow returns to normal
- Manual expansion resets

---

### Scenario 7: Mobile Responsiveness
**Steps:**
1. Resize browser to mobile width (<768px)
2. Select 2-3 filters
3. Scroll down to sticky mode
4. **Expected:** See "X Filters Active" instead of badges

**✅ Success Criteria:**
- Shows count badge on mobile
- "Tap to view" message visible
- Expands on tap
- Vertical filter layout when expanded
- "Clear All" shows icon only

---

### Scenario 8: Clear All Functionality
**Steps:**
1. Select multiple filters
2. In any mode, click "Clear All" button
3. **Expected:** All filters removed immediately

**✅ Success Criteria:**
- All selections cleared
- Badges disappear
- "No filters applied" shows in collapsed mode
- Dashboard data updates

---

### Scenario 9: Filter Count Display
**Steps:**
1. Select 1 filter
2. Note the count badge: "1 filter active"
3. Select 2 more filters
4. Note the count badge: "3 filters active"

**✅ Success Criteria:**
- Count updates in real-time
- Singular "filter" vs plural "filters"
- Count badge appears in both normal and sticky modes
- Badge styling consistent

---

### Scenario 10: Secondary Filters Expansion
**Steps:**
1. Click "More Filters" in normal mode
2. **Expected:** Secondary filters appear
3. Scroll down to sticky mode
4. Click chevron to expand
5. Click "More Filters" again
6. **Expected:** Secondary filters work in sticky mode too

**✅ Success Criteria:**
- Secondary filters toggle in all modes
- State persists across mode changes
- All filters functional in expanded sticky mode

---

### Scenario 11: Rapid Scrolling
**Steps:**
1. Quickly scroll up and down multiple times
2. Cross the threshold repeatedly

**✅ Success Criteria:**
- No flickering or jank
- Smooth mode transitions
- No console errors
- No layout shift

---

### Scenario 12: No Filters Active
**Steps:**
1. Ensure no filters are selected
2. Scroll down to sticky mode
3. **Expected:** Shows "No filters applied" message

**✅ Success Criteria:**
- Message appears in collapsed mode
- No empty filter badges
- "Clear All" button hidden
- Chevron still works for expansion

---

### Scenario 13: Keyboard Navigation
**Steps:**
1. Use Tab key to navigate through filter bar
2. Use Enter/Space to activate buttons
3. Navigate through filter badges

**✅ Success Criteria:**
- All interactive elements reachable via Tab
- Clear focus indicators (blue ring)
- Enter/Space activate buttons
- Can remove filters via keyboard
- No keyboard traps

---

### Scenario 14: Filter Dropdown Z-Index
**Steps:**
1. Scroll to sticky mode
2. Expand the sticky bar
3. Open any filter dropdown
4. **Expected:** Dropdown appears above everything

**✅ Success Criteria:**
- Dropdown menu appears on top (z-index: 50)
- Sticky bar is below dropdown (z-index: 40)
- No dropdown clipping
- Scrollable if too many options

---

### Scenario 15: Multiple Value Selection
**Steps:**
1. Select Race/Ethnicity filter
2. Choose 2 items (e.g., Asian, White)
3. Scroll to collapsed mode
4. **Expected:** Badge shows "Race: Asian +1"
5. Select 2 more items (4 total)
6. **Expected:** Badge shows "Race: 4 selected"

**✅ Success Criteria:**
- Single value: shows value name
- 2-3 values: shows first + count
- 4+ values: shows total count
- Badge updates immediately

---

### Scenario 16: Long Filter Values
**Steps:**
1. Select Transfer Student filter
2. Choose "No, I started at this university as a first-time freshman"
3. Scroll to collapsed mode

**✅ Success Criteria:**
- Long text truncates with "..."
- Badge doesn't overflow
- Full text visible on hover (tooltip if implemented)
- Remove button still accessible

---

### Scenario 17: Dashboard Content Updates
**Steps:**
1. Select a filter
2. Observe dashboard metrics update
3. In sticky collapsed mode, remove the filter
4. **Expected:** Dashboard updates immediately

**✅ Success Criteria:**
- Data filtering still works
- Charts/metrics update on filter change
- No delay between filter and data update
- Response count changes appropriately

---

### Scenario 18: Window Resize
**Steps:**
1. Start at desktop size
2. Have filters active and in sticky mode
3. Resize to tablet, then mobile
4. **Expected:** Badge display adapts to screen size

**✅ Success Criteria:**
- Desktop: 3-4 badges
- Tablet: 2 badges
- Mobile: Count only
- Smooth transition between breakpoints
- No layout breaking

---

### Scenario 19: Browser Back/Forward
**Steps:**
1. Select filters
2. Navigate away from dashboard
3. Use browser back button
4. **Expected:** Returns to dashboard

**✅ Success Criteria:**
- Page loads correctly
- Filters reset to default (unless URL persistence added)
- No JavaScript errors
- Sticky behavior works immediately

---

### Scenario 20: Performance with Many Filters
**Steps:**
1. Select 10+ filter values across different categories
2. Scroll up and down multiple times
3. Expand/collapse repeatedly

**✅ Success Criteria:**
- No lag or stuttering
- Smooth 60fps animations
- No memory leaks
- Browser doesn't slow down

---

## Browser Testing Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ | Primary target |
| Firefox | Latest | ✅ | Test Intersection Observer |
| Safari | 12.1+ | ✅ | iOS compatibility |
| Edge | Latest | ✅ | Chromium-based |
| Safari iOS | 12.1+ | ⚠️ | Test touch interactions |
| Chrome Mobile | Latest | ✅ | Test mobile UI |

---

## Accessibility Testing

### Screen Reader Testing
**Tools:** NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

**Test Points:**
1. Filter bar region announcement
2. "Expand/Collapse filters" button labels
3. Filter badge removal announcements
4. "Clear all filters" confirmation
5. Active filter count announcements

### Keyboard Only Testing
**Disable mouse and use only keyboard:**
1. Tab through all filter controls
2. Open/close filter dropdowns
3. Select/deselect filter options
4. Remove individual filter badges
5. Clear all filters
6. Expand/collapse sticky bar

### Color Contrast Testing
**Tool:** Chrome DevTools Accessibility Panel

**Check:**
- Filter badge text contrast (sage on light sage)
- Button text contrast
- Hover states readable
- Focus indicators visible
- WCAG AA compliance (4.5:1 minimum)

---

## Performance Benchmarks

### Lighthouse Metrics (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+

### Specific Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Largest Contentful Paint: < 2.5s

### Intersection Observer Performance
```javascript
// Monitor in DevTools Performance tab
// Should see no "Forced reflow" warnings
// Intersection Observer entries should be minimal CPU
```

---

## Common Issues & Solutions

### Issue: Filter bar doesn't stick
**Solution:** Check if header has higher z-index, adjust filter bar z-index

### Issue: Badges overflow on small screens
**Solution:** Already handled with `+X more`, verify maxDisplay prop

### Issue: Dropdown hidden behind content
**Solution:** Increase dropdown z-index to 50 (already implemented)

### Issue: Slow scrolling performance
**Solution:** Intersection Observer handles this, check for conflicting scroll listeners

### Issue: Filter state not updating
**Solution:** Verify onFiltersChange callback in Dashboard.tsx

---

## Debug Mode

Add this to console to check current state:
```javascript
// In browser console while on dashboard
window.__FILTER_DEBUG__ = true;

// Then check:
// 1. Current mode
// 2. Active filters
// 3. Sentinel position
// 4. Observer entries
```

---

## Automated Testing (Future)

### Unit Tests (Jest + React Testing Library)
```typescript
describe('DashboardFilters', () => {
  test('shows active filters in collapsed mode', () => {});
  test('expands when chevron clicked', () => {});
  test('removes filter when badge X clicked', () => {});
  test('clears all filters when Clear All clicked', () => {});
});
```

### Integration Tests (Cypress/Playwright)
```typescript
describe('Sticky Filter Bar', () => {
  it('becomes sticky when scrolling down', () => {});
  it('shows only active filters in collapsed state', () => {});
  it('returns to normal when scrolling back up', () => {});
});
```

---

## Sign-Off Checklist

Before considering the feature complete:

- [ ] All 20 test scenarios pass
- [ ] Desktop, tablet, mobile all work correctly
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announces properly
- [ ] No console errors or warnings
- [ ] Performance benchmarks met
- [ ] All browsers tested
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Stakeholder demo successful

---

**Expected Testing Time:** 2-3 hours for thorough manual testing
**Critical Path:** Scenarios 1, 2, 3, 6, 7 (covers 80% of functionality)
**Edge Cases:** Scenarios 12, 15, 16, 20 (covers unusual situations)

