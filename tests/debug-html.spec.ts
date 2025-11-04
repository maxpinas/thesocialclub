import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('debug HTML structure of source references', async ({ page }) => {
  await page.goto('http://localhost:3000/summary', { waitUntil: 'networkidle' });
  await page.waitForSelector('.prose', { timeout: 10000 });

  // Get the HTML of the section with the problematic references
  const html = await page.evaluate(() => {
    // Find all list items
    const lis = Array.from(document.querySelectorAll('li'));
    const problematic: string[] = [];

    lis.forEach((li, index) => {
      const text = li.textContent?.trim() || '';
      const html = li.innerHTML;

      // Check if it's a standalone source reference
      if (text.match(/^\s*•?\s*\[\d+\]\s*\.?\s*$/) || text.length < 20) {
        console.log(`LI ${index}: "${text}"`);
        console.log(`HTML: ${html}`);
        problematic.push(`<li>${html}</li>`);
      }
    });

    return {
      problematicCount: problematic.length,
      problematicItems: problematic,
      allHTML: document.querySelector('.prose')?.innerHTML.substring(0, 5000)
    };
  });

  console.log('=== PROBLEMATIC LIST ITEMS ===');
  console.log(`Found ${html.problematicCount} problematic list items`);
  html.problematicItems.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item}`);
  });

  console.log('\n=== FIRST 5000 CHARS OF HTML ===');
  console.log(html.allHTML);

  // Save to file for inspection
  fs.writeFileSync('/workspaces/thesocialclub/tests/debug-output.txt', JSON.stringify(html, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/workspaces/thesocialclub/tests/debug-screenshot.png', fullPage: true });

  if (html.problematicCount > 0) {
    throw new Error(`Found ${html.problematicCount} standalone source reference list items!`);
  }
});
