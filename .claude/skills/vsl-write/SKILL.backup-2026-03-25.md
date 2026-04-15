---
name: vsl-write
description: "Write Video Sales Letter scripts with proven structure. From offer details through teleprompter-ready script with shot notes."
argument-hint: "[offer or product name]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# VSL Write

**Purpose:** Create persuasive Video Sales Letter scripts that convert. Follows a proven structure and outputs a teleprompter-ready script with shot list notes.
**When to use:** Product launches, sales pages with video, webinar pitches, course promos.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Context Loading

Load these files before starting:
- `brands/[active-brand]/voice.md`
- `brands/[active-brand]/lessons.md`
- `system/references/hook-types.md`
- `system/references/headline-types.md`

To identify the active brand: check if CLAUDE.md lists an active brand. If multiple brands exist and none is specified, ask the user which brand they're working on.

---

## Step 1 — Load Offer Details

Check `brands/[active-brand]/output/offers/` for existing offer documents.

**If offer found:** Load it and confirm: "I found your offer document for [name]. I'll use this as the foundation. Anything changed since you wrote this?"

**If no offer found:** Ask using AskUserQuestion:
1. "What are you selling? (product, service, course, program, etc.)"
2. "Who is it for? (be specific about the person, not just demographics)"
3. "What's the price point?"
4. "What's the main transformation or result someone gets?"
5. "What makes this different from alternatives?"

Load the target audience from `brands/[active-brand]/audiences/` if available.

---

## Step 2 — Interview for Proof and Stories

Use AskUserQuestion to gather ammunition for the script:

1. "What's the best result a customer has gotten? Be specific with numbers or outcomes."
2. "What objections do people have before buying? List the top 3."
3. "Do you have a personal story about why you created this? What problem were you solving?"
4. "What happens if someone does nothing? What does their situation look like in 6-12 months?"
5. "Any testimonials or case studies I can reference? Even informal ones."
6. "What's included in the offer? List every component and its value."

Never fabricate proof points. If the user doesn't have testimonials or results, note `[PLACEHOLDER: add testimonial here]` in the script.

---

## Step 3 — Write 3 Hook Variants

Using `system/references/hook-types.md`, write 3 different hooks (first 30-60 seconds of the VSL), each taking a different emotional angle:

**Hook A — Pain-led:** Opens with the problem the viewer is experiencing right now.
**Hook B — Curiosity-led:** Opens with a surprising claim, counterintuitive insight, or bold statement.
**Hook C — Result-led:** Opens with a specific outcome or transformation.

Present all three and ask: "Which hook feels most like you? Or should I combine elements from multiple?"

---

## Step 4 — Write Complete VSL Script

Using the chosen hook, write the full script following this structure:

### 1. Hook (0:00-0:30)
The approved hook. Grab attention in the first 5 seconds. State who this is for.

### 2. Problem (0:30-2:00)
Describe the problem in vivid, specific terms. Use the audience's own language. Show you understand their world.

### 3. Agitation (2:00-3:30)
Twist the knife. What happens if they don't solve this? What are the hidden costs? Make the status quo feel unacceptable.

### 4. Solution Introduction (3:30-5:00)
Introduce the solution. Not the product yet. The approach, the method, the discovery. Build credibility.

### 5. Proof (5:00-7:00)
Stack proof: personal story, customer results, logic, data, testimonials. Each proof point builds on the last.

### 6. Product Reveal (7:00-9:00)
Now introduce the product. Walk through what's included. Frame each component as solving a specific sub-problem.

### 7. Offer Stack (9:00-10:00)
Stack the value. List components with their individual value, then reveal the actual price. Make the gap between value and price obvious.

### 8. Objection Handling (10:00-11:00)
Address the top 2-3 objections directly. "You might be thinking..." format.

### 9. Guarantee (11:00-11:30)
State the guarantee clearly. Remove remaining risk.

### 10. Close (11:30-12:00)
Final CTA. Remind them of the transformation. Create urgency (only if genuine). Tell them exactly what to do next.

**Writing rules:**
- Conversational. Write for the ear, not the eye.
- Short sentences. One thought per sentence.
- No em dashes.
- Grade 8 or lower reading level.
- Match the brand voice from voice.md.
- No fabricated claims. `[PLACEHOLDER]` where proof is missing.

---

## Step 5 — Add Shot List Notes

Insert production notes throughout the script in brackets:

- `[SHOW: product demo / dashboard / results screenshot]`
- `[CUT TO: testimonial clip from [name]]`
- `[B-ROLL: person struggling with [problem]]`
- `[TEXT ON SCREEN: "[key stat or quote]"]`
- `[SHOW: offer stack graphic]`
- `[SHOW: guarantee badge]`

These help the video editor or the speaker know what visuals to plan.

---

## Step 6 — Quality Gate

Run `/humanize` on the complete script before presenting it.

Check for and fix:
- Overly polished transitions (real speech is slightly rougher)
- Marketing-speak that doesn't match how the person actually talks
- Robotic rhythm (vary sentence length dramatically)
- AI tells: rule of three, negative parallelisms, "In today's world..."
- Sentences that are hard to read aloud (test by reading each line)

---

## Step 7 — Format for Teleprompter

Present the final script with teleprompter formatting:

- **Short paragraphs** (1-2 sentences each, never more than 3)
- **Bold key phrases** the speaker should emphasize
- **[PAUSE]** markers where the speaker should breathe or let a point land
- **[SLOW]** markers for important sentences to deliver slowly
- Shot notes inline in brackets
- Section headers with approximate timestamps

Include at the top:
```
Total estimated length: ~[X] minutes
Reading speed: ~150 words/minute (conversational pace)
Word count: [X]
```

---

## Step 8 — Save Output

Save to `brands/[active-brand]/output/video/YYYY-MM-DD-vsl-slug.md`

The file should include:
- Script metadata (length, word count, offer name)
- All 3 hook variants (mark the chosen one)
- Complete teleprompter-formatted script with shot notes

---

## Feedback Capture

After presenting the script:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the script
2. Add the lesson to `brands/[active-brand]/lessons.md` under the appropriate section
3. Show the updated version
