/**
 * Suggest-a-Tool page E2E tests — HTTP + HTML parsing.
 * Verifies form structure, audience grid, banners, and asset links.
 * No browser required.
 */
const { fetchPage } = require('./helpers');

let $;

beforeAll(async () => {
    const page = await fetchPage('/suggest-tool.html');
    $ = page.$;
});

test('page heading mentions "Suggest"', () => {
    expect($('h1').text()).toMatch(/Suggest/i);
});

test('form has id="suggestForm"', () => {
    expect($('#suggestForm').length).toBe(1);
});

test('first required field has id="s1q1"', () => {
    expect($('#s1q1').length).toBe(1);
});

test('audience grid div has id="audienceGrid"', () => {
    expect($('#audienceGrid').length).toBe(1);
});

test('audience grid contains at least one checkbox', () => {
    expect($('#audienceGrid input[type="checkbox"]').length).toBeGreaterThan(0);
});

test('every checkbox in the audience grid has a value attribute', () => {
    $('#audienceGrid input[type="checkbox"]').each((_, el) => {
        expect($(el).attr('value')).toBeTruthy();
    });
});

test('every checkbox in the audience grid is wrapped in a <label>', () => {
    $('#audienceGrid input[type="checkbox"]').each((_, el) => {
        expect($(el).closest('label').length).toBe(1);
    });
});

test('submit button has id="submitBtn"', () => {
    expect($('#submitBtn').length).toBe(1);
});

test('success banner has the "hidden" class on load', () => {
    expect($('#successBanner').hasClass('hidden')).toBe(true);
});

test('error banner has the "hidden" class on load', () => {
    expect($('#errorBanner').hasClass('hidden')).toBe(true);
});

test('all textareas in .form-group have a .counter sibling', () => {
    $('.form-group textarea').each((_, el) => {
        expect($(el).closest('.form-group').find('.counter').length).toBe(1);
    });
});

test('page links the external suggest-tool.js script', () => {
    const scripts = $('script[src]').map((_, el) => $(el).attr('src')).get();
    expect(scripts.some(src => src.includes('suggest-tool.js'))).toBe(true);
});
