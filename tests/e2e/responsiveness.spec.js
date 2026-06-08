const { test, expect } = require('@playwright/test');

const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 }
];

const pagesToCheck = [
    '/index.html',
    '/projector.html',
    '/drawback.html',
    '/gallery.html',
    '/suggest-tool.html',
    '/about.html'
];

for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });

        for (const path of pagesToCheck) {
            test(`${path} — loads and nav is visible`, async ({ page }) => {
                await page.goto(path);
                await expect(page.locator('nav[aria-label="Site navigation"]')).toBeVisible();
                await expect(page.locator('main#main-content')).toBeAttached();
            });
        }

        test('/projector.html — no horizontal overflow', async ({ page }) => {
            await page.goto('/projector.html');
            const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
            const viewportWidth = await page.evaluate(() => window.innerWidth);
            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
        });

        test('/suggest-tool.html — form is accessible', async ({ page }) => {
            await page.goto('/suggest-tool.html');
            await expect(page.locator('#suggestForm')).toBeVisible();
            await expect(page.locator('#s1q1')).toBeVisible();
        });

        test('/drawback.html — canvas renders at this viewport', async ({ page }) => {
            await page.goto('/drawback.html');
            await page.waitForSelector('canvas', { timeout: 10000 });
            await expect(page.locator('canvas')).toBeVisible();
        });
    });
}
