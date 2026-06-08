/**
 * Navigation E2E tests — HTTP + HTML parsing.
 * Verifies that every page loads, has the correct title, and includes
 * the required accessibility landmarks. No browser required.
 */
const { fetchPage } = require('./helpers');

const pages = [
    { path: '/index.html',       titlePattern: /Floop/i },
    { path: '/projector.html',   titlePattern: /Projector/i },
    { path: '/drawback.html',    titlePattern: /Drawback/i },
    { path: '/gallery.html',     titlePattern: /Gallery/i },
    { path: '/aac.html',         titlePattern: /AAC/i },
    { path: '/about.html',       titlePattern: /About/i },
    { path: '/suggest-tool.html',titlePattern: /Suggest/i }
];

describe('Page load status', () => {
    test.each(pages)('$path returns HTTP 200', async ({ path }) => {
        const { status } = await fetchPage(path);
        expect(status).toBe(200);
    });
});

describe('Page titles', () => {
    test.each(pages)('$path has correct <title>', async ({ path, titlePattern }) => {
        const { $ } = await fetchPage(path);
        expect($('title').text()).toMatch(titlePattern);
    });
});

describe('Accessibility landmarks', () => {
    test.each(pages)('$path has a skip navigation link', async ({ path }) => {
        const { $ } = await fetchPage(path);
        expect($('a[href="#main-content"]').length).toBeGreaterThan(0);
    });

    test.each(pages)('$path has <nav aria-label="Site navigation">', async ({ path }) => {
        const { $ } = await fetchPage(path);
        expect($('nav[aria-label="Site navigation"]').length).toBe(1);
    });

    test.each(pages)('$path has <main id="main-content">', async ({ path }) => {
        const { $ } = await fetchPage(path);
        expect($('main#main-content').length).toBe(1);
    });

    test.each(pages)('$path has lang="en" on <html>', async ({ path }) => {
        const { $ } = await fetchPage(path);
        expect($('html').attr('lang')).toBe('en');
    });

    test.each(pages)('$path has a <meta name="description">', async ({ path }) => {
        const { $ } = await fetchPage(path);
        const desc = $('meta[name="description"]').attr('content');
        expect(desc).toBeTruthy();
        expect(desc.length).toBeGreaterThan(10);
    });
});

describe('Navigation bar links', () => {
    test('/projector.html has aria-current="page" on the Projector link', async () => {
        const { $ } = await fetchPage('/projector.html');
        const activeLink = $('nav a[aria-current="page"]');
        expect(activeLink.length).toBe(1);
        expect(activeLink.text()).toMatch(/Projector/i);
    });

    test('/drawback.html has aria-current="page" on the Drawback link', async () => {
        const { $ } = await fetchPage('/drawback.html');
        const activeLink = $('nav a[aria-current="page"]');
        expect(activeLink.length).toBe(1);
        expect(activeLink.text()).toMatch(/Drawback/i);
    });

    test('Hub page has a Floop brand link in the nav', async () => {
        const { $ } = await fetchPage('/index.html');
        const brand = $('nav a').filter((_, el) => $(el).text().includes('Floop'));
        expect(brand.length).toBeGreaterThan(0);
    });
});
