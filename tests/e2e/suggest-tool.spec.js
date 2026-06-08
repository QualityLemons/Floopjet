const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/suggest-tool.html');
});

test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/suggest/i);
});

test('form is visible on load', async ({ page }) => {
    await expect(page.locator('#suggestForm')).toBeVisible();
});

test('character counters initialise at 0', async ({ page }) => {
    const counters = page.locator('.counter');
    const count = await counters.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
        await expect(counters.nth(i)).toHaveText('0');
    }
});

test('character counter updates on input', async ({ page }) => {
    const field = page.locator('#s1q1');
    const counter = field.locator('..').locator('.counter');
    await field.fill('My tool idea');
    await expect(counter).toHaveText('12');
});

test('audience checkboxes are present', async ({ page }) => {
    const boxes = page.locator('#audienceGrid input[type="checkbox"]');
    await expect(boxes).toHaveCount(await boxes.count());
    expect(await boxes.count()).toBeGreaterThan(0);
});

test('checking an audience checkbox applies teal styling to its label', async ({ page }) => {
    const firstCheckbox = page.locator('#audienceGrid input[type="checkbox"]').first();
    await firstCheckbox.check();
    const label = firstCheckbox.locator('xpath=ancestor::label');
    await expect(label).toHaveClass(/border-teal-500/);
    await expect(label).toHaveClass(/bg-teal-50/);
});

test('unchecking a checkbox removes teal styling', async ({ page }) => {
    const firstCheckbox = page.locator('#audienceGrid input[type="checkbox"]').first();
    await firstCheckbox.check();
    await firstCheckbox.uncheck();
    const label = firstCheckbox.locator('xpath=ancestor::label');
    await expect(label).not.toHaveClass(/border-teal-500/);
});

test('submitting with empty name field does not hide the form', async ({ page }) => {
    await page.locator('#s1q1').fill('');
    await page.click('#submitBtn');
    await expect(page.locator('#suggestForm')).toBeVisible();
});

test('success and error banners are hidden on load', async ({ page }) => {
    await expect(page.locator('#successBanner')).toBeHidden();
    await expect(page.locator('#errorBanner')).toBeHidden();
});
