/**
 * Gallery page E2E tests — HTTP + HTML parsing.
 * Verifies the React mount point, compiled bundle script tag, and page structure.
 * Interactive behaviour (empty state rendering, card grid, Clear All button)
 * is covered by tests/e2e/gallery.spec.js (requires a real browser).
 */
const { fetchPage } = require('./helpers');

let $;

beforeAll(async () => {
    const page = await fetchPage('/gallery.html');
    $ = page.$;
});

test('page title contains "Gallery"', () => {
    expect($('title').text()).toMatch(/Gallery/i);
});

test('React mount point <div id="root"> is present', () => {
    expect($('#root').length).toBe(1);
});

test('<div id="root"> is inside <main>', () => {
    expect($('main #root').length).toBe(1);
});

test('compiled gallery bundle is loaded as type="module"', () => {
    const scripts = $('script[type="module"][src]').map((_, el) => $(el).attr('src')).get();
    expect(scripts.some(src => src.includes('gallery'))).toBe(true);
});

test('page has a site navigation landmark', () => {
    expect($('nav[aria-label="Site navigation"]').length).toBe(1);
});

test('page has a meta viewport tag for mobile responsiveness', () => {
    const viewport = $('meta[name="viewport"]').attr('content');
    expect(viewport).toMatch(/width=device-width/);
});
