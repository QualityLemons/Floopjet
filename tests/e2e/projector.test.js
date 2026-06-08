/**
 * Projector page E2E tests — HTTP + HTML parsing.
 * Verifies form structure, character counter scaffolding, and
 * success/error banner initial state. No browser required.
 */
const { fetchPage } = require('./helpers');

let $;

beforeAll(async () => {
    const page = await fetchPage('/projector.html');
    $ = page.$;
});

test('page heading contains "Projector"', () => {
    expect($('h1').text()).toMatch(/Projector/i);
});

test('form has id="rtfForm"', () => {
    expect($('#rtfForm').length).toBe(1);
});

test('form contains exactly six textareas', () => {
    expect($('#rtfForm textarea').length).toBe(6);
});

test('each textarea has a unique id (q1–q6)', () => {
    ['q1','q2','q3','q4','q5','q6'].forEach(id => {
        expect($(`#${id}`).length).toBe(1);
    });
});

test('every textarea is wrapped in a .form-group container', () => {
    $('#rtfForm textarea').each((_, el) => {
        expect($(el).closest('.form-group').length).toBe(1);
    });
});

test('each .form-group contains a .counter element', () => {
    $('#rtfForm .form-group').each((_, group) => {
        expect($(group).find('.counter').length).toBe(1);
    });
});

test('success banner has the "hidden" class on load', () => {
    expect($('#successBanner').hasClass('hidden')).toBe(true);
});

test('form has a submit button', () => {
    expect($('#rtfForm button[type="submit"]').length).toBeGreaterThan(0);
});

test('page links the external projector.js script', () => {
    const scripts = $('script[src]').map((_, el) => $(el).attr('src')).get();
    expect(scripts.some(src => src.includes('projector.js'))).toBe(true);
});

test('page loads the compiled Tailwind stylesheet', () => {
    const links = $('link[rel="stylesheet"][href]').map((_, el) => $(el).attr('href')).get();
    expect(links.some(href => href.includes('main.css'))).toBe(true);
});
