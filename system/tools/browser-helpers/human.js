/**
 * Human behavior simulation for Playwright browser automation.
 * Version: 1.0.0
 *
 * Usage with Playwright:
 *   const { chromium } = require('playwright');
 *   const { initHuman } = require('./system/tools/browser-helpers/human.js');
 *
 *   const browser = await chromium.launch({ headless: false });
 *   const context = await browser.newContext();
 *   const page = await context.newPage();
 *   const human = initHuman(page);
 *
 * Then use human.* for all interactions on external sites:
 *   await human.click(locator)
 *   await human.type(locator, 'text')
 *   await human.scroll()
 *   await human.wait('between')
 *   human.track('twitter', 'like')
 */

const VERSION = '1.0.0'

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

/** Random int between min (inclusive) and max (exclusive) */
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min))

/** Random float between min and max */
const randFloat = (min, max) => min + Math.random() * (max - min)

/**
 * Log-normal-ish delay. Produces values clustered around the low end
 * with occasional longer pauses — matches real human timing distributions.
 */
const logNormalDelay = (median, sigma = 0.4) => {
  // Box-Muller transform for normal distribution
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return Math.max(100, Math.round(median * Math.exp(sigma * z)))
}

// ---------------------------------------------------------------------------
// Bezier curve for mouse paths
// ---------------------------------------------------------------------------

/**
 * Compute a point on a cubic Bezier curve at parameter t (0-1).
 * P0 = start, P1/P2 = control points, P3 = end.
 */
const bezierPoint = (t, p0, p1, p2, p3) => {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

/**
 * Generate a human-like mouse path from (x0, y0) to (x1, y1).
 * Returns array of {x, y} points along a cubic Bezier with random control points.
 */
const generateMousePath = (x0, y0, x1, y1) => {
  const dist = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
  if (dist < 1) return [{ x: x1, y: y1 }]

  // More points for longer distances
  const numPoints = Math.max(15, Math.min(60, Math.round(dist / 8)))

  // Direction vector perpendicular to the line (for control point offset)
  const dx = x1 - x0
  const dy = y1 - y0
  const perpX = -dy
  const perpY = dx

  // Control points: offset perpendicular to the line, with randomness
  const spread = Math.min(dist * 0.3, 120)
  const cp1Offset = randFloat(-spread, spread)
  const cp2Offset = randFloat(-spread, spread)

  const p0 = { x: x0, y: y0 }
  const p3 = { x: x1, y: y1 }
  const p1 = {
    x: x0 + dx * randFloat(0.2, 0.4) + perpX * cp1Offset / dist,
    y: y0 + dy * randFloat(0.2, 0.4) + perpY * cp1Offset / dist,
  }
  const p2 = {
    x: x0 + dx * randFloat(0.6, 0.8) + perpX * cp2Offset / dist,
    y: y0 + dy * randFloat(0.6, 0.8) + perpY * cp2Offset / dist,
  }

  const points = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    // Ease in/out: slow at start and end, fast in middle
    const eased = t < 0.5
      ? 2 * t * t
      : 1 - 2 * (1 - t) * (1 - t)
    const pt = bezierPoint(eased, p0, p1, p2, p3)
    // Add micro-jitter (hand tremor) — decreasing near the target
    const jitterScale = Math.max(0, 1 - t) * 2
    pt.x += randFloat(-jitterScale, jitterScale)
    pt.y += randFloat(-jitterScale, jitterScale)
    points.push(pt)
  }

  return points
}

// ---------------------------------------------------------------------------
// Rate limit tracker
// ---------------------------------------------------------------------------

const RATE_LIMITS = {
  twitter: { like: 100, tweet: 20, follow: 40, dm: 30, retweet: 50 },
  facebook: { like: 100, post: 5, comment: 40, friend_request: 20, share: 20 },
  linkedin: { like: 150, post: 3, comment: 100, connection: 50, message: 150, profile_view: 500 },
  instagram: { like: 200, follow: 50, unfollow: 50, comment: 40, dm: 30, story_view: 200 },
}

const WARN_THRESHOLD = 0.8

const createTracker = () => {
  const counts = {}

  return {
    track(platform, action) {
      const key = `${platform}:${action}`
      counts[key] = (counts[key] || 0) + 1

      const limits = RATE_LIMITS[platform]
      if (!limits || !limits[action]) return null

      const limit = limits[action]
      const count = counts[key]
      const pct = count / limit

      if (pct >= 1) {
        throw new Error(
          `RATE LIMIT: ${platform} ${action} limit reached (${count}/${limit}). ` +
          `Stop this action for today.`
        )
      }
      if (pct >= WARN_THRESHOLD) {
        return `WARNING: ${platform} ${action} at ${count}/${limit} (${Math.round(pct * 100)}%). Slow down.`
      }
      return null
    },

    status() { return { ...counts } },

    reset() { Object.keys(counts).forEach((k) => delete counts[k]) },
  }
}

// ---------------------------------------------------------------------------
// Helper: sleep (Playwright-compatible replacement for page.waitForTimeout)
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------------------------------------------------------------------------
// Self-test: runs on init to verify core functions work
// ---------------------------------------------------------------------------

const selfTest = () => {
  const errors = []

  // Test Bezier path generation
  const path = generateMousePath(0, 0, 100, 100)
  if (!Array.isArray(path) || path.length < 10) errors.push('Bezier path generation failed')
  if (path.length > 0) {
    const last = path[path.length - 1]
    if (Math.abs(last.x - 100) > 5 || Math.abs(last.y - 100) > 5) errors.push('Bezier path does not reach target')
  }

  // Test zero-distance path (edge case)
  const zeroPath = generateMousePath(50, 50, 50, 50)
  if (!Array.isArray(zeroPath)) errors.push('Zero-distance path failed')

  // Test log-normal delay produces reasonable values
  const delays = Array.from({ length: 20 }, () => logNormalDelay(1000, 0.4))
  if (delays.some(d => typeof d !== 'number' || d < 100)) errors.push('Log-normal delay produced invalid value')

  // Test rate limiter counting and reset
  const tracker = createTracker()
  tracker.track('twitter', 'like')
  tracker.track('twitter', 'like')
  const status = tracker.status()
  if (status['twitter:like'] !== 2) errors.push('Rate tracker count failed')
  tracker.reset()
  if (Object.keys(tracker.status()).length !== 0) errors.push('Rate tracker reset failed')

  // Test rate limit warning (track to 80% threshold)
  const tracker2 = createTracker()
  // Twitter like limit is 100, warn at 80 (80%)
  for (let i = 0; i < 80; i++) tracker2.track('twitter', 'like')
  const warning = tracker2.track('twitter', 'like') // 81st should warn
  if (!warning || !warning.includes('WARNING')) errors.push('Rate limiter did not warn at threshold')

  if (errors.length > 0) {
    throw new Error(`HUMAN HELPER SELF-TEST FAILED:\n${errors.join('\n')}`)
  }

  return true
}

// ---------------------------------------------------------------------------
// Main human behavior API
// ---------------------------------------------------------------------------

const initHuman = (page) => {
  // Run self-test on first init
  selfTest()

  let mouseX = randInt(400, 800)
  let mouseY = randInt(300, 500)
  const tracker = createTracker()

  const api = {
    /** Version string for debugging */
    version: VERSION,

    // ------ Mouse movement ------

    async moveTo(x, y) {
      const path = generateMousePath(mouseX, mouseY, x, y)
      for (const pt of path) {
        await page.mouse.move(pt.x, pt.y)
        if (Math.random() < 0.3) {
          await sleep(randInt(1, 4))
        }
      }
      mouseX = x
      mouseY = y
    },

    async click(locator, opts = {}) {
      const box = await locator.boundingBox()
      if (!box) {
        await locator.click()
        return
      }

      const targetX = box.x + box.width * randFloat(0.3, 0.7)
      const targetY = box.y + box.height * randFloat(0.3, 0.7)

      await api.moveTo(targetX, targetY)

      // Occasional overshoot (12% chance)
      if (Math.random() < 0.12) {
        const ox = targetX + randFloat(-25, 25)
        const oy = targetY + randFloat(-15, 15)
        await api.moveTo(ox, oy)
        await sleep(randInt(80, 200))
        await api.moveTo(targetX, targetY)
      }

      // Pre-click pause
      await sleep(randInt(50, 180))

      if (opts.double) {
        await page.mouse.dblclick(targetX, targetY)
      } else {
        await page.mouse.click(targetX, targetY, { button: opts.button || 'left' })
      }

      // Post-click pause
      await sleep(randInt(200, 600))
    },

    // ------ Typing ------

    async type(locator, text, opts = {}) {
      await api.click(locator)
      await sleep(randInt(150, 400))

      const baseDelay = opts.slow ? 100 : 50
      const delayRange = opts.slow ? 120 : 80

      for (let i = 0; i < text.length; i++) {
        const char = text[i]

        if (char === ' ') {
          await sleep(randInt(80, 280))
        }

        // Occasional typo (4% chance for natural text)
        if (opts.typos !== false && text.length > 10 && char.match(/[a-z]/i) && Math.random() < 0.04) {
          const wrongChar = String.fromCharCode(char.charCodeAt(0) + randInt(-2, 3))
          await page.keyboard.type(wrongChar, { delay: randInt(baseDelay, baseDelay + delayRange) })
          await sleep(randInt(150, 450))
          await page.keyboard.press('Backspace')
          await sleep(randInt(80, 250))
        }

        await page.keyboard.type(char, { delay: randInt(baseDelay, baseDelay + delayRange) })

        if (Math.random() < 0.02) {
          await sleep(randInt(300, 800))
        }
      }
    },

    async fill(locator, text) {
      await locator.fill(text)
    },

    // ------ Scrolling ------

    async scroll(opts = {}) {
      const times = opts.times || 1
      const distRanges = {
        short: [150, 300],
        medium: [300, 600],
        long: [500, 900],
      }
      const [minDist, maxDist] = distRanges[opts.distance || 'medium']

      for (let i = 0; i < times; i++) {
        const dist = randInt(minDist, maxDist)
        await page.mouse.wheel(0, dist)
        await sleep(logNormalDelay(2000, 0.5))

        // Occasional scroll-back (15% chance)
        if (Math.random() < 0.15) {
          await page.mouse.wheel(0, -randInt(40, 150))
          await sleep(randInt(600, 1500))
        }

        // Occasional long pause (8% chance, simulates reading)
        if (Math.random() < 0.08) {
          await sleep(randInt(4000, 12000))
        }

        // Occasional jitter (20% chance)
        if (Math.random() < 0.2) {
          await api.jitter()
        }
      }
    },

    async scrollTo(locator) {
      await locator.scrollIntoViewIfNeeded()
      await sleep(randInt(500, 1200))
      await page.mouse.wheel(0, randInt(-50, 80))
      await sleep(randInt(300, 800))
    },

    // ------ Waiting ------

    async wait(profile = 'between') {
      const delays = {
        glance: [300, 800],
        between: [800, 2500],
        read: [1500, 4500],
        think: [2500, 6000],
        rest: [5000, 15000],
        distracted: [10000, 30000],
      }
      const [min, max] = delays[profile] || delays.between
      await sleep(logNormalDelay((min + max) / 2, 0.4))
    },

    // ------ Focus simulation ------

    async jitter() {
      const moves = randInt(2, 5)
      for (let i = 0; i < moves; i++) {
        const nx = mouseX + randFloat(-4, 4)
        const ny = mouseY + randFloat(-4, 4)
        await page.mouse.move(nx, ny)
        mouseX = nx
        mouseY = ny
        await sleep(randInt(200, 700))
      }
    },

    async tabAway() {
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, writable: true })
        document.dispatchEvent(new Event('visibilitychange'))
      })
      await sleep(randInt(3000, 12000))
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: false, writable: true })
        document.dispatchEvent(new Event('visibilitychange'))
      })
      await sleep(randInt(400, 1000))
    },

    // ------ Rate limiting ------

    track(platform, action) {
      const warning = tracker.track(platform, action)
      if (warning) console.log(warning)
      return warning
    },

    trackStatus() { return tracker.status() },
    trackReset() { tracker.reset() },

    // ------ Navigation ------

    async goto(url) {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      // Playwright pages load faster than MCP browsers, but we still
      // want a realistic pause after navigation
      await sleep(randInt(2000, 5000))
    },

    // ------ Page management ------

    setPage(newPage) { page = newPage },
  }

  console.log(`[human.js v${VERSION}] loaded OK — self-test passed`)
  return api
}

module.exports = { initHuman, generateMousePath, logNormalDelay, randInt, randFloat, RATE_LIMITS, VERSION }
