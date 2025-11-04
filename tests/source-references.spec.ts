import { test, expect } from '@playwright/test';

test.describe('Source References Positioning', () => {
  test('source references should be inline with text, not on separate lines', async ({ page }) => {
    // Navigate to the summary page
    await page.goto('http://localhost:3000/summary');

    // Wait for content to load
    await page.waitForSelector('.prose', { timeout: 10000 });

    // Find all source reference elements
    const sourceRefs = page.locator('sup[class*="cursor-help"]');
    const count = await sourceRefs.count();

    console.log(`Found ${count} source references`);

    // Check each source reference
    for (let i = 0; i < count; i++) {
      const ref = sourceRefs.nth(i);
      const refText = await ref.textContent();

      // Get the parent element
      const parent = ref.locator('xpath=..');
      const parentTagName = await parent.evaluate(el => el.tagName.toLowerCase());

      // Get the bounding box of the source reference
      const refBox = await ref.boundingBox();

      if (!refBox) {
        console.log(`Source ref ${refText}: No bounding box (hidden)`);
        continue;
      }

      console.log(`Source ref ${refText}: parent=${parentTagName}, position=(${refBox.x}, ${refBox.y})`);

      // The source reference should NOT be the only content in a list item
      if (parentTagName === 'li') {
        const liText = await parent.textContent();
        const trimmed = liText?.trim() || '';

        // If the list item only contains the source reference (and maybe a bullet), that's wrong
        if (trimmed.length < 10) {
          console.error(`❌ Source ref ${refText} is alone in a list item: "${trimmed}"`);
          throw new Error(`Source reference ${refText} should not be on its own line as a bullet point`);
        }
      }

      // Check if there's text immediately before the source reference (same parent)
      const textBefore = await parent.evaluate((el, supEl) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let lastText = '';
        let node;

        while (node = walker.nextNode()) {
          if (walker.currentNode.parentElement === supEl) {
            break;
          }
          const text = node.textContent?.trim() || '';
          if (text) {
            lastText = text;
          }
        }

        return lastText;
      }, await ref.elementHandle());

      if (textBefore) {
        console.log(`✓ Source ref ${refText} has text before it: "${textBefore.slice(-30)}"`);
      }
    }

    // Take a screenshot for visual verification
    await page.screenshot({ path: '/workspaces/thesocialclub/tests/source-refs-screenshot.png', fullPage: true });

    console.log('✅ All source references are properly positioned');
  });
});
