# CYTHON CTF — Capture The Flag

A fast, dependency-free static rebuild of the **CYTHON CTF** event website, powered by **NxtGenSec**. Dark cinematic theme, live event countdown, rotating hero headline, and a 4-step frontend-only registration wizard.

**Live event:** 30 Oct 2026, 10:00 AM IST → 31 Oct 2026, 10:00 PM IST (36 hours)

---

## Features

- **Cinematic hero** — two-line display headline with auto-fit sizing, rotating keyword (*Your Hunt / Exploration / … / Victory begins here*, 15 words, 3s rotation), and exact Root Access palette (`#050706` / `#0D120F` / `#28342B` / `#39FF14`)
- **Live countdown** — three states (`EVENT STARTS IN` → `CYTHON CTF IS LIVE` → `THE BATTLE HAS ENDED`), ticking every second off real timestamps, zero-padded units, screen-reader safe
- **Animated starfield sky** — pure-CSS twinkling stars + seamless crossfade zoom, fixed behind all content
- **Full event page** — About, Challenges (6 categories), How It Works, Rewards, Rules & Eligibility, FAQ accordion, CTA, footer
- **4-step registration wizard** — Participant → Team → Payment → Confirmation with validation; memory-only, nothing is stored or submitted
- **Accessible & smooth** — keyboard focus rings, `prefers-reduced-motion` support, lazy-rendered sections, no images, no frameworks

## Project structure

```
├── index.html      # Homepage (hero, sections, footer)
├── register.html   # 4-step registration wizard
├── styles.css      # Design system, layout, sections, sky theme
├── hero.css        # Hero section styles
├── app.js          # Nav, FAQ, reveal animations, headline rotator + auto-fit, sky zoom
├── countdown.js    # Event timestamps + countdown engine (testable pure functions)
└── register.js     # Registration wizard logic (in-memory state)
```

## Getting started

No build step. Serve the folder and open it:

```bash
cd "CYTHON CTF 1.0"
python -m http.server 8000
# → http://localhost:8000
```

Or simply double-click `index.html` (recommended: serve over HTTP for correct font loading).

## Configuration

Event timing lives in one place — `countdown.js`:

```js
var CYTHON_EVENT = {
  startIso: '2026-10-30T10:00:00+05:30',
  endIso:   '2026-10-31T22:00:00+05:30',
  timeZone: 'Asia/Kolkata'
};
```

Hero rotating words live in `app.js` (`words` array, `3000` ms interval). Countdown logic is exported for tests:

```bash
node -e "const c = require('./countdown.js'); console.log(c.cythonSnapshot(Date.now()));"
```

## Registration flow

Team-only event — no individual entries. Teams of 2, 3 or 4 members: the registrant becomes Member 1 (team leader), picks a team size in Step 2 (member fields appear dynamically), chooses a payment method in Step 3, and the record is written to Supabase on submit.

## Database (Supabase)

- Keys live in `.env.local` (gitignored, never committed). The browser uses only the anon key via `supabase.js`, guarded by row-level security.
- `setup.sql` creates everything: `student_registrations` and `professional_registrations` tables (one per participant type), RLS enabled, anon `INSERT`-only policies, `team_size` constrained to 2–4, teammates stored as `members` JSONB.
- Run `setup.sql` in the Supabase SQL editor (or any SQL client) to provision a project.

## Tech

HTML + CSS + vanilla JS. Zero dependencies, zero trackers. Fonts via Google Fonts (Inter, JetBrains Mono, Rubik Distressed, Caveat) with `display=swap`.

---

© 2026 CYTHON CTF — Powered by NxtGenSec. All rights reserved.
