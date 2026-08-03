# BGCA Sandbox — Consolidated Brief

**Client:** Boys & Girls Clubs of America — Northern Indiana Corridor (Dwayne, Alliance CEO)
**Sources:** Charlie/Nicole call, 2026-07-31 ([recording](https://fathom.video/share/9yt6XUXgxLyHZeTEqNByDXUua9GWBzii), 48 min) + Nicole's "Developer Brief: Interplay Executive Dashboard & Youth Kiosk"
**Compiled:** 2026-08-03
**Status:** Built. Sandbox lives at `/bgca` (`src/modules/bgca/`). Updated 2026-08-03 after review.

---

## 1. The problem we are solving

BGCA already runs the **NYOI survey** and pulse checks. Feedback comes back and **nothing happens with it**. That is the entire product thesis.

Two things follow from that, and they should drive every design decision:

1. **They already know the solution.** Staff are trained in the practices. The gap is not knowledge — it is that nothing converts a signal into a completed action. Nicole's framing: *"when they have a problem, they already have the solution. It's just that they're not doing it."*
2. **This is an accountability system, not an analytics product.** The IT help-desk metaphor is the spine: a ticket is **open until resolved**, and if it can't be resolved, the **barrier** must be visible and escalatable.

Nicole's test for whether it works: *"let's say there's an issue that comes up in the fall — by January, it should not pop up again."*

---

## 2. Scope decisions made on the call

These were settled live and should not be relitigated on Monday:

| Decision | Detail |
|---|---|
| **Build a separate sandbox** | Do **not** touch the existing Interplay survey or dashboard. Charlie: *"I don't think you touch Interplay at all… we don't even touch Dashboard."* |
| **Route** | `interplay.quixilabs.com/bgca`, with sub-pages for survey / pulse / dashboard |
| **Purpose** | Let Dwayne *see what the experience looks like* — for the person answering, for the CEO, and the impact. It is closer to an interactive marketing/demo page than a production app. |
| **Three "things" collapse to two surfaces** | Nicole originally listed 3 items (exec dashboard, pulse kiosk, action engine). On the call they agreed **the action/unblocking engine is part of the dashboard**, not a third thing. Nicole's brief already reflects this as Section 3. |
| **4-point scale, not 10** | For ages 9–12. Charlie/Dwayne raised it; Nicole confirmed from her own experience that a 10-point scale collapses to everyone answering 7. |
| **Pulse lives on a kiosk tablet in the club**, feeds the dashboard | Separate surface, shared data |
| **Design polish deferred** | Charlie: *"I don't think we need to worry about the design or anything now."* But it must be **visual, not text-based** — Nicole's ASCII mock is a layout spec, not a target aesthetic. |
| **Not being presented to Dwayne as-is** | Confirmed on the call. The sandbox is the deliverable, not the mock. |

---

## 3. Terminology (BGCA-aligned — use these exact labels in UI)

| Use this | Not this |
|---|---|
| **Play Cards** | Action Tickets |
| **The Reset Playbook** | Interventions |
| **Friction Points** | Flagged Problems |
| **Blocked Play** / **Execution Bottleneck** | Barrier |
| **Executive Unblocker** | CEO action button |
| **Regional Momentum Index** | Growth Index score |
| **Pulse Cadence** | Survey wave |

Nicole was explicitly playing off the name *Inter**play*** — the card/play language is deliberate, not decorative.

**Product philosophy constraints:** plug-and-play, **team-focused with no staff blame**, operational unblocking, closed-loop accountability.

---

## 4. Surface A — Youth Pulse Kiosk (ages 9–12)

**Hard rule:** questions assess **room climate and adult presence as a collective**. Kids **never** name or rate individual staff members. This is non-negotiable for BGCA.

- 6 prompts per pulse (`PROMPT 1 of 6`)
- 4-point scale with kid-legible labels:
  `4 ALWAYS / Very True` · `3 MOST OF TIME / On Track` · `2 SOMETIMES / Friction` · `1 NOT REALLY / Never–Low`
- **Dynamic branching on the rating:**
  - **3 or 4 → Enabler branch:** *"What made your time here feel great this week?"* (select up to 2) — grown-ups step in quickly · calm and organized room · clear and fair rules · friends have my back
  - **1 or 2 → Friction branch:** *"What got in the way this week?"* (select up to 2) — too loud or chaotic · unclear or unfair rules · peer drama/bullying · grown-ups felt too busy/loud
  - Friction branch also asks **where**: Gym/Transitions · Games Room · Tech Lab · Teen Room · Bathrooms
- Submit **auto-links friction point + room location → Reset Playbook**

Worked example throughout the spec: Goshen Club, "I feel safe, calm, and respected when I'm at the Club."

---

## 5. Surface B — Executive Dashboard (single screen, three stacked sections)

Header: `REGION: Northern Indiana Corridor | PULSE CADENCE: [Fall 2026 Baseline] Mid-Year Spring`

**Section 1 — Regional health, three KPI cards**
- Regional Momentum Index — `3.2 / 4.0`, 🟢 82% Positive
- Action Closure Rate — `88%`, 🟢 37/42 Resolved
- Sites Needing Attention — `1 of 6 Sites`, 🔴 Goshen Club (Ages 9–12)

**Section 2 — Site status list** (6 sites, click-to-filter)
Mishawaka 🟢 3.6 · Elkhart 🟢 3.5 · South Bend Central 🟡 3.0 (Watch List) · **Goshen 🔴 2.8 (Action Needed)** · Plymouth Extension 🟢 3.2 · Warsaw 🟢 3.4
Bands: 🟢 Flourishing · 🟡 Watch List · 🔴 Action Needed

**Section 3 — Action & Unblocking Engine** (driven by Section 2 selection)
Four stacked blocks:
1. 📍 **Flagged Youth Friction** — domain + score + verbatim youth feedback
2. ⚡ **Assigned Reset Play** — e.g. *Play #104: 2-Minute Transition Reset Protocol (YPQI / De-escalation)*, plus a target action
3. 🚧 **What is holding staff back?** — selected barrier + free-text staff note
4. 🛠️ **Executive Unblocker Needed** — recommended CEO lever + status badge + the action button (`Approve Temporary Floater Stipend`) that flips 🟡 BLOCKED PLAY → 🟢 UNBLOCKED

**Interaction rules**
- Click-to-filter: Section 2 row selection updates Section 3
- **No heavy charting libraries** — typography, badge tags, simple progress/bullet bars
- **Auto-print:** 1-page PDF export of Section 3 titled **"Weekly CQI Huddle Agenda"** for Unit Directors

---

## 6. Play Card state machine (the closed loop)

| # | State | Trigger |
|---|---|---|
| 1 | **Flagged** | Domain score drops below 3.0 / 4.0. System auto-attaches a pre-trained Reset Play. |
| 2 | **Blocked** *(optional)* | Unit Director logs a barrier → fires Executive Unblocker Alert to CEO |
| 3 | **Unblocked / Assigned** | CEO clicks the unblocker lever |
| 4 | **Executed** | Unit Director flags the protocol ran for 5 days. **Ticket stays OPEN.** |
| 5 | **Verified / Closed** | Next pulse confirms score recovered above 3.0 |

**The load-bearing rule: only youth feedback can close a ticket.** Staff self-reporting "we did it" moves the card to Executed, never to Closed. This is what makes it an accountability system rather than a task list, and it is the single most important thing to get right in the demo.

---

## 7. Cadence and pilot timing

- **Pulse cadence:** Fall → Mid-Year → Spring, aligned to the school year. Dwayne's ask.
- **Pilot:** Fall 2026 ("Fall 2026 Baseline" is the first wave)
- **Region naming — DECIDED 2026-08-03:** **"Northern Indiana Corridor"**. Nicole's original mock said "Northern Indiana Alliance"; on the call she noted Dwayne's own term was "Corridor Indiana". Charlie settled it on the combined form, and the sandbox uses it (`REGION_NAME` in `src/modules/bgca/data/mockData.ts`). "Alliance CEO" remains Dwayne's job title.
- Schools in the area open **~Aug 10**, which is one week out.

---

## 8. What Interplay already has that maps to this

This is the strongest argument for doing it inside the existing codebase rather than greenfield:

| BGCA need | Already exists |
|---|---|
| Enabler / barrier branching after a score | `SchoolWellbeingSection.tsx` v2 — 15 barrier statements mapped to 5 drivers; `EnablersBarriersBreakdown.tsx`, `SupportDriverTiles.tsx`, `src/types/supportDrivers.ts` |
| Score → criticality band → top enabler/barrier → suggested action | `src/types/actionPathway.ts` — already has `CriticalityLevel` (Informational/Watch/Priority/Critical) and `DomainActionData` with `topEnabler`/`topBarrier`. This is ~70% of a Play Card already. |
| Multi-tenant: region → sites | `universities` table + `src/modules/superadmin/` (UniversityList, UniversityForm, universityService) — clubs/sites map onto universities |
| Executive roll-up across orgs | `SuperAdminDashboard.tsx` |
| Anonymous session-based responses | `survey_sessions`, RLS policies — already exactly the privacy model BGCA needs |
| Multi-step branching survey flow | `SurveyFlow.tsx`, `ProgressBar.tsx`, `src/contexts/SurveyContext.tsx` |
| Demo mode with fake data | `VITE_USE_MOCK_DATA` toggle + `src/data/mockData.ts` (see `docs/MOCK_DATA_TOGGLE.md`) — **this is the fastest path to a convincing sandbox** |
| Domain labels already de-jargoned | `DOMAIN_CONFIG` — "Joy & Energy", "Belonging & Support", "Growth & Responsibility", "Health & Balance", "Direction & Purpose", "Stability & Security". These are the same names as the recent copy commits on `bgca`. |

**Genuinely new work:** the 4-point kid scale (existing is 0–10), the kiosk UI, the Play Card state machine + persistence, the Reset Playbook library, the Executive Unblocker action, and the CQI Huddle PDF export.

---

## 9. Open questions

**Resolved 2026-08-03, and built:**

1. ~~Mock data or live Supabase?~~ → **Mock data for everything.** No Supabase anywhere in `src/modules/bgca/`. State is in-memory (zustand), so the loop genuinely closes but nothing persists.
2. ~~Does the sandbox include a survey page?~~ → **Yes**, a single sample question at `/bgca/survey`, in addition to pulse + dashboard.
3. ~~Who logs the barrier — is a third surface needed?~~ → **Built one**: `/bgca/director`, also mock. It logs bottlenecks and confirms execution, and deliberately has no path to closing a card.
4. ~~Region label~~ → **Northern Indiana Corridor** (see §7).
5. ~~Other 5 pulse prompts~~ → **Not needed for the sandbox.** The one written prompt is enough to show the pattern. Still required for the real build.

**Still open — ask Dwayne:**

6. **Reset Playbook contents.** The five plays in the sandbox (#104, #112, #118, #127, #131) are **invented but plausible**, mapped to real frameworks (YPQI, restorative practice). Does BGCA have an actual numbered library to swap in?
7. **The other 5 pulse prompts**, for the real build. `DOMAIN_CONFIG` already has 6 domains — they may map 1:1.
8. **Age bands beyond 9–12.** Everything is scoped to 9–12 "for now," yet Teen Room is a location option.
9. **Cadence survey length.** The sandbox shows "Question 4 of 18" as a plausible placeholder. Real instrument length is unknown.
10. **Charting.** Sandbox uses no charting library per Nicole's rule — badges and CSS bars only. Confirm that holds as the dashboard grows.

---

## 10. Immediate next step

**Meeting with Nicole: today, Monday 2026-08-03, 3:30–5:30 PM**, at a library conference room (they moved off the coffee shop). Charlie's stated plan on the call was to take a first pass at formulating everything and figuring out the state of the codebase before that meeting — this document is that pass.
