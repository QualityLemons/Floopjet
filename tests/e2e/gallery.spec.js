const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    // Clear localStorage so every test starts with an empty gallery
    await page.goto('/gallery.html');
    await page.evaluate(() => localStorage.removeItem('sandbox-gallery'));
    await page.reload();
    // Wait for React component to render
    await page.waitForSelector('h1', { timeout: 10000 });
});

test('page heading says Community Gallery', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Community Gallery');
});

test('empty state message is shown when there are no drawings', async ({ page }) => {
    await expect(page.locator('text=gallery is currently empty')).toBeVisible();
});

test('empty state has a link back to Drawback', async ({ page }) => {
    const link = page.locator('a', { hasText: /Drawback/i }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /[Dd]rawback/);
});

test('Clear All button is visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Clear All' })).toBeVisible();
});

test('gallery renders a drawing card when localStorage has an entry', async ({ page }) => {
    // Inject a fake drawing entry into localStorage before loading
    const fakeEntry = JSON.stringify([{
        id: 1,
        image: 'data:image/png;base64,iVBORw0KGgo=',
        date: '01/01/2026'
    }]);
    await page.evaluate((entry) => {
        localStorage.setItem('sandbox-gallery', entry);
    }, fakeEntry);

    await page.reload();
    await page.waitForSelector('img[alt="User Feedback"]', { timeout: 10000 });
    await expect(page.locator('img[alt="User Feedback"]')).toBeVisible();
});
