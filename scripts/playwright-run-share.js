const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    console.log('PAGE CONSOLE:', msg.type(), msg.text());
  });

  // capture network requests/responses to /api/sessions/share
  const networkLogs = [];
  page.on('requestfinished', async req => {
    try {
      const url = req.url();
      if (url.includes('/api/sessions/share')) {
        const res = await req.response();
        const status = res.status();
        const body = await res.text();
        networkLogs.push({ url, status, body });
        console.log('NET:', url, status, body);
      }
    } catch (e) {
      console.error('net log err', e);
    }
  });

  await page.goto('http://localhost:3000');

  // Attempt to find a share button in the page. Adjust selector as needed
  const possibleSelectors = [
    'button[data-testid="share-button"]',
    'button:has-text("Share")',
    'button:has-text("share")',
    'text=Share',
  ];

  let clicked = false;
  for (const sel of possibleSelectors) {
    const el = await page.$(sel);
    if (el) {
      await el.click();
      clicked = true;
      break;
    }
  }

  // If no share UI button found, try opening Activity Manager and clicking share inside
  if (!clicked) {
    console.log('Share button not found with simple selectors; trying to open main UI and trigger share via API directly');
    // Attempt to post directly to API as fallback
    const res = await page.request.post('http://localhost:3000/api/sessions/share', {
      data: {
        plannedTime: 3600,
        timeSpent: 3550,
        overtime: 0,
        idleTime: 50,
        activities: [{ id: 'a1', name: 'Task 1', duration: 1800, colorIndex: 1 }],
        skippedActivities: [],
        timelineEntries: [],
        completedAt: new Date().toISOString(),
        sessionType: 'completed',
      }
    });
    const body = await res.text();
    console.log('Direct API POST status', res.status(), body);
    networkLogs.push({ url: 'direct-post', status: res.status(), body });
  }

  // Wait a bit for any network activity
  await page.waitForTimeout(500);

  const out = { consoleMessages, networkLogs };
  fs.writeFileSync('playwright-share-result.json', JSON.stringify(out, null, 2), 'utf-8');

  await browser.close();
  console.log('Done. Results written to playwright-share-result.json');
})();
