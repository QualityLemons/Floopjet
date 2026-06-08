/**
 * Shared helper for HTTP-based E2E tests.
 * Fetches a page from the dev server and parses it with cheerio.
 */
const http = require('http');
const cheerio = require('cheerio');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

function fetchPage(path) {
    return new Promise((resolve, reject) => {
        http.get(BASE_URL + path, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => resolve({ status: res.statusCode, html: body, $: cheerio.load(body) }));
        }).on('error', reject);
    });
}

module.exports = { fetchPage, BASE_URL };
