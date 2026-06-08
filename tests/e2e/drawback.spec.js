const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/drawback.html');
    // Wait for the React/Babel component to finish rendering
    await page.waitForSelector('canvas', { timeout: 10000 });
});

test('page heading says Drawback', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Drawback');
});

test('canvas element is present', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
});

test('exactly four colour picker buttons are rendered', async ({ page }) => {
    // Colour buttons have aria-label matching colour names
    const colours = ['Blue', 'Yellow', 'Orange', 'Black'];
    for (const colour of colours) {
        await expect(page.locator(`button[aria-label="${colour}"]`)).toBeVisible();
    }
});

test('black is the active colour on load (aria-pressed="true")', async ({ page }) => {
    const active = page.locator('button[aria-pressed="true"]');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveAttribute('aria-label', 'Black');
});

test('clicking a colour button changes the active selection', async ({ page }) => {
    await page.click('button[aria-label="Blue"]');
    await expect(page.locator('button[aria-label="Blue"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('button[aria-label="Black"]')).toHaveAttribute('aria-pressed', 'false');
});

test('Clear button is visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Clear' })).toBeVisible();
});

test('Submit to Gallery button is visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Submit to Gallery' })).toBeVisible();
});

test('clicking Clear does not crash the page', async ({ page }) => {
    await page.click('button', { hasText: 'Clear' });
    await expect(page.locator('canvas')).toBeVisible();
});
