---
name: setup
description: "Set up your business profile or add a new business. Guides you through onboarding with research-informed questions."
argument-hint: "[business name or website URL]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Setup

**Purpose:** Configure GrowOS for your business. Researches your website, learns your voice, and creates your business profile. Also used to add new businesses or update existing ones.
**When to use:** First time setup, adding a new business, or updating an existing one.

---

## Routing

Check for existing business folders at the root level (any folder that isn't `system/`, `.claude/`, or a dotfolder).

**If no business folders exist:** Run the full onboarding flow from `ONBOARDING.md`. Start at Phase 1.

**If business folders exist:** Ask via AskUserQuestion:
"I see you already have [business names] set up. What would you like to do?"

Options:
- **"Add a new business"** → Run the onboarding flow from `ONBOARDING.md`, but skip the welcome greeting. Go straight to asking for the website URL.
- **"Update [business name]"** → Ask what to update. Options: "Voice / tone", "Offers and pricing", "Target audience", "Competitors", "Everything — full refresh". Then re-run the relevant Phase 3 sections from `ONBOARDING.md` with fresh research.
- **"Go deeper on [business name]"** → Run Phase 6 (Deep Extension) from `ONBOARDING.md`.
- **"Start fresh"** → Warn: "This will reset everything for [business name]. Are you sure?" If confirmed, delete the business folder and run full onboarding.

---

## Important

- All onboarding logic lives in `ONBOARDING.md`. This skill is the entry point that routes to the right phase.
- If the user provides a website URL as an argument, skip the greeting and start research immediately.
- If the user provides a business name as an argument, check if that business folder exists and route accordingly.
