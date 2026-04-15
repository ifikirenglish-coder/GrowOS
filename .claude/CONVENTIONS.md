# GrowOS Skill Conventions

Sub-agents: read this BEFORE building any skill.

---

## Product Context

GrowOS is a customer-facing AI marketing system powered by Claude Code. Users download it as a zip, open it in Claude Desktop (Code tab), and the system auto-starts onboarding on their first message. It supports multiple businesses in `[business-name]/` folders at the root level.

**This is NOT Wilco's internal system.** No references to Wilco, GOR, GrowOnRepeat, MarketingOS, emarky, or any internal paths.

---

## Frontmatter (required)

```yaml
---
name: skill-name
description: "User-facing description of what this does"
argument-hint: "[optional context hint]"
user-invocable: true
---
```

---

## Skill Structure

Every skill follows this pattern:

### Step 0 — Context Loading
Load the active business's files before doing anything:
```
[active-business]/brand.md
[active-business]/lessons.md
```
Plus any skill-specific references (e.g., `system/references/headline-types.md`, `system/references/social-post-types.md`).

To identify the active business: check the root-level folders. If multiple business folders exist and none is specified, ask the user which business they're working on.

**Loading brand.md sections:** Not every skill needs every section. Load what's relevant:
- Content skills: Section 4 (Voice), Section 3 (Customers), Section 2 (Offers)
- Ad skills: All of the above + Section 5 (Competitors), Section 6 (Current Marketing)
- Research skills: Section 1 (Basics), Section 5 (Competitors)
- Visual skills: Section 9 (Visual Brand), Section 4 (Voice)

### Steps 1-N — Workflow
Numbered steps. Each step describes:
- What to do
- What files to load (if any)
- What to ask the user (use AskUserQuestion for decisions)
- What to show the user

### Quality Gate
All content skills must include: "Run `/humanize` on the draft before presenting it."

### Output Saving
Save to `[active-business]/output/[category]/` with descriptive filenames.
Use format: `YYYY-MM-DD-slug.md` or descriptive names.

Categories: `social/`, `newsletter/`, `blog/`, `ads/`, `landing-pages/`, `video/`, `seo/`, `research/`

### Feedback Capture
After presenting output, always end with:
"Want to change anything? If you give feedback, I'll apply it and add a lesson to your business's lessons.md so I remember next time."

---

## Path References

| What | Path |
|------|------|
| Business profile | `[active-business]/brand.md` |
| Business lessons | `[active-business]/lessons.md` |
| Business audiences | `[active-business]/audiences/` |
| Content ideas bank | `[active-business]/content-ideas.md` |
| Browser helpers | `system/tools/browser-helpers/` |
| All output | `[active-business]/output/` |
| Headline formulas | `system/references/headline-types.md` |
| Hook formulas | `system/references/hook-types.md` |
| Email types | `system/references/email-types.md` |
| Social post types | `system/references/social-post-types.md` |
| Integration guide | `system/config/integrations.md` |
| Business template | `system/business-template/` |

---

## Hard Rules

1. **No fabrication.** Never invent statistics, testimonials, results, or story details. Use `[PLACEHOLDER]` if info is missing.
2. **No em dashes.** Zero. Replace with periods, commas, colons, or parentheticals.
3. **Grade 8 or lower** reading level for all content.
4. **Conversational tone.** Like talking to a friend, not writing a press release.
5. **Never publish/send** without explicit user confirmation.
6. **AskUserQuestion** for all decisions. This works in both Code and Cowork mode.
7. **No internal references.** Never mention Wilco, GOR, GrowOnRepeat, MarketingOS, emarky.
8. **Support any business type.** Skills should work for coaches, e-commerce, SaaS, agencies, freelancers, etc.
9. **Humanizer mandatory.** All content skills reference `/humanize` before presenting output.
10. **Feedback loop.** After presenting output, ask for feedback. If given, apply AND add to lessons.md.

---

## Writing Style for Skill Files

- Use markdown headers for steps
- Keep instructions direct and actionable
- Include example formats/templates where helpful
- Reference other skills by name (e.g., "Run `/humanize`") not by path
- Use `[active-business]` as placeholder for the business folder name
- Today's date: use `!date +%Y-%m-%d` (Claude resolves this at runtime)

---

## Skill Categories

Skills are organized into categories for future modularity. Each skill stays in its own flat folder under `.claude/skills/`, but belongs to a category.

| Category | Skills | Purpose |
|----------|--------|---------|
| **Core** | `setup`, `interview`, `skill-creator`, `strategist`, `content-brainstorm` | Onboarding, configuration, meta-tools |
| **Writing** | `newsletter-write`, `newsletter-publish`, `article-write`, `social-write`, `social-plan`, `social-publish`, `vsl-write`, `landing-page`, `email-sequence`, `lead-magnet`, `offer-create` | Content creation and publishing |
| **Video** | `video-edit`, `video-finalize`, `video-animate`, `video-subtitle`, `youtube-prepare`, `youtube-publish`, `youtube-thumbnail` | Video production, editing, and YouTube |
| **Visual** | `visual-carousel`, `visual-image` | Static visual content |
| **Ads** | `ads-create-fb`, `check-fb-compliance` | Paid advertising |
| **Research** | `research-competitor`, `watch-competitors`, `website-audit`, `ai-seo` | Competitive intelligence and analysis |
| **Quality** | `copy-humanize`, `check-readability`, `check-deliverability`, `check-friction` | Content quality gates |
| **Repurpose** | `repurpose` | Turn one piece of content into multiple formats |
| **System** | `update`, `merge` | Updates, maintenance, and integration |

When building new skills, assign them to a category. If no category fits, propose a new one.

---

## Cowork Compatibility

Some skills work in Cowork mode (no file access). Mark these by NOT requiring file saves as the primary output. Content skills that can work in Cowork mode: newsletter-write, social-write, article-write, vsl-write, interview, strategist, humanize, check-readability, check-friction, offer-create, lead-magnet, repurpose.

For Cowork-compatible skills: present the output in chat as the primary delivery, with file saving as an optional step.
