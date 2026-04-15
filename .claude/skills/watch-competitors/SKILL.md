---
name: watch-competitors
description: "Monitor competitor social media and extract content intelligence. Scrapes posts, analyzes patterns, and generates content ideas from what's working."
argument-hint: "[competitor name or URL]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# /watch-competitors — Competitor Intelligence

Monitor competitor social media, scrape their posts, analyze what's working, and generate content ideas. Two modes: Setup (add a new competitor) and Scrape & Analyze (ongoing monitoring).

**Trigger:** `/watch-competitors` or "monitor competitors", "watch competitors", "competitor scrape", "competitor intelligence"
**Output:** Reports in `[active-business]/output/competitor-intelligence/`, scraped data in `[active-business]/competitors/[slug]/`
**Duration:** 5-15 minutes depending on number of competitors and platforms

---

## Detect Mode

If an argument is provided (competitor name or URL) AND no competitor profile exists for them yet, run **Mode A (Setup)**.

If no argument, or the argument matches an existing competitor, run **Mode B (Scrape & Analyze)**.

---

# Mode A: Setup (First Run Per Competitor)

## Step A1 — Interview

Use AskUserQuestion to gather:

1. "Who do you want to monitor?" (name, website, or social handle)
2. "Which platforms should I track?" (options: Twitter/X, LinkedIn, YouTube, Facebook page — allow multi-select)
3. For each selected platform: "What's their profile URL or handle on [platform]?"
4. "What's your goal with monitoring them?" (options: content ideas, positioning gaps, ad intelligence, all of the above)

If the user provided a name/URL as an argument, skip question 1 and use that.

---

## Step A2 — Create Competitor Profile

Save to `[active-business]/competitors/[competitor-slug].md`:

```markdown
# [Competitor Name]
**Website:** [URL]
**What they sell:** [from interview or website scan]
**Their audience:** [from interview or website scan]

## Platforms
- Twitter: @handle
- LinkedIn: /in/slug
- YouTube: @channel

## Monitoring
- Added: [today's date]
- Last scraped: never
- Goal: [content ideas / positioning gaps / ad intel / all]

## Key Insights
(Updated after each scrape)
```

Use the competitor's name slugified as the folder/file name (e.g., "Justin Welsh" becomes `justin-welsh`).

If the website URL was provided, fetch it to fill in "What they sell" and "Their audience". If not available, leave as `[unknown]`.

---

## Step A3 — Update Competitor Index

Read `[active-business]/competitors/_index.md`. Add the new competitor entry:

```markdown
## [Competitor Name]
- **URL:** [url]
- **Platforms:** [Twitter, LinkedIn, YouTube]
- **Goal:** [content ideas / positioning gaps / ad intel / all]
- **Added:** [date]
- **Last scraped:** never
```

---

## Step A4 — First Scrape

Proceed directly to Mode B (Scrape & Analyze) for this competitor.

---

# Mode B: Scrape & Analyze (Ongoing)

## Step 0 — Load Context

Read these files:

1. `[active-business]/brand.md (Section 4: Brand Voice)` — brand voice and positioning
2. `[active-business]/lessons.md` — rules from past feedback
3. `[active-business]/competitors/_index.md` — all tracked competitors
4. `[active-business]/content-ideas.md` — existing content ideas (for deduplication)

---

## Step 1 — Select Competitors

If an argument was provided (competitor name), select that competitor.

Otherwise, list all tracked competitors from `_index.md` and ask:

"Which competitors should I scrape? Pick one, multiple, or 'all'."

Use AskUserQuestion with the competitor names as options plus an "all" option.

---

## Step 2 — Check Dependencies

First, check if Node.js is available:

```bash
node --version
```

If not installed, guide the user:
- **Mac:** "Install Node.js from https://nodejs.org (LTS version). Or if you have Homebrew: `brew install node`"
- **Windows:** "Install Node.js from https://nodejs.org (LTS version). Download the Windows installer and follow the steps."

Then verify Playwright is available:

```bash
npx playwright --version
```

If not installed, guide the user through setup:

**Mac:**
> "I need to set up browser automation for scraping. Run these two commands:"
> 1. `npm install playwright`
> 2. `npx playwright install chromium`

**Windows:**
> "I need to set up browser automation for scraping. Open PowerShell and run:"
> 1. `npm install playwright`
> 2. `npx playwright install chromium`

Use AskUserQuestion to confirm when they're done. Then re-check `npx playwright --version`.

Verify helper files exist:
- `system/tools/browser-helpers/human.js`
- `system/tools/browser-helpers/playwright-stealth.js`

If missing, report the error and stop.

---

## Step 3 — Launch Browser

```javascript
const { chromium } = require('playwright')
const stealth = require('./system/tools/browser-helpers/playwright-stealth.js')
const { initHuman } = require('./system/tools/browser-helpers/human.js')

const browser = await chromium.launch({ headless: false })
const contextOpts = stealth.getStealthContextOptions()
const context = await browser.newContext(contextOpts)
await stealth.applyStealthConfig(browser, context)
const page = await context.newPage()
const human = initHuman(page)
```

---

## Step 4 — Per-Platform Scraping

For each selected competitor, read their profile from `[active-business]/competitors/[slug].md` to get platform handles.

### Twitter/X

1. Navigate to the competitor's Twitter profile:
   ```javascript
   await human.goto(`https://x.com/${handle}`)
   await human.wait('read')
   ```

2. Check if the profile loaded. If blocked, suspended, or requires login, skip and report.

3. Scroll through posts, pausing like a real reader:
   ```javascript
   let scrollCount = 0
   const maxScrolls = 8 // ~20-30 posts
   while (scrollCount < maxScrolls) {
     await human.scroll({ distance: 'medium' })
     await human.wait('between')
     scrollCount++

     // Occasional longer pause (reading behavior)
     if (scrollCount % 3 === 0) {
       await human.wait('read')
     }

     // Natural hand movement
     if (Math.random() < 0.05) {
       await human.jitter()
     }
   }
   ```

4. Extract posts from the page. For each post capture:
   - Post text (full, not truncated)
   - Date
   - Engagement (likes, retweets, replies, views if visible)
   - Post URL

5. Deduplicate against existing data. Check for `<!-- post:ID -->` anchors in the monthly file.

6. Save to `[active-business]/competitors/[slug]/twitter-YYYY-MM.md`:

   ```markdown
   ---
   platform: twitter
   competitor: [name]
   handle: [handle]
   month: YYYY-MM
   post_count: N
   last_updated: YYYY-MM-DDTHH:MM:SSZ
   ---

   <!-- post:STATUS_ID -->
   ## YYYY-MM-DD — {likes} likes, {retweets} RTs, {replies} replies, {views} views

   {full post text}

   **URL:** https://x.com/{handle}/status/{id}

   ---
   ```

   Insert new posts after frontmatter (newest-first). Update post_count and last_updated.

### LinkedIn

1. Navigate to the competitor's activity page:
   ```javascript
   await human.goto(`https://www.linkedin.com/in/${slug}/recent-activity/all/`)
   await human.wait('read')
   ```

2. Check if loaded. If requires login or is private, skip and report.

3. Same scrolling pattern as Twitter, extracting:
   - Post text
   - Approximate date
   - Reactions count
   - Comments count

4. Save to `[active-business]/competitors/[slug]/linkedin-YYYY-MM.md` using the same monthly format. Use content hash for dedup anchors since LinkedIn post IDs are harder to capture:
   ```
   <!-- post:hash:ABCD1234 -->
   ```

### YouTube

1. Navigate to the competitor's channel videos page:
   ```javascript
   await human.goto(`https://www.youtube.com/@${channel}/videos`)
   await human.wait('read')
   ```

2. Extract from the page:
   - Video titles
   - View counts
   - Upload dates
   - Video URLs

3. Save to `[active-business]/competitors/[slug]/youtube-YYYY-MM.md`:

   ```markdown
   <!-- video:VIDEO_ID -->
   ## YYYY-MM-DD — {Title}

   **Views:** {views}
   **URL:** https://www.youtube.com/watch?v={VIDEO_ID}

   ---
   ```

### Between Platforms

Add a random delay between platforms for natural behavior:

```javascript
// Random delay 30-120 seconds between platforms
const delay = 30000 + Math.floor(Math.random() * 90000)
console.log(`Platform switch delay: ${Math.round(delay / 1000)}s`)
await new Promise(r => setTimeout(r, delay))
```

### Between Competitors

Add a longer delay between different competitors:

```javascript
// Random delay 60-180 seconds between competitors
const delay = 60000 + Math.floor(Math.random() * 120000)
console.log(`Competitor switch delay: ${Math.round(delay / 1000)}s`)
await new Promise(r => setTimeout(r, delay))
```

### Mirror to Swipe Files

After saving scraped posts to the competitor folder, also mirror them to the swipe-files directory so all inspiration is browsable by platform:

- Twitter posts → `[active-business]/swipe-files/twitter/[handle]-YYYY-MM.md`
- LinkedIn posts → `[active-business]/swipe-files/linkedin/[slug]-YYYY-MM.md`
- YouTube videos → `[active-business]/swipe-files/youtube/[channel]-YYYY-MM.md`

Use the same format as the competitor files. The swipe-files copy is the "browsable library" while competitors/ is the "intelligence source." Both use the same dedup anchors so running twice won't create duplicates.

---

## Step 5 — Analysis

After all scraping is complete, analyze the collected data.

Read all scraped files for the selected competitors (current month and previous month for context).

Produce:

1. **Top 5 posts by engagement** across all competitors scraped this session. For each:
   - Full post text
   - Platform and URL
   - Engagement metrics
   - Why it likely worked (hook type, format, topic)

2. **Post type classification.** Classify each top post by intent type:
   - TEACH: how-to, steps, framework, tutorial
   - HOT TAKE: contrarian opinion, prediction, challenges wisdom
   - STORY: personal narrative, behind-the-scenes, vulnerability
   - ENGAGE: question, poll, this-or-that
   - PROOF: results screenshot, case study, specific numbers
   - OBSERVE: relatable observation, humor, cultural commentary
   - PROMOTE: CTA, offer, link to product

3. **Posting patterns:** frequency, best-performing days/times, platform preferences

4. **Content gaps:** topics competitors cover that the user's brand doesn't

5. **Differentiation opportunities:** topics nobody covers well, or angles that are missing

---

## Step 6 — Generate Report

Save to `[active-business]/output/competitor-intelligence/YYYY-MM-DD-report.md`:

```markdown
# Competitor Intelligence Report — [Date]

**Competitors analyzed:** [list]
**Platforms scraped:** [list]
**Posts collected:** [count]

---

## Top Performing Content

### 1. @{handle} — {platform} — {engagement summary}
**Type:** {TEACH/HOT TAKE/STORY/etc.}

{FULL POST TEXT}

**URL:** {direct link}
**Why it worked:** {brief analysis}

### 2. ...
(top 5 posts)

---

## Content Patterns
- {What types/topics get the most engagement}
- {Posting frequency and timing observations}
- {Format preferences per platform}

---

## Gaps & Opportunities
- {Topics competitors miss that you could own}
- {Audiences they underserve}
- {Formats they are not using}
- {Positioning angles left open}

---

## Content Ideas

### 1. {idea title}
**Inspired by:** {competitor post}
**Our angle:** {how to make it yours}
**Format:** {platform/type suggestion}

### 2. ...
(3-5 specific ideas)
```

Run `/humanize` on any copy suggestions in the report before presenting.

---

## Step 7 — Content Bank Integration

Present the content ideas from the report to the user.

Ask: "Want me to add any of these to your content bank?"

Use AskUserQuestion with the ideas listed as options (allow multi-select, plus a "none" and "all" option).

For each selected idea, add to `[active-business]/content-ideas.md` in the Ready to Write section:

```markdown
- [YYYY-MM-DD] `[FORMAT]` **[FROM COMPETITOR]** {idea title} — {one-line description of angle}
  Source: {competitor name}, {platform} — {URL}
```

---

## Step 8 — Update Competitor Profiles

For each scraped competitor, update their profile at `[active-business]/competitors/[slug].md`:

- Set "Last scraped" to today's date
- Add or update "Key Insights" section with 2-3 bullet points from the analysis
- Update the entry in `[active-business]/competitors/_index.md` with the new last-scraped date

---

## Step 9 — Cleanup & Feedback

Close the browser:
```javascript
await browser.close()
```

Present a brief summary:
```
Competitor intelligence complete.

Scraped: [n] competitors across [n] platforms
Posts collected: [n] new posts
Report saved: [active-business]/output/competitor-intelligence/YYYY-MM-DD-report.md
```

Then ask:

"Want to change anything about this analysis? Any patterns you want me to focus on next time? If you give feedback, I'll add it to your lessons.md so I remember."

If feedback is given:
1. Apply the changes to the report
2. Add a concise rule to `[active-business]/lessons.md` under a "Competitor Intelligence" section

---

## Hard Rules

- **READ ONLY.** Never like, follow, comment, or interact with any competitor content. Observation only.
- **No fabrication.** All analysis must be based on actual scraped data. No invented metrics or made-up patterns.
- **Full text.** Always save the complete post text, never truncate or summarize.
- **Source URLs.** Every referenced post must include a direct URL.
- **Timestamps.** All saved data includes scrape date.
- **human.wait() between every major action.** Scroll like a real person.
- **If a profile is private or requires login, skip it and report.** Don't try to log in.
- **Close the browser when done.** Always clean up.
- **AskUserQuestion for all decisions.** Works in both Code and Cowork mode.
- **Follow CONVENTIONS.md** for all file paths and formatting.
- **Rate limits apply.** Even though we're only reading, respect the human.js delay patterns to avoid detection.
