import { test, expect } from '@playwright/test';

test.describe('Source References - Exact Issue Detection', () => {
  test('verify no source references appear as separate bullets or lines', async ({ page }) => {
    // Navigate with cache disabled
    await page.goto('http://localhost:3000/summary', { waitUntil: 'networkidle' });

    // Wait for content
    await page.waitForSelector('.prose', { timeout: 10000 });

    // Take initial screenshot
    await page.screenshot({
      path: '/workspaces/thesocialclub/tests/before-check.png',
      fullPage: true
    });

    // Get the full HTML content
    const content = await page.locator('.prose').innerHTML();
    console.log('First 2000 chars of content:', content.substring(0, 2000));

    // Check for the specific text pattern from the screenshot
    const bodyText = await page.locator('.prose').textContent();

    // Look for patterns like "travelers [3] ." or "roof [4] ." split across elements
    const sourceRefs = await page.locator('sup').all();

    for (const ref of sourceRefs) {
      const refText = await ref.textContent();

      // Check if this sup is inside a list item
      const isInListItem = await ref.evaluate((el) => {
        return el.closest('li') !== null;
      });

      if (isInListItem) {
        // Get the list item's full text
        const li = await ref.evaluateHandle((el) => el.closest('li'));
        const liText = await li.evaluate((el: Element) => el.textContent?.trim());

        console.log(`Found ${refText} in list item: "${liText}"`);

        // Check if the list item ONLY contains the source reference (and maybe a bullet/dot)
        // This would indicate it's on its own line
        if (liText && liText.length < 20) {
          const hasOnlyRef = /^\s*•?\s*\[\d+\]\s*\.?\s*$/.test(liText);
          if (hasOnlyRef) {
            console.error(`❌ ERROR: Source ref ${refText} appears alone in list item: "${liText}"`);
            throw new Error(`Source reference ${refText} is incorrectly positioned as its own bullet point`);
          }
        }
      }

      // Check if there's a pattern of: text, then source ref, then period on separate elements
      const nextText = await ref.evaluate((el) => {
        const next = el.nextSibling;
        if (next && next.nodeType === Node.TEXT_NODE) {
          return next.textContent?.trim();
        }
        return '';
      });

      if (nextText && nextText.startsWith('.')) {
        console.log(`Note: ${refText} has period immediately after: "${nextText}"`);
      }
    }

    // Look for the specific problematic pattern: bullet points with just [3] or [5]
    const allLis = await page.locator('li').all();
    for (const li of allLis) {
      const text = await li.textContent();
      const trimmed = text?.trim() || '';

      // Check if this li contains ONLY a source reference (with optional bullet and dot)
      if (/^•?\s*\[\d+\]\s*\.?\s*$/.test(trimmed) || trimmed.match(/^\[\d+\]\.?\s*$/)) {
        console.error(`❌ FOUND THE BUG: List item with only source ref: "${trimmed}"`);
        await page.screenshot({ path: '/workspaces/thesocialclub/tests/bug-found.png', fullPage: true });
        throw new Error(`Found source reference as standalone list item: "${trimmed}"`);
      }
    }

    console.log('✅ No standalone source reference bullets found');
    await page.screenshot({ path: '/workspaces/thesocialclub/tests/final-check.png', fullPage: true });
  });
});
