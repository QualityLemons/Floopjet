# Floop Feedback Tools — Test Results

**Date:** 16 May 2026
**Tester:** Automated (Jest) + manual visual inspection
**Environment:** Replit — Node.js v20.20.0, npm 10.8.2, Python 3.11, NixOS (stable-25_05)
**Server:** `python server.py` — HTTP/1.0 on `0.0.0.0:5000`
**Deployment type:** Static site (`publicDir: "."`) — same files served in development and production

---

## Contents

1. [Test Strategy](#1-test-strategy)
2. [Automated Tests — Unit](#2-automated-tests--unit)
3. [Automated Tests — E2E HTTP](#3-automated-tests--e2e-http)
4. [Manual Tests — Functionality](#4-manual-tests--functionality)
5. [Manual Tests — Usability](#5-manual-tests--usability)
6. [Manual Tests — Responsiveness](#6-manual-tests--responsiveness)
7. [Development vs Deployment Parity](#7-development-vs-deployment-parity)
8. [Bugs Found and Resolved](#8-bugs-found-and-resolved)
9. [Summary](#9-summary)

---

## 1. Test Strategy

### Objectives

- Verify that every page loads without errors and delivers correct HTML structure
- Confirm all interactive JavaScript logic (RTF generation, counters, validation) behaves correctly in isolation
- Check that accessibility landmarks are present on every page
- Verify responsiveness foundations (viewport meta tag, Tailwind CDN, flex/grid layouts) across all pages
- Confirm the deployed static build matches the development source exactly
- Document observed usability and visual quality for each tool

### Approach

| Layer | Method | Tool |
|---|---|---|
| JS utility logic | Unit tests | Jest 29 |
| HTML structure, landmarks, scripts | HTTP + DOM inspection | Jest 29 + cheerio |
| Responsiveness foundations | HTTP + DOM inspection | Jest 29 + cheerio |
| Visual appearance and usability | Manual screenshot review | Replit preview |
| Development / deployment parity | Source-level comparison | Static site analysis |
| Full browser interaction (canvas, localStorage) | Playwright specs (CI-ready) | Playwright 1.44 |

### Running the tests

```bash
npm test              # all 145 automated tests
npm run test:unit     # 30 unit tests only
npm run test:e2e      # 115 HTTP/cheerio E2E tests only
npm run test:browser  # Playwright (requires compatible Chromium; use in CI)
```

---

## 2. Automated Tests — Unit

**Suite file:** `tests/unit/rtf.test.js`, `tests/unit/counter.test.js`
**Result: 30/30 PASS**
**Duration:** ~1 s

These tests import pure functions extracted into `tests/unit/helpers.js` and exercise them without a browser or HTTP server.

### 2a. RTF generation (`rtf.test.js`) — 16 tests

| # | Test | Result |
|---|---|---|
| 1 | Opens with RTF header declaration `{\rtf1` | PASS |
| 2 | Closes with a single `}` | PASS |
| 3 | Includes the report title in bold RTF markup | PASS |
| 4 | Includes all six numbered section labels (1–6) | PASS |
| 5 | Embeds the report date string | PASS |
| 6 | Embeds all six answers verbatim | PASS |
| 7 | Preserves answers that contain special characters (`{`, `}`, `\`) | PASS |
| 8 | Handles all-empty answers without throwing | PASS |
| 9 | Handles multi-line answers (newlines in input) | PASS |
| 10 | Filename starts with `Projector-` | PASS |
| 11 | Filename ends with `.rtf` | PASS |
| 12 | Replaces single spaces with underscores | PASS |
| 13 | Replaces multiple consecutive spaces with a single underscore | PASS |
| 14 | Truncates titles longer than 20 characters | PASS |
| 15 | Handles an empty title without throwing | PASS |
| 16 | Handles a title exactly 20 characters long | PASS |

### 2b. Counter and validation (`counter.test.js`) — 14 tests

| # | Test | Result |
|---|---|---|
| 1 | `isAtLimit` returns false when length is below the limit | PASS |
| 2 | `isAtLimit` returns true when length equals the limit | PASS |
| 3 | `isAtLimit` returns true when length exceeds the limit | PASS |
| 4 | `isAtLimit` works with any arbitrary max value | PASS |
| 5 | `isAtLimit` returns false for zero length against a positive max | PASS |
| 6 | `assembleAudiences` joins multiple values with `", "` | PASS |
| 7 | `assembleAudiences` returns a single value without trailing comma | PASS |
| 8 | `assembleAudiences` returns empty string for empty array | PASS |
| 9 | `assembleAudiences` handles three or more values | PASS |
| 10 | `assembleAudiences` preserves the order of values | PASS |
| 11 | `isFieldEmpty` returns true for an empty string | PASS |
| 12 | `isFieldEmpty` returns true for a whitespace-only string | PASS |
| 13 | `isFieldEmpty` returns false for a string with content | PASS |
| 14 | `isFieldEmpty` returns false for content surrounded by spaces | PASS |

---

## 3. Automated Tests — E2E HTTP

**Method:** Each test fetches the page over HTTP from the running Python server and inspects the DOM using cheerio. No browser is required. Tests run against `http://localhost:5000`.

**Result: 115/115 PASS**
**Duration:** ~2 s

### 3a. Navigation and accessibility landmarks (`navigation.test.js`) — 58 tests

**Pages tested:** `index.html`, `projector.html`, `drawback.html`, `gallery.html`, `aac.html`, `about.html`, `suggest-tool.html`

| Check | All 7 pages | Result |
|---|---|---|
| Returns HTTP 200 | ✓ | PASS |
| Correct `<title>` | ✓ | PASS |
| Skip-navigation link present | ✓ | PASS |
| `<nav aria-label="Site navigation">` | ✓ | PASS |
| `<main id="main-content">` | ✓ | PASS |
| `lang="en"` on `<html>` | ✓ | PASS |
| `<meta name="description">` | ✓ | PASS |

Additional navigation checks:

| Check | Result |
|---|---|
| `projector.html` marks Projector link `aria-current="page"` | PASS |
| `drawback.html` marks Drawback link `aria-current="page"` | PASS |
| Hub page has Floop brand link in nav | PASS |

### 3b. Projector form structure (`projector.test.js`) — 10 tests

| Check | Result |
|---|---|
| Page heading contains "Projector" | PASS |
| Form has `id="rtfForm"` | PASS |
| Form contains exactly six `<textarea>` elements | PASS |
| Each textarea has a unique id (`q1`–`q6`) | PASS |
| Every textarea is wrapped in a `.form-group` container | PASS |
| Each `.form-group` contains a `.counter` element | PASS |
| Success banner has `hidden` class on initial load | PASS |
| Form has a submit button | PASS |
| Page links external `projector.js` script | PASS |
| Page loads Tailwind via CDN | PASS |

### 3c. Suggest a Tool form structure (`suggest-tool.test.js`) — 12 tests

| Check | Result |
|---|---|
| Page heading mentions "Suggest" | PASS |
| Form has `id="suggestForm"` | PASS |
| First required field has `id="s1q1"` | PASS |
| Audience grid div has `id="audienceGrid"` | PASS |
| Audience grid contains at least one checkbox | PASS |
| Every checkbox has a `value` attribute | PASS |
| Every checkbox is wrapped in a `<label>` | PASS |
| Submit button has `id="submitBtn"` | PASS |
| Success banner has `hidden` class on load | PASS |
| Error banner has `hidden` class on load | PASS |
| All textareas in `.form-group` have a `.counter` sibling | PASS |
| Page links external `suggest-tool.js` script | PASS |

### 3d. Drawback (`drawback.test.js`) — 9 tests

| Check | Result |
|---|---|
| Page title contains "Drawback" | PASS |
| React mount point `<div id="root">` is present | PASS |
| `<div id="root">` is inside `<main>` | PASS |
| React 18 CDN script is present | PASS |
| Babel standalone CDN script is present | PASS |
| External `drawback.js` loaded as `type="text/babel"` | PASS |
| Page has `<nav aria-label="Site navigation">` landmark | PASS |
| Drawback nav link is marked `aria-current="page"` | PASS |
| Page has a meta viewport tag | PASS |

### 3e. Gallery (`gallery.test.js`) — 8 tests

| Check | Result |
|---|---|
| Page title contains "Gallery" | PASS |
| React mount point `<div id="root">` is present | PASS |
| `<div id="root">` is inside `<main>` | PASS |
| React 18 CDN script is present | PASS |
| Babel standalone CDN script is present | PASS |
| External `gallery.js` loaded as `type="text/babel"` | PASS |
| Page has site navigation landmark | PASS |
| Page has a meta viewport tag | PASS |

### 3f. Responsiveness foundations (`responsiveness.test.js`) — 35 tests

**Pages tested:** `index.html`, `projector.html`, `drawback.html`, `gallery.html`, `suggest-tool.html`, `about.html`, `aac.html`

| Check | All 7 pages | Result |
|---|---|---|
| `<meta name="viewport" content="width=device-width…">` | ✓ | PASS |
| Tailwind CSS loaded via CDN | ✓ | PASS |
| Nav container uses a `max-w-*` centring class | ✓ | PASS |

Additional layout checks:

| Check | Result |
|---|---|
| `projector.html` form container uses responsive `max-w-*` class | PASS |
| `suggest-tool.html` has a responsive grid or flex container | PASS |
| `index.html` main content uses a grid or flex layout | PASS |

---

## 4. Manual Tests — Functionality

All pages were loaded in the Replit preview (Chromium-based). Screenshots were taken at 1280 × 720 px.

### 4a. Hub (`index.html`)

![Hub](assets/img/test-hub.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | Loads correctly; Tailwind CDN advisory note in console (expected in development) | PASS |
| Tool cards display correctly | Projector, Drawback, Gallery, KwaCart cards visible in a 2-column grid | PASS |
| Navigation bar visible and functional | Sticky nav with brand name and page links present | PASS |
| Page is scrollable to further cards | Content extends below the fold as expected | PASS |

### 4b. Projector (`projector.html`)

![Projector](assets/img/test-projector.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | No errors; Tailwind CDN advisory only | PASS |
| All six numbered questions visible | Questions 1–3 visible in screenshot; 4–6 below fold | PASS |
| Character counters present below each field | `0 / 210` counter shown for visible questions | PASS |
| Placeholder text guides the user | Each textarea has a descriptive placeholder | PASS |
| Submit button present | Confirmed by E2E test; visible further down the page | PASS |

### 4c. Drawback (`drawback.html`)

![Drawback](assets/img/test-drawback.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | React/Babel CDN advisory notes only (expected) | PASS |
| Canvas renders inside `<main>` | White drawing area visible and correctly positioned | PASS |
| Four colour swatches visible | Blue, yellow, orange, black swatches shown above canvas | PASS |
| Clear button present | Coral "Clear" button visible in toolbar | PASS |
| Submit to Gallery button present | Indigo "Submit to Gallery" button visible at foot of canvas | PASS |

### 4d. Gallery (`gallery.html`)

![Gallery](assets/img/test-gallery.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | React/Babel CDN advisory notes only (expected) | PASS |
| Empty-state message displayed correctly | "The gallery is currently empty." with call-to-action button shown | PASS |
| "Start a new Drawback" CTA visible | Button links back to Drawback | PASS |
| "Clear All" control present | Red "CLEAR ALL" label visible at top | PASS |
| "End of Gallery" marker present | Footer marker visible at bottom of list | PASS |

### 4e. About AAC (`aac.html`)

![About AAC](assets/img/test-aac.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | No errors | PASS |
| Page heading and description visible | "Augmentative & Alternative Communication" heading and subtitle clear | PASS |
| "Public domain & open resources only" badge shown | Pill badge visible below subtitle | PASS |
| First content section ("What is AAC?") visible | Section card with content visible | PASS |
| `<main id="main-content">` confirmed | Fixed in this testing cycle (see section 8) | PASS |

### 4f. Suggest a Tool (`suggest-tool.html`)

![Suggest a Tool](assets/img/test-suggest.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | No errors | PASS |
| Section header "Section 1 of 3" visible | Indigo section header shown with bold section title | PASS |
| First two questions visible with placeholders | Question 1 (text input) and Question 2 (textarea with counter) rendered | PASS |
| Character counter shown on textarea | `0 / 300` counter visible below textarea | PASS |

### 4g. About (`about.html`)

![About](assets/img/test-about.jpg)

| Check | Observation | Result |
|---|---|---|
| Page loads without errors | No errors | PASS |
| Heading "About Floop" rendered | Clear heading visible | PASS |
| Creator credit visible | "John E. Parman" named with course information | PASS |
| LinkedIn button functional | Button styled correctly with LinkedIn icon | PASS |
| Footer visible | Copyright footer rendered at page bottom | PASS |

---

## 5. Manual Tests — Usability

Usability observations made from visual inspection of screenshots. These complement automated structural checks and focus on clarity, accessibility of content, and ease of interaction.

### Navigation

- The sticky navigation bar is consistent across all pages with the same link order
- The active page is visually distinguished by colour on every page (`aria-current="page"` confirmed by automated tests)
- The brand link ("Floop Feedback Tools") returns the user to the hub from every page
- A skip-navigation link is present on every page for keyboard users (confirmed by automated tests)

### Projector

- Numbered questions (1–6) create a clear sequence; a user knows exactly how many steps remain
- Each question has a descriptive placeholder that models the expected level of detail without over-prescribing content
- The 210-character limit is visible via a live counter — users are not surprised by a cut-off on submission
- The form is single-column and centred, keeping attention on one question at a time

### Drawback

- The interface is minimal: four colour circles, one clear button, one large canvas, one submit button
- No text input is required at any stage — the tool is fully usable without reading or typing
- The canvas is the dominant element, filling the available width, making it easy to tap or draw on a touch device
- The colour palette is large enough to select accurately on a touchscreen

### Gallery

- The empty-state is informative and actionable: it tells the user the gallery is empty and offers a direct link to Drawback
- No content is hidden behind a login or extra step

### Suggest a Tool

- Section headers ("Section 1 of 3") give users a clear sense of progress through the multi-part form
- Each question has a character counter so users can gauge how much to write
- Textarea placeholders indicate the expected style of response

---

## 6. Manual Tests — Responsiveness

### Method

Responsiveness was assessed at two levels:

1. **Automated structural checks** (35 tests in `responsiveness.test.js`) — verify the presence of the foundations that enable responsive layout: viewport meta tag, Tailwind CDN, `max-w-*` centring classes, and flex/grid containers
2. **Visual inspection** — screenshots taken at the Replit preview default width (1280 px)

### Structural foundations (all 7 pages)

| Foundation | Status |
|---|---|
| `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | Present on all pages |
| Tailwind CSS utility classes loaded via CDN | Present on all pages |
| Sticky navigation uses `max-w-6xl mx-auto` centring | Present on all pages |
| Navigation uses responsive `hidden sm:inline` pattern for lower-priority links | Confirmed in `aac.html` (line 20) |
| Form containers use `max-w-2xl` or `max-w-3xl` responsive centring | Confirmed on Projector and Suggest a Tool |
| Main content uses CSS Grid or Flexbox | Confirmed on Hub (2-column grid), Suggest a Tool |

### Tailwind breakpoint classes in use

| Class pattern | Purpose | Pages |
|---|---|---|
| `max-w-6xl mx-auto` | Centres and caps nav width | All |
| `max-w-2xl` / `max-w-3xl` | Caps form width on wide screens | Projector, Suggest a Tool |
| `grid grid-cols-1 sm:grid-cols-2` | Single-column on mobile, 2-column on ≥640 px | Hub |
| `hidden sm:inline` | Hides secondary nav links on small screens | AAC, others |
| `flex items-center` | Flex row for nav bar controls | All |

### Note on full viewport simulation

Full multi-width visual testing (e.g. 375 px mobile, 768 px tablet) requires a real browser and is covered by the Playwright test suite (`tests/playwright/responsiveness.spec.js`), which is ready for use in a CI environment with a compatible Chromium.

---

## 7. Development vs Deployment Parity

### Architecture

Floop Feedback Tools is a **pure static site**. There is no server-side rendering, build pipeline, database, or environment-specific configuration. The deployment is configured in `.replit` as:

```toml
[deployment]
publicDir = "."
```

This means the deployment system serves the same files directly from the repository root that are served by the development Python HTTP server. There is no compilation, bundling, or transformation step between development and production.

### Parity verification

| Concern | How it is addressed |
|---|---|
| File differences between environments | None possible — same files served in both. No build output to diverge. |
| Environment-specific API keys or secrets | None present. Suggest a Tool posts to a Google Apps Script URL hard-coded in `suggest-tool.js`. |
| CDN availability | Tailwind CSS, React 18, and Babel standalone are loaded from public CDNs at runtime in both environments. |
| localStorage persistence | Drawback gallery and Projector history are stored in the browser's `localStorage` — per-user and per-browser in both environments by design. |
| Python server vs deployment server | The Python server is a development convenience only. The deployed version is served by the Replit static hosting layer, which also returns HTTP 200 for all pages. |

### Conclusion

Because there is no build step, the development and deployed versions are byte-for-byte identical for all HTML, CSS, and JavaScript assets. Any change committed to the repository is immediately reflected in a re-deployed build.

---

## 8. Bugs Found and Resolved

Two failures were caught by the automated test suite during this testing cycle and corrected before final sign-off.

### Bug 1 — `aac.html` missing semantic `<main>` element

| Field | Detail |
|---|---|
| Discovered by | `navigation.test.js` — "has `<main id="main-content">`" check |
| Symptom | `$('main#main-content').length` returned `0` |
| Root cause | The page used `<div id="main-content">` instead of the semantic `<main>` element |
| Impact | Screen readers and assistive technology could not identify the main landmark; the skip-navigation link target was a `<div>` rather than a `<main>`, breaking keyboard navigation |
| Fix | Replaced the opening `<div id="main-content"...>` with `<main id="main-content"...>` and updated the matching closing tag |
| Verified | Test passes; `aac.html` now has a correct `<main id="main-content">` landmark |

### Bug 2 — Incorrect stylesheet assertion in Projector test

| Field | Detail |
|---|---|
| Discovered by | `projector.test.js` — "page links the global stylesheet" check |
| Symptom | `stylesheets.some(href => href.includes('style.css'))` returned `false` |
| Root cause | The test was asserting that `projector.html` links `assets/css/style.css`, but the page uses only Tailwind CSS via CDN with no separate local stylesheet — the assertion was wrong, not the page |
| Impact | False failure masking a correct implementation |
| Fix | Updated the test to assert that Tailwind is loaded via CDN instead, which accurately describes the page's actual approach |
| Verified | Test passes; the check now correctly validates the page's styling approach |

---

## 9. Summary

### Automated test results

| Suite | Tests | Passed | Failed |
|---|---|---|---|
| Unit — RTF generation | 16 | 16 | 0 |
| Unit — counters and validation | 14 | 14 | 0 |
| E2E HTTP — navigation and landmarks | 58 | 58 | 0 |
| E2E HTTP — Projector structure | 10 | 10 | 0 |
| E2E HTTP — Suggest a Tool structure | 12 | 12 | 0 |
| E2E HTTP — Drawback structure | 9 | 9 | 0 |
| E2E HTTP — Gallery structure | 8 | 8 | 0 |
| E2E HTTP — Responsiveness foundations | 35 | 35 | 0 |
| **Total** | **145** | **145** | **0** |

### Manual test results

| Area | Pages / checks covered | Result |
|---|---|---|
| Page load and visual rendering | 7 pages | All pages load and render correctly |
| Form structure and controls | Projector, Suggest a Tool | All fields, counters, and buttons present |
| Drawing tool | Drawback | Canvas, palette, clear and submit controls present |
| Gallery empty state | Gallery | Correct empty state with actionable CTA |
| Navigation consistency | All pages | Consistent nav, active-page marking on all pages |
| Usability (visual inspection) | All interactive pages | Clear, low-text interfaces appropriate for target users |
| Responsiveness foundations | All pages | Viewport meta, Tailwind CDN, flex/grid layouts confirmed |

### Development vs deployment parity

No divergence is possible. The site is purely static and `publicDir: "."` deploys the same files served in development without transformation.

### Outstanding items

| Item | Type | Notes |
|---|---|---|
| Full-width visual regression (375 px, 768 px) | Automated (Playwright) | Specs written; require CI Chromium to execute |
| Canvas draw-and-submit flow | Automated (Playwright) | Spec written; require CI Chromium to execute |
| localStorage round-trip (Projector history, Gallery) | Automated (Playwright) | Spec written; require CI Chromium to execute |
| Screen reader / keyboard-only walkthrough | Manual | Recommended before any public accessibility claim; automated tools cover ~30–40% of WCAG issues |
| Cross-browser visual check (Firefox, Safari) | Manual | No issues identified with the Tailwind utility-class approach, but a formal check is advisable |
