import { test, expect } from '@playwright/test';

test('verify source references are inline AND have working tooltips', async ({ page }) => {
  await page.goto('http://localhost:3000/summary', { waitUntil: 'networkidle' });
  await page.waitForSelector('.prose', { timeout: 10000 });

  // 1. Check that no source references are standalone list items
  const allLis = await page.locator('li').all();
  for (const li of allLis) {
    const text = await li.textContent();
    const trimmed = text?.trim() || '';

    // Check if this li contains ONLY a source reference
    if (/^•?\s*\[\d+\]\s*\.?\s*$/.test(trimmed) || trimmed.match(/^\[\d+\]\.?\s*$/)) {
      console.error(`❌ Found standalone source ref list item: "${trimmed}"`);
      throw new Error(`Source reference should not be standalone: "${trimmed}"`);
    }
  }

  console.log('✅ All source references are inline (not standalone)');

  // 2. Check that tooltips work
  const sourceRefs = await page.locator('sup[class*="cursor-help"]').all();

  if (sourceRefs.length === 0) {
    throw new Error('No source references found!');
  }

  console.log(`Found ${sourceRefs.length} source references, testing tooltips...`);

  // Test the first few source references
  for (let i = 0; i < Math.min(3, sourceRefs.length); i++) {
    const ref = sourceRefs[i];
    const refText = await ref.textContent();

    // Hover over the source reference
    await ref.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(500);

    // Check if tooltip content is visible
    const tooltip = page.locator('[role="tooltip"]');
    const isVisible = await tooltip.isVisible();

    if (!isVisible) {
      console.error(`❌ Tooltip not visible for source ref ${refText}`);
      throw new Error(`Tooltip should appear when hovering ${refText}`);
    }

    const tooltipText = await tooltip.textContent();
    console.log(`✅ Tooltip for ${refText}: "${tooltipText?.substring(0, 50)}..."`);

    // Move mouse away to close tooltip
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
  }

  // Take final screenshot
  await page.screenshot({
    path: '/workspaces/thesocialclub/tests/final-verification.png',
    fullPage: true
  });

  console.log('✅ All tests passed - source refs are inline AND tooltips work!');
});
