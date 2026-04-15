---
name: social-publish
description: "Schedule social posts via PostSyncer API, or format them for manual copy-paste if no API is configured."
argument-hint: "[platform or 'all']"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Social Publish

**Purpose:** Take ready-to-publish social posts and either schedule them via PostSyncer API or present them in copy-paste format for manual posting.
**When to use:** When you have written posts and want to schedule or publish them.
**Cowork compatible:** Partially. Manual fallback works in Cowork mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice (for any last-minute checks)
2. `brands/[active-brand]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Check PostSyncer Configuration

Look for `POSTSYNCER_API_KEY` in the project `.env` file.

- **If found:** PostSyncer is configured. API scheduling is available.
- **If not found:** Guide the user to `system/config/integrations.md` for setup instructions. Continue with the manual fallback workflow (Step 7).

---

## Step 2 — Find Posts to Publish

Check `brands/[active-brand]/output/social/` for recent post files that are not yet marked as scheduled.

Look for posts in platform subfolders:
- `output/social/twitter/` or `output/social/x/`
- `output/social/linkedin/`
- `output/social/facebook/`
- `output/social/instagram/`

Also check `output/social/plans/` for weekly plans with unscheduled posts.

**If posts are found:** Show a summary: "[N] unscheduled posts found across [platforms]. Want to schedule all of them, or pick specific ones?"

**If no posts found:** Ask the user to paste the posts directly, or run `/social-write` first.

---

## Step 3 — Confirm Details for Each Post

For each post, confirm:

1. **Platform:** X, LinkedIn, Facebook, or Instagram
2. **Scheduled date/time:** When to publish (suggest optimal times if not specified)
3. **Media attachments:** Any images, carousels, or videos to include

If posts came from a weekly plan, use the dates from the plan. Ask: "The plan has these dates. Want to keep them or adjust?"

---

## Step 4 — Show Preview

Present a clear preview of everything that will be scheduled:

```
--- Schedule Preview ---

1. X — Mon Mar 17, 9:00 AM
   [First 80 chars of post...]

2. LinkedIn — Mon Mar 17, 11:00 AM
   [First 80 chars of post...]

3. X — Tue Mar 18, 9:00 AM
   [First 80 chars of post...]

Total: [N] posts across [N] platforms
```

---

## Step 5 — Get Confirmation

Ask explicitly: **"Ready to schedule [N] posts? (yes/no)"**

Do NOT proceed without a clear yes. If the user wants changes, go back to Step 3.

---

## Step 6 — Schedule via PostSyncer API

**Only if PostSyncer is configured (Step 1 passed).**

For each post:
1. Call the PostSyncer API to create a scheduled post
2. Include platform, content, scheduled time, and any media
3. Report success or failure for each post

After scheduling, show a summary:
```
Scheduled [N]/[N] posts successfully.
- [N] on X
- [N] on LinkedIn
- [N] on Facebook
```

Then proceed to Step 8.

---

## Step 7 — Manual Fallback

**If PostSyncer is NOT configured**, present all posts in a clean copy-paste format, organized by platform and date:

```
=== X (Twitter) ===

DATE: Monday, March 17 — 9:00 AM
---
[Full post content]
---
Media: [Image description or "None"]

DATE: Tuesday, March 18 — 9:00 AM
---
[Full post content]
---
Media: [Image description or "None"]


=== LinkedIn ===

DATE: Monday, March 17 — 11:00 AM
---
[Full post content]
---
Media: [Image description or "None"]
```

Tell the user: "No PostSyncer API configured. Here are your posts formatted for manual scheduling. You can set up PostSyncer in `system/config/integrations.md` for automatic scheduling next time."

---

## Step 8 — Mark Posts as Scheduled

Update the post files to mark them as scheduled. Add to the top of each file:

```
status: scheduled
scheduled-date: YYYY-MM-DD HH:MM
platform: [platform]
```

If the posts came from a weekly plan file, mark the relevant entries as scheduled in that plan.

---

## Feedback Capture

After completing, ask: "Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
