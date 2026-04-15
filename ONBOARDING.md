# Onboarding Flow

> Agent instructions for first-run setup. This is NOT a user-facing document.

---

## Trigger

At session start, check: are there any business folders at the root level (any folder that isn't `system/`, `.claude/`, or a dotfolder)? If not, run this onboarding flow.

---

## Critical Execution Rules

**READ THIS FIRST — these rules override any default behavior:**

1. **DO NOT use the Task tool or spawn background agents during onboarding.** Do all research yourself using WebFetch, WebSearch, and Playwright MCP directly. Background agents break the flow — they end your turn and leave the user staring at a blank prompt.

2. **DO NOT stop between phases.** The onboarding is ONE continuous flow. After Phase 1 questions are answered, immediately start Phase 2 research. After research, immediately start Phase 3 MC questions. After all answers, immediately run Phase 4 file creation. After that, immediately run Phase 5 handoff. The user should never see a blank prompt and wonder "what now?"

3. **If a WebFetch or WebSearch call fails, skip it and move on.** Don't retry endlessly. Use whatever data you have. Partial research is fine — the MC questions will fill gaps.

4. **Keep research focused.** Don't try to scrape 20 pages or run 15 searches. Do 3-5 WebFetch calls (key pages) and 3-5 WebSearch calls (competitors, audience, market). Quality over quantity. Then move on to questions.

---

## Design Principles

- **Research-first.** The system does the heavy lifting. The user confirms and corrects.
- **Multiple-choice by default.** Never ask an open question when you can offer options. Use AskUserQuestion tool for ALL questions. Group related questions (up to 4) in a single call when they're independent.
- **Silent research integration.** Use research findings to generate smart MC options. Never surface conflicts between research and user beliefs — just offer both as options and let the user pick.
- **One business at a time.** If the user manages multiple, set up the first one fully, then explain how to add more.
- **User-facing language:** Say "business" not "brand." Not everyone thinks of what they do as a "brand."

---

## Phase 1: Initial Setup (minimal open questions)

These are the only open-ended questions in the entire onboarding.

### 1a. Greeting + website

> "Welcome to GrowOS — I'm your AI marketing team. To get started, I need to learn about your business."
>
> "What's the website for the business you want to create marketing for? This could be your own business or a client's — just enter the site for the business we'll be writing for."

This phrasing works for both solo owners and agencies. It makes clear: enter the website of the business you want to market, not your agency's website.

### 1b. Language detection

**Language is auto-detected during Phase 2 website research — do NOT ask about it here.** Detect the language from the website content. Only ask if: (a) no website was provided, (b) the website uses multiple languages, or (c) detection is genuinely ambiguous. In those cases, ask as a single MC question: "What language should all output be in?" with the relevant options.

**Do NOT ask about single vs. multi-business.** Just set up this one business. If they want to add more later, they can say "add new business" or run `/setup` again. Don't clutter the first experience with questions that don't matter yet.

---

## Phase 2: Deep Research (system works silently)

**IMPORTANT: Do all research yourself using available tools directly. Do NOT use the Task tool or spawn any agents. Do NOT stop after research — immediately continue to Phase 3.**

**Tool priority:** If Playwright MCP is available (`mcp__playwright` tools in your tool list), use it as the primary method — it renders full pages including JavaScript, which many modern websites require. Use `browser_navigate` to visit URLs and `browser_snapshot` to read content. Fall back to WebFetch if Playwright is unavailable.

Tell the user:
> "Got it — I'm going to research your business now. This takes a couple of minutes. I'll look at your website, your competitors, your market, and your audience. Hang tight."

Then immediately start making WebFetch and WebSearch calls. Do not wait for user input.

### 2a. Website Crawl

Use WebFetch (or Playwright) to scrape up to 8 pages from the website. Prioritize in this order:
1. Homepage
2. About / About Us page
3. Main product/service/offer pages (all of them)
4. Pricing page
5. Testimonials / case studies page
6. 1-2 blog posts (most recent or most prominent)

From the website, extract:
- **Language:** Detect the primary language of the website content. Store this as the output language for all content. If the site is multilingual, note all languages — the user will be asked.
- **Business basics:** Name, type (service/digital product/e-commerce/agency), one-line description
- **All offers:** Product/service names, pricing, positioning, features, benefits stated
- **Target audience signals:** Who the copy speaks to, language used, pain points referenced
- **Proof/social proof:** Testimonials, case studies, numbers, certifications, media mentions
- **Current voice patterns:** Tone, formality level, sentence rhythm, emoji usage, vocabulary patterns
- **Social account links:** Look for links to Twitter/X, LinkedIn, Instagram, Facebook, YouTube, TikTok, etc. in the header, footer, or sidebar. Store all found URLs.
- **Marketing channels visible:** Email capture forms, social media links, blog, YouTube, podcast
- **Competitors mentioned or implied:** Any comparisons, "unlike other X" language
- **Logo URL:** Look for `<img>` tags with class, id, or alt containing "logo", or `<svg>` in the site header/navbar. Note the full absolute URL.
- **CSS file URLs:** Find `<link rel="stylesheet">` tags and note up to 2 CSS hrefs for color/font extraction below.

### 2a.5. Visual Brand Extraction

Immediately after the main page scrape, fetch 1-2 of the CSS URLs found. From the stylesheet(s), extract:

- **Colors:** Hex codes in CSS custom properties (especially names like `--primary`, `--brand`, `--accent`, `--main`, `--color-*`) and frequently repeated hex values used for backgrounds and text.
- **Fonts:** `font-family` values for heading elements (h1, h2, `.heading`, etc.) and body text.

Compile a visual brief internally (not shown to user):

```
VISUAL BRIEF
Primary color: [hex or "not found"]
Accent color(s): [hex, hex or "not found"]
Heading font: [family name or "not found"]
Body font: [family name or "not found"]
Logo URL: [url or "not found"]
CSS extraction quality: clean / partial / failed
```

If CSS extraction fails or yields no useful data, note it — the Phase 3 MC questions will fill gaps.

### 2b. Competitor Research

Use WebSearch to:
- Identify 3-5 direct competitors (search: "[business type] + [niche] + [location if relevant]")
- For each competitor, note: core promise, positioning, pricing (if visible), unique mechanism, gaps/weaknesses
- Find positioning opportunities this business could own

### 2c. Audience Research

Use WebSearch to research the target audience:
- Search Reddit, forums, review sites for how this audience describes their problems
- Find verbatim language: pain points, desires, objections, frustrations
- Identify awareness level (Schwartz scale) based on how the market talks about solutions
- Note where this audience hangs out online

### 2d. Market Context

Use WebSearch to:
- Understand market size and dynamics
- Identify trends affecting this niche
- Note any regulatory considerations (financial, medical, legal = triggers compliance mode)

### 2e. Compile Research Brief

Internally organize all findings into a research brief structured around brand.md sections. This brief is NOT shown to the user — it's used to generate smart MC options in Phase 3.

**Do not stop here. Immediately proceed to Phase 3.**

---

## Phase 3: MC Interview (all via AskUserQuestion)

Use the research brief to generate informed MC options. The user should feel like you already understand their business and are just confirming details.

**Important rules:**
- Use AskUserQuestion for every question. Group up to 4 independent questions per call.
- Every option should be a real, plausible answer based on research. Don't include obviously wrong filler options.
- "Other" is implicit (the AskUserQuestion tool adds it automatically).
- Adapt questions based on business type detected in research.
- **Skip questions where research gives a clear answer.** If you can confidently derive the answer from the website, don't ask. Only ask when genuinely ambiguous or when the stakes of getting it wrong are high (e.g., pricing, primary audience). Err on the side of skipping.

**This is always the quick path.** Cover: business type, offers, customers, voice gateway, brand color. Deeper sections (competitors, goals, marketing channels) are filled from research silently or offered in the deep extension (Phase 5b).

---

### 3a. Business Basics Confirmation

- **Business type:** "Which best describes your business?"
  Options based on research: e.g., "Online coaching / consulting", "Digital products / courses", "E-commerce / physical products", "Service business (local or remote)"

- **One-line description:** Present 2-3 research-derived descriptions:
  "Which best captures what you do?"
  → If research clearly answers this, auto-generate from findings — no question needed.

### 3b. Offers

- **Price point:** "What's the price for [offer name]?"
  Options: price ranges based on what was found.

- **If multiple offers detected:** Ask which is the primary/flagship offer.

- **If no clear offers detected:** Ask: "What's your main offer right now?" with MC options based on common offer types for their business type.

### 3c. Customers

- **Primary audience:** "Who is your ideal customer?"
  Options: 2-3 audience profiles derived from research.

- **Biggest pain point:** "What's the #1 problem your customers are trying to solve?"
  Options: top 3 pain points from audience research.

Auto-populate desired outcomes and objections from research — no questions needed in quick mode.

### 3d. Brand Voice

**First, ask the gateway question:**

- "Does your current website sound like you — is that the voice you want for your marketing?"
  Options: "Yes — that's my voice", "Mostly, but I'd like to adjust it", "No — I want a different voice"

**If "Yes" or "Mostly":**
- Extract voice from website crawl data
- If "Mostly," ask: "What would you change about your current voice?"
  Options: e.g., "Make it more casual/conversational", "Make it more authoritative/professional", "Make it shorter and punchier", "Add more personality/humor"

**If "No":**
- "How should your business sound?"
  Options: "Casual, direct, and conversational (like texting a smart friend)", "Warm, empathetic, and supportive (like a trusted mentor)", "Bold, confident, and provocative (like a challenger brand)", "Professional, polished, and credible (like a premium service)"

- "What's your sentence style?"
  Options: "Short and punchy — get to the point", "Mix of short and medium — conversational flow", "Longer and more detailed — thorough and thoughtful"

Skip emoji, forbidden words, and voice validation in quick mode. Build the voice profile from available data and move on.

### 3e. Visual Brand (silent)

**Do NOT ask about colors, fonts, or visual brand during quick onboarding.** Use whatever was extracted from the CSS silently. If extraction failed, leave fields blank and mark with `<!-- TO COMPLETE -->`. The deep extension covers visual brand questions if the user chooses to go deeper.

This removes friction. Colors and fonts can always be corrected later.

---

## Phase 4: Generate Everything

After all MC answers are collected:

1. **Create business folder** at the root level: `[business-name]/`. Copy the structure from `system/business-template/` — this creates the folders: `output/` (with subdirs), `research/`, `uploads/`, `inspiration/`, `audiences/`.

2. **Download logo (if URL was found in research):** If Phase 2a found a logo URL, download it to `[business-name]/uploads/logo.[ext]` using Node.js:

```
node -e "const https=require('https'),http=require('http'),fs=require('fs');const lu='[LOGO_URL]';const dest='[business-name]/uploads/logo.[ext]';const cl=lu.startsWith('https')?https:http;const f=fs.createWriteStream(dest);cl.get(lu,r=>{r.pipe(f);f.on('finish',()=>{f.close();console.log('Logo saved: '+dest);})}).on('error',e=>{fs.unlink(dest,()=>{});console.error('Logo download failed: '+e.message);})"
```

Replace `[LOGO_URL]`, `[business-name]`, and `[ext]` with actual values. If the download fails, note the logo URL as plain text in Section 9 of brand.md instead.

3. **Generate brand.md** at `[business-name]/brand.md`. Populate every section using research findings + user MC answers. User answers always take priority. Fill in:
   - Section 1 (Basics): from Phase 1 + 3a
   - Section 2 (Offers): from 3b — include all confirmed offers
   - Section 3 (Customers): from 3c + audience research — include verbatim language
   - Section 4 (Brand Voice): from 3d — full voice profile
   - Section 5 (Competitors): from Phase 2b research (mark `<!-- TO COMPLETE -->` if sparse)
   - Section 6 (Current Marketing): from research (channels found, social URLs extracted)
   - Section 7 (Goals): leave sparse, mark `<!-- TO COMPLETE: say 'go deeper' to fill this in -->`
   - Section 8 (Settings): compliance mode if detected, team size if known
   - Section 9 (Visual Brand): from Phase 2a.5 CSS extraction + 3e MC answers

4. **Generate audiences/01-primary.md** from research + MC answers.

5. **Copy lessons.md and content-ideas.md** from template (empty starters).

6. **Save research to file:** Write the full research brief to `[business-name]/research/YYYY-MM-DD-onboarding-research.md`. This preserves all findings for later use by skills.

---

## Phase 5: Handoff + Offer Deep Extension

### 5a. Summary

> "Your business is all set up! Here's what I've learned:"

Show a brief summary: business name, main offer, target audience, voice in one line, brand color.

### 5b. Offer Deep Extension

> "Want to go deeper? I can do a thorough voice interview, collect your writing samples, and build detailed audience profiles. Takes about 10 more minutes. You can also do this anytime later."

Options (MC via AskUserQuestion):
- **"Yes — let's go deeper"** → Run Phase 6 (Deep Extension)
- **"No — let's start creating"** → Skip to 5c

If they choose "No," add:
> "No problem. Next time you start a session, I'll suggest completing your profile. The more I know about your voice and audience, the better everything I create gets."

### 5c. Recommend First Workflow

If quick mode or after deep extension completes:

> "What would you like to work on?"

Present 3 MC options via AskUserQuestion — tailored to the business type and what was found during research. Each option should map to a specific skill. Example:

- "Write a sales page for [main offer]" → `/landing-page`
- "Plan a week of social content" → `/social-plan`
- "Write my next newsletter" → `/newsletter-write`
- "I have something else in mind"

---

## Phase 6: Deep Extension (only if user chose "go deeper")

This replaces the old `/setup-deep` skill. It extends the quick setup with thorough voice/audience work.

### 6a. Collect Writing Samples

> "To really nail your voice, I need to see how you actually write. Can you share 2-3 of these:"

Options (MC via AskUserQuestion):
- **"Yes — let me paste some text or share URLs"** → Analyze provided content
- **"Yes — let me add files"** → Tell user: "Drop your files into the `uploads/` folder inside your business folder. They can be any format — text, screenshots, PDFs, whatever you have. Let me know when you're done."
- **"No — let's use interview questions instead"** → Skip to 6b

### 6b. Voice Interview (10 questions via AskUserQuestion)

**Round 1: How you sound**
1. "When you write, are you more the 'straight-talking friend' or the 'knowledgeable guide'? Or something else entirely?"
2. "Do you use humor in your marketing? If so, what kind?" Options: "Dry / sarcastic", "Self-deprecating", "Witty / clever", "Playful / fun", "No humor — straight to the point"
3. "How long are your typical paragraphs?" Options: "Short and punchy (1-2 sentences)", "Medium (2-3 sentences)", "Longer and more developed"
4. "Do you use contractions?" Options: "Yes, always (you're, don't, can't)", "Sometimes", "Rarely — I keep it more formal"

**Round 2: Boundaries**
5. "What words or phrases would you NEVER use?" (open-ended — can't MC this effectively)
6. "Any tones you want to avoid?" Options: "Too salesy / pushy", "Too casual / unprofessional", "Preachy / lecturing", "Overly corporate / stiff"
7. "Is there a public figure or brand whose writing style you admire?" (open-ended)

**Round 3: Patterns**
8. "How do you start emails or posts?" Options: "Jump straight in — no greeting", "Casual greeting (Hey, Hi)", "Question or hook first", "Story or observation first"
9. "How do you sign off?" Options: "Just my name", "Casual (Cheers, Talk soon)", "Professional (Best, Regards)", "Custom sign-off"
10. "Do you use emojis?" Options: "Never", "Occasionally — in social media only", "Frequently — it's part of my style"

**Voice validation:** Generate a short sample paragraph (3-4 sentences). Ask: "How does this sound?"
Options: "That's spot on", "Close but needs tweaking", "That's not right — try again"
Refine until confirmed. Maximum 3 attempts.

### 6c. Deep Audience Profiling

Ask using AskUserQuestion (1-2 at a time):

1. "Describe your best customer. Not the average one. The one you love working with."
2. "What's the #1 problem they come to you to solve?"
3. "What have they already tried before finding you?"
4. "What words do THEY use to describe their problem? (not your words, theirs)"
5. "What's the dream outcome they want? Be specific."
6. "What's their biggest objection or hesitation before buying?"
7. "Where do they spend time online? (specific platforms, groups, podcasts)"

### 6d. Upload Materials

> "Do you have any existing marketing materials — emails, ads, landing pages, social posts — that you'd like me to learn from?"

Options (MC via AskUserQuestion):
- **"Yes — let me add them"** → Tell user to drop files in `uploads/`. Wait for confirmation. Read and analyze each file. Auto-sort into `inspiration/`.
- **"No — we're good"** → Continue.

### 6e. Update Files

1. Update `brand.md` Section 4 (Voice) with deep interview findings + writing sample analysis
2. Update `audiences/01-primary.md` with deep profiling answers
3. If they described distinct segments, create additional personas (02-secondary.md, etc.)
4. Fill in any `<!-- TO COMPLETE -->` sections that now have answers
5. Add any feedback or preferences mentioned to `lessons.md`

### 6f. Summary

Present what was updated:
- Voice profile changes (highlight key insights)
- Audience personas created/updated
- Any lessons added

> "Your deep setup is complete. All content skills will now use this voice and audience data. The more feedback you give on outputs, the better it gets from here."

Then proceed to Phase 5c (recommend first workflow).

---

## Adding a New Business

When the user says "add new business" (or similar), run this same onboarding flow but:
- Skip the welcome greeting — just ask for the new website URL
- Create a new folder at the root level
- Tell the user: "To switch between businesses, just say 'switch to [business name]'."

---

## Profile Completion

When the user says "complete my profile" or "go deeper" after initial setup:
1. Read `brand.md` and identify `<!-- TO COMPLETE -->` markers
2. For missing sections, run the relevant Phase 3 MC questions (research-informed)
3. If voice is the focus, run Phase 6b-6e
4. Update brand.md with new information

---

## Edge Cases

### No website
- Skip Phase 2a website crawl and 2a.5 visual extraction
- Ask an open question: "Tell me in a sentence or two what your business does"
- Run competitor + audience + market research using the description
- Voice built entirely from MC questions
- Visual brand left blank

### Website under construction
- Treat same as "no website" but note the URL in brand.md basics

### Very new business (pre-launch)
- Competitor and market research still works
- Note in brand.md that proof section needs real data once launched

### Multi-business
- Set up the first business fully through this flow
- After completion: "To add another business later, just say 'add new business'."

### Regulated industry detected
- Auto-enable compliance mode in brand.md settings
- Confirm with user
- All downstream quality gates will apply regulatory checks

---

## Timing Expectations

- Phase 1 (initial setup): ~1 minute
- Phase 2 (deep research): ~2-3 minutes of system processing
- Phase 3 (MC interview): ~2 minutes of user time
- Phase 4 (generation): ~1 minute of system processing
- Phase 5 (handoff): ~30 seconds
- Phase 6 (deep extension, if chosen): ~10 minutes

**Quick total: ~5-6 minutes. With deep extension: ~15 minutes.** Most of that is clicking MC answers, not typing.
