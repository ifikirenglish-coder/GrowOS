---
name: newsletter-publish
description: "Publish a newsletter draft to your email platform (Kit, Mailchimp, Gmail) or format it for manual copy-paste."
argument-hint: "[draft name or 'latest']"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Newsletter Publish

**Purpose:** Take a finished newsletter draft and publish it to your email platform, or format it for manual sending.
**When to use:** When you have a reviewed, approved newsletter draft ready to send.
**Cowork compatible:** Partially. Manual fallback works in Cowork mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice (for final review)
2. `[active-business]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Find the Newsletter Draft

Check `[active-business]/output/newsletters/drafts/` for recent draft files.

- **If drafts found:** Show the most recent one(s) with subject lines. Ask: "I found these drafts. Which one do you want to publish?"
- **If the user specified a draft:** Load that file directly.
- **If no drafts found:** Ask the user to paste the newsletter content, or run `/newsletter-write` first.

---

## Step 2 — Final Review

Show the full draft with:
- **Subject line**
- **Preview text** (first line or explicitly set preview)
- **Full email body**

Ask: **"Here's the newsletter for final review. Does everything look good, or do you want to make changes before publishing?"**

If changes are requested, apply them first.

---

## Step 3 — Get Confirmation

Ask explicitly: **"Ready to publish this newsletter? (yes/no)"**

Do NOT proceed without a clear yes.

---

## Step 4 — Detect Email Platform

Check for available email platforms in this order:

1. **Kit/ConvertKit:** Check if Kit MCP tools are available (kit_create_broadcast). If available, use Kit.
2. **Gmail:** Check if Gmail MCP tools are available (gmail_create_draft). If available, use Gmail.
3. **Environment config:** Check `.env` for `EMAIL_PLATFORM` setting.
4. **No platform detected:** Fall back to manual format (Step 5d).

Tell the user which platform was detected: "I see you have [Kit/Gmail/etc.] connected. I'll create the broadcast there."

---

## Step 5 — Publish Based on Platform

### Step 5a — Kit (ConvertKit)

1. Create a broadcast draft using the Kit MCP `kit_create_broadcast` tool
2. Set the subject line, preview text, and email content
3. The broadcast is created as a **draft** in Kit (not sent immediately)
4. Tell the user: "Newsletter created as a draft in Kit. Log into Kit to review and send it."

### Step 5b — Mailchimp

1. Use the Mailchimp API to create a campaign draft
2. Set subject, preview text, from name, and HTML content
3. Tell the user: "Campaign created as a draft in Mailchimp. Log in to review and send."

### Step 5c — Gmail

1. Create a draft using the Gmail MCP `gmail_create_draft` tool
2. Set subject and body content
3. Tell the user: "Draft created in Gmail. Open Gmail to add recipients and send."

### Step 5d — Manual Fallback

If no email platform is connected, present the newsletter in a clean copy-paste format:

```
SUBJECT: [Subject line]
PREVIEW TEXT: [Preview/preheader text]
---

[Full email content, formatted and ready to paste]

---
Notes:
- Paste this into your email platform's editor
- Set the subject line and preview text as shown above
- Preview before sending to check formatting
```

Tell the user: "No email platform connected. Here's your newsletter formatted for copy-paste. You can set up an integration in `system/config/integrations.md`."

---

## Step 6 — File Management

After publishing or formatting:

1. **Move the draft** from `[active-business]/output/newsletters/drafts/` to `[active-business]/output/newsletters/sent/`
2. **Rename the file** to include the send date: `YYYY-MM-DD-[slug].md`
3. **Update sent-index.md** in `[active-business]/output/newsletters/`. Create the file if it doesn't exist.

Add an entry to sent-index.md:

```markdown
| YYYY-MM-DD | [Subject line] | [Email type] | [Platform used] |
```

If sent-index.md is new, create it with a header:

```markdown
# Sent Newsletters

| Date | Subject | Type | Platform |
|------|---------|------|----------|
| YYYY-MM-DD | [Subject line] | [Email type] | [Platform] |
```

---

## Step 7 — Confirm

Summarize what happened:

"Newsletter '[subject line]' has been [created as a draft in Kit / formatted for copy-paste / created as a Gmail draft]. Moved to sent/ folder and updated sent-index.md."

---

## Feedback Capture

After completing, ask: "Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."
