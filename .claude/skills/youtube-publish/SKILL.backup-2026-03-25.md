---
name: youtube-publish
description: "Prepare the full YouTube publishing package. Description, chapters, tags, pinned comment, community post, and shorts concept."
argument-hint: "[video title or folder name]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# YouTube Publish

**Purpose:** Create everything needed to publish a YouTube video: optimized description, chapters, tags, pinned comment, community post, and shorts concept.
**When to use:** When a video is filmed/edited and ready to upload.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — brand voice and social links
2. `brands/[active-brand]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Load Video Script/Brief

Check `brands/[active-brand]/output/youtube/` for recent video prep work.

**If a script exists:** Load `script.md` and `production-brief.md` from the relevant folder.

**If no script exists:** Ask the user:
- What is the video about? (topic, key points covered)
- How long is the video?
- What are the main sections/timestamps?
- Any links or resources mentioned in the video?
- What's the CTA?

---

## Step 2 — Write YouTube Description

Structure the description carefully. The first 2 lines are visible before "Show more" and must hook.

```
[Line 1: Hook sentence that makes people want to read more]
[Line 2: What the viewer will learn or get from this video]

---

[Paragraph expanding on the topic. 2-3 sentences. Include the main keyword naturally.]

---

CHAPTERS:
[Generated in Step 3]

---

LINKS MENTIONED:
- [Resource name]: [URL]
- [Resource name]: [URL]

---

ABOUT:
[Short brand bio from voice.md. Who you are, what you do, who you help. 2-3 sentences.]

CONNECT:
[Social media links from voice.md]

---

TAGS: [for internal reference only, don't include in actual description]
```

Key rules:
- Front-load keywords in the first 2 lines
- No em dashes
- Keep it scannable with clear sections
- Include relevant links (mentioned in video + social profiles)

---

## Step 3 — Generate Chapters

If the script has clear sections, create timestamp chapters:

- First chapter must start at `0:00`
- Each chapter needs a descriptive title (not just "Point 1")
- Minimum 3 chapters, aim for 5-8 for longer videos
- Keep chapter titles under 50 characters

If the video isn't edited yet, create placeholder chapters based on the script outline and note:
"Update the timestamps after editing. The section names are ready."

---

## Step 4 — Generate Tags

Write 15-20 tags, mixing:

- **Broad tags** (3-5): the general topic area
- **Specific tags** (5-8): exact phrases someone might search
- **Long-tail tags** (3-5): question-style or niche phrases
- **Brand tag** (1-2): your channel name or brand name

Rules:
- No irrelevant or misleading tags
- Put the most important tags first
- Include variations (singular/plural, different word orders)

---

## Step 5 — Write Pinned Comment

Write a pinned comment that starts a conversation:

- **Ask a specific question** related to the video content (not generic "What did you think?")
- Or **add a bonus tip** that wasn't in the video
- Or **share a resource** mentioned in the video

Keep it to 2-3 sentences max. The goal is to boost engagement by giving people something specific to respond to.

---

## Step 6 — Write Community Post

Write a community post announcing the video:

- Short and punchy (2-4 sentences)
- Create curiosity about the video without spoiling it
- Include a question or poll if appropriate
- Match brand voice

---

## Step 7 — Create Shorts Concept

Identify the best 30-60 second clip from the video for a YouTube Short:

```markdown
## Shorts Concept

**Clip from:** [Which section of the video]
**Timestamp range:** [approximate start - end]
**Why this works as a Short:** [1 sentence]

**Hook (first 3 seconds):** [What the viewer sees/hears immediately]
**Core content:** [What the clip delivers]
**CTA:** [Subscribe / Watch full video / Comment]

**Caption:** [Short description for the Shorts feed]
**Hashtags:** [3-5 relevant hashtags]
```

If the video has multiple potential Short clips, list 2-3 ranked by potential.

---

## Step 8 — Present for Review

Show everything in a clean format:

1. **Title** (confirm the final title)
2. **Description** (full, formatted)
3. **Chapters** (with placeholder timestamps if needed)
4. **Tags** (comma-separated list)
5. **Pinned comment**
6. **Community post**
7. **Shorts concept**

---

## Step 9 — Save

Save to: `brands/[active-brand]/output/youtube/YYYY-MM-DD-slug/`

Create:
- `publish-package.md` — everything in one file (description, chapters, tags, pinned comment, community post, shorts concept)

If a `youtube-prepare` output already exists for this video, save into that same dated folder.

---

## Feedback Capture

After presenting the package:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md` under the YouTube section
3. Present the updated version
