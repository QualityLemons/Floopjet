const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/projector.html');
});

test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Projector');
});

test('form has six textareas', async ({ page }) => {
    const textareas = page.locator('#rtfForm textarea');
    await expect(textareas).toHaveCount(6);
});

test('each textarea has a character counter initially showing 0', async ({ page }) => {
    const counters = page.locator('.counter');
    const count = await counters.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
        await expect(counters.nth(i)).toHaveText('0');
    }
});

test('character counter updates as user types', async ({ page }) => {
    const q1 = page.locator('#q1');
    const counter = q1.locator('..').locator('.counter');
    await q1.fill('Hello');
    await expect(counter).toHaveText('5');
});

test('counter turns red when at the 210-character limit', async ({ page }) => {
    const q1 = page.locator('#q1');
    const counter = q1.locator('..').locator('.counter');
    await q1.fill('a'.repeat(210));
    await expect(counter).toHaveClass(/text-red-500/);
});

test('counter does not turn red below the limit', async ({ page }) => {
    const q1 = page.locator('#q1');
    const counter = q1.locator('..').locator('.counter');
    await q1.fill('a'.repeat(209));
    await expect(counter).not.toHaveClass(/text-red-500/);
});

test('submitting with empty q1 keeps the form visible (validation blocks submit)', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('#rtfForm')).toBeVisible();
});

test('success banner is hidden on page load', async ({ page }) => {
    await expect(page.locator('#successBanner')).toBeHidden();
});

test('submit button is present and labelled', async ({ page }) => {
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeVisible();
    await expect(btn).not.toBeEmpty();
});
