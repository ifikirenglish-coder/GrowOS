# Integrations Setup Guide

GrowOS works standalone, but connects to external tools for publishing and automation.

---

## Email Platform (Kit, Mailchimp, etc.)

### Option A: Claude Desktop Connectors (recommended)
1. Open Claude Desktop settings
2. Go to "Connectors" or "Integrations"
3. Search for your email platform (Kit, Gmail, etc.)
4. Click "Connect" and authorize
5. The `/newsletter-publish` skill will auto-detect the connection

### Option B: Manual API Key
1. Get your API key from your email platform's settings
2. Create a `.env` file in the GrowOS root folder:
   ```
   EMAIL_API_KEY=your-api-key-here
   EMAIL_PLATFORM=kit
   ```
3. Tell Claude: "My email platform is [Kit/Mailchimp/etc] and my API key is configured"

**Supported platforms:** Kit (ConvertKit), Mailchimp, Beehiiv, Substack (manual copy/paste)

---

## Social Media Publishing (PostSyncer)

PostSyncer lets you schedule posts to multiple platforms from one place.

1. Sign up at postsyncer.com
2. Connect your social accounts (X, LinkedIn, Facebook, Instagram)
3. Get your API key from PostSyncer settings
4. Add to `.env`:
   ```
   POSTSYNCER_API_KEY=your-api-key-here
   ```
5. The `/social-publish` skill will use this to schedule posts

**Alternative:** If you don't use PostSyncer, `/social-write` creates ready-to-copy posts you can paste manually into each platform.

---

## Gmail (for email drafting)

### Option A: Claude Desktop Connectors
1. Open Claude Desktop settings
2. Connect Google/Gmail
3. The `/draft-email` skill (if you add it) will create drafts directly in Gmail

### Option B: Manual .mcp.json
Create `.mcp.json` in the GrowOS root:
```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-gmail"]
    }
  }
}
```

---

## Remotion (Video Animations)

See `system/config/remotion-setup.md` for full installation guide.

Required for: `/video-animate`, `/visual-carousel`, `/visual-image`

Not required for: All other skills (text-based content works without Remotion)

---

## Browser Automation (Advanced)

For skills that interact with websites (scraping, publishing):

### Mac: Playwriter Chrome Extension
1. Install the Playwriter Chrome extension
2. It connects to Claude through MCP
3. Skills that need browser access will use it automatically

### Windows: Manual Browser Actions
Skills that need browser access will provide step-by-step instructions you can follow manually. No extension needed.

### Alternative: No Browser Automation
All content creation skills work without browser automation. Only publishing and scraping skills need it, and they all have manual fallbacks.

---

## Image Generation (kie.ai)

For skills that generate images (`/visual-image`, `/youtube-thumbnail`, `/ads-create-fb`):

### Recommended: kie.ai MCP Server

kie.ai gives you access to multiple AI image generators (Google Nano Banana Pro, Flux, Midjourney, and more) through one API key. Skills will auto-detect it and generate images directly.

**Setup:**

1. Get a free API key at [kie.ai](https://kie.ai) (sign up, go to Settings > API Keys)
2. Add kie.ai to your `.mcp.json` file in the GrowOS root folder:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright@latest"]
    },
    "kie-ai": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. Restart Claude Code (close and reopen) so it picks up the new MCP server
4. Test by saying "generate a test image" or running `/visual-image`

**Available models through kie.ai:**
- Google Nano Banana Pro (fast, good quality, recommended default)
- Flux (high quality)
- Midjourney (premium quality)
- And more (DALL-E, Ideogram, etc.)

### Fallback: Manual Creation
If kie.ai is not configured, skills will provide detailed image briefs (dimensions, colors, text, layout) that you can create in Canva, Figma, or any design tool.

---

## What You Need to Get Started

**Minimum (free):** Just Claude Desktop + GrowOS folder. All content creation works.

**Recommended additions:**
- Email platform (Kit free plan works) for `/newsletter-publish`
- PostSyncer or manual posting for `/social-publish`

**Power user:**
- Remotion for video/carousel/image generation
- Browser automation for publishing workflows
- Image generation API for thumbnails and social images
