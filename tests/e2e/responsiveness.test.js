/**
 * Responsiveness E2E tests — HTTP + HTML parsing.
 * Verifies that every page carries the structural markers required for
 * a responsive layout: viewport meta tag, compiled Tailwind stylesheet, and responsive
 * class usage in key containers.
 *
 * Viewport-specific rendering (element visibility at 375/768/1280px) is
 * covered by tests/e2e/responsiveness.spec.js (requires a real browser).
 */
const { fetchPage } = require('./helpers');

const pages = [
    '/index.html',
    '/projector.html',
    '/drawback.html',
    '/gallery.html',
    '/suggest-tool.html',
    '/about.html',
    '/aac.html'
];

describe('Viewport meta tag', () => {
    test.each(pages)('%s has width=device-width viewport meta', async (path) => {
        const { $ } = await fetchPage(path);
        const content = $('meta[name="viewport"]').attr('content') || '';
        expect(content).toMatch(/width=device-width/);
        expect(content).toMatch(/initial-scale=1/);
    });
});

describe('Tailwind CSS compiled stylesheet', () => {
    test.each(pages)('%s loads the compiled Tailwind stylesheet', async (path) => {
        const { $ } = await fetchPage(path);
        const links = $('link[rel="stylesheet"][href]').map((_, el) => $(el).attr('href')).get();
        expect(links.some(href => href.includes('main.css'))).toBe(true);
    });
});

describe('Responsive nav bar', () => {
    test.each(pages)('%s nav container uses max-w class for centring', async (path) => {
        const { $ } = await fetchPage(path);
        const navInner = $('nav .max-w-6xl, nav .max-w-5xl, nav .max-w-4xl, nav .max-w-3xl');
        expect(navInner.length).toBeGreaterThan(0);
    });
});

describe('Mobile-first layout', () => {
    test('/projector.html form container uses responsive max-w class', async () => {
        const { $ } = await fetchPage('/projector.html');
        const container = $('[class*="max-w-"]');
        expect(container.length).toBeGreaterThan(0);
    });

    test('/suggest-tool.html has a responsive grid or flex container', async () => {
        const { $ } = await fetchPage('/suggest-tool.html');
        const responsive = $('[class*="grid"], [class*="flex"]');
        expect(responsive.length).toBeGreaterThan(0);
    });

    test('/index.html main content uses a grid or flex layout', async () => {
        const { $ } = await fetchPage('/index.html');
        const layout = $('main [class*="grid"], main [class*="flex"]');
        expect(layout.length).toBeGreaterThan(0);
    });
});
