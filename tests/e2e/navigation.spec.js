const { test, expect } = require('@playwright/test');

const pages = [
    { path: '/', title: 'Floop' },
    { path: '/projector.html', title: 'Projector' },
    { path: '/drawback.html', title: 'Drawback' },
    { path: '/gallery.html', title: 'Gallery' },
    { path: '/aac.html', title: 'AAC' },
    { path: '/about.html', title: 'About' },
    { path: '/suggest-tool.html', title: 'Suggest' }
];

for (const { path, title } of pages) {
    test(`${path} — loads with HTTP 200 and correct title`, async ({ page }) => {
        const response = await page.goto(path);
        expect(response.status()).toBe(200);
        await expect(page).toHaveTitle(new RegExp(title, 'i'));
    });
}

test('every page has a skip navigation link', async ({ page }) => {
    for (const { path } of pages) {
        await page.goto(path);
        const skip = page.locator('a[href="#main-content"]').first();
        await expect(skip).toBeAttached();
    }
});

test('every page has a site navigation landmark', async ({ page }) => {
    for (const { path } of pages) {
        await page.goto(path);
        await expect(page.locator('nav[aria-label="Site navigation"]')).toBeVisible();
    }
});

test('every page has a main landmark with id="main-content"', async ({ page }) => {
    for (const { path } of pages) {
        await page.goto(path);
        await expect(page.locator('main#main-content')).toBeAttached();
    }
});

test('Floop brand link on hub navigates back to hub', async ({ page }) => {
    await page.goto('/projector.html');
    await page.click('a:has-text("Floop")');
    await expect(page).toHaveURL(/index\.html|\/$/);
});

test('active page is marked with aria-current="page" in the nav', async ({ page }) => {
    await page.goto('/projector.html');
    const active = page.locator('nav a[aria-current="page"]');
    await expect(active).toHaveText(/Projector/i);
});
