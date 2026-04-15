/**
 * Basic stealth configuration for Playwright.
 * Applies anti-detection measures to browser contexts.
 *
 * Usage:
 *   const { chromium } = require('playwright');
 *   const stealth = require('./system/tools/browser-helpers/playwright-stealth.js');
 *
 *   const browser = await chromium.launch({ headless: false });
 *   const context = await browser.newContext();
 *   await stealth.applyStealthConfig(browser, context);
 *   const page = await context.newPage();
 */

// ---------------------------------------------------------------------------
// User agent pool (real Chrome UAs for Mac and Windows, updated regularly)
// ---------------------------------------------------------------------------

const USER_AGENTS = [
  // Chrome on macOS
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  // Chrome on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  // Chrome on Linux
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
]

// ---------------------------------------------------------------------------
// Viewport pool (common real screen resolutions)
// ---------------------------------------------------------------------------

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1366, height: 768 },
  { width: 2560, height: 1440 },
  { width: 1680, height: 1050 },
  { width: 1280, height: 800 },
  { width: 1600, height: 900 },
]

// ---------------------------------------------------------------------------
// Timezone and locale pools
// ---------------------------------------------------------------------------

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Australia/Sydney',
]

const LOCALES = ['en-US', 'en-GB', 'en-AU', 'en-CA']

// ---------------------------------------------------------------------------
// Platform/vendor combos (must match user agent)
// ---------------------------------------------------------------------------

const getPlatformForUA = (ua) => {
  if (ua.includes('Macintosh')) return { platform: 'MacIntel', vendor: 'Google Inc.' }
  if (ua.includes('Windows')) return { platform: 'Win32', vendor: 'Google Inc.' }
  if (ua.includes('Linux')) return { platform: 'Linux x86_64', vendor: 'Google Inc.' }
  return { platform: 'Win32', vendor: 'Google Inc.' }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min))

// Add slight jitter to viewport dimensions (+/- a few pixels for uniqueness)
const jitterViewport = (vp) => ({
  width: vp.width + randInt(-10, 11),
  height: vp.height + randInt(-10, 11),
})

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Apply stealth measures to a Playwright browser context.
 *
 * Call this AFTER creating the context but BEFORE creating pages.
 * Alternatively, use getStealthContextOptions() to get options you can
 * pass directly to browser.newContext().
 *
 * @param {import('playwright').Browser} browser - The Playwright browser instance
 * @param {import('playwright').BrowserContext} context - The browser context to configure
 */
async function applyStealthConfig(browser, context) {
  const ua = pick(USER_AGENTS)
  const { platform, vendor } = getPlatformForUA(ua)

  // Inject stealth scripts into every new page in this context
  await context.addInitScript({
    content: `
      // Override navigator.webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Override navigator.platform
      Object.defineProperty(navigator, 'platform', {
        get: () => '${platform}',
      });

      // Override navigator.vendor
      Object.defineProperty(navigator, 'vendor', {
        get: () => '${vendor}',
      });

      // Override navigator.plugins (empty array looks suspicious)
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          const plugins = [
            { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
            { name: 'Native Client', filename: 'internal-nacl-plugin' },
          ];
          plugins.length = 3;
          return plugins;
        },
      });

      // Override navigator.languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Fix chrome runtime (headless detection)
      if (!window.chrome) {
        window.chrome = {};
      }
      if (!window.chrome.runtime) {
        window.chrome.runtime = {};
      }

      // Override permissions query
      const originalQuery = window.navigator.permissions?.query;
      if (originalQuery) {
        window.navigator.permissions.query = (params) => {
          if (params.name === 'notifications') {
            return Promise.resolve({ state: Notification.permission });
          }
          return originalQuery(params);
        };
      }

      // Mask automation-related properties
      delete navigator.__proto__.webdriver;
    `,
  })
}

/**
 * Get context options with stealth settings baked in.
 * Use this when creating a new context:
 *
 *   const opts = stealth.getStealthContextOptions();
 *   const context = await browser.newContext(opts);
 *   await stealth.applyStealthConfig(browser, context);
 *
 * @returns {Object} Options to pass to browser.newContext()
 */
function getStealthContextOptions() {
  const ua = pick(USER_AGENTS)
  const viewport = jitterViewport(pick(VIEWPORTS))
  const timezone = pick(TIMEZONES)
  const locale = pick(LOCALES)

  return {
    userAgent: ua,
    viewport,
    timezoneId: timezone,
    locale,
    // Realistic screen size (slightly larger than viewport)
    screen: {
      width: viewport.width + randInt(0, 200),
      height: viewport.height + randInt(100, 300),
    },
    // Disable the "controlled by automation" bar
    ignoreHTTPSErrors: true,
    // Realistic color scheme
    colorScheme: 'light',
  }
}

module.exports = {
  applyStealthConfig,
  getStealthContextOptions,
  USER_AGENTS,
  VIEWPORTS,
  TIMEZONES,
}
