/**
 * Contribution checklist enforcement tests.
 * Verifies that the attribution conventions documented in CONTRIBUTING.md
 * are present in every HTML and JS file.
 *
 * Check 1 — HTML attribution comments:
 *   Every <script src="https://">, <link href="https://">, and
 *   <iframe src="https://"> tag must have an <!-- External … --> comment
 *   on the line directly above the opening tag.
 *
 * Check 2 — JS dependency comment blocks:
 *   Every assets/js/*.js file that references a known browser global
 *   supplied by an external library (React, ReactDOM) must open with a
 *   block comment that documents that dependency.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

// ─── helpers ────────────────────────────────────────────────────────────────

function readLines(filePath) {
    return fs.readFileSync(filePath, 'utf8').split('\n');
}

function prevNonBlankLine(lines, idx) {
    let i = idx - 1;
    while (i >= 0 && lines[i].trim() === '') i--;
    return i >= 0 ? lines[i].trim() : '';
}

/**
 * Collect every external tag in an HTML file, returning objects with
 * { tagName, openingLineIndex, lineText } for each tag that has an
 * https:// URL in its src or href attribute.
 */
function findExternalTags(lines) {
    const results = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Only consider lines that open a <script>, <link>, or <iframe> tag.
        if (!/<(script|link|iframe)\b/i.test(line)) continue;

        // Collect the full tag text (may span multiple lines until ">").
        let tagText = line;
        let j = i;
        while (!tagText.includes('>') && j < lines.length - 1) {
            j++;
            tagText += '\n' + lines[j];
        }

        // Does the tag reference an external URL via src or href?
        if (/\b(src|href)="https:\/\//.test(tagText)) {
            const tagMatch = line.match(/<(script|link|iframe)\b/i);
            results.push({
                tagName: tagMatch[1].toLowerCase(),
                openingLineIndex: i,
                lineText: line.trim(),
            });
        }
    }

    return results;
}

// ─── Check 1: HTML attribution comments ─────────────────────────────────────

const htmlFiles = fs
    .readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .sort();

describe('HTML attribution comments (CONTRIBUTING.md §4)', () => {
    test('at least one HTML file is found to test', () => {
        expect(htmlFiles.length).toBeGreaterThan(0);
    });

    for (const filename of htmlFiles) {
        const filePath = path.join(ROOT, filename);
        const lines = readLines(filePath);
        const externalTags = findExternalTags(lines);

        if (externalTags.length === 0) {
            test(`${filename} — no external CDN tags (nothing to check)`, () => {
                expect(externalTags).toHaveLength(0);
            });
            continue;
        }

        for (const tag of externalTags) {
            test(
                `${filename} line ${tag.openingLineIndex + 1}: ` +
                `<${tag.tagName}> with external URL has an attribution comment above it`,
                () => {
                    const prev = prevNonBlankLine(lines, tag.openingLineIndex);
                    expect(prev).toMatch(
                        /<!--\s*External\s+(library|content|service|resource)/i
                    );
                }
            );
        }
    }
});

// ─── Check 2: JS dependency comment blocks ───────────────────────────────────

/**
 * Browser globals that must be documented when referenced in a JS file.
 * Extend this list as new CDN-loaded libraries are introduced.
 */
const KNOWN_GLOBALS = ['React', 'ReactDOM'];

const jsDir  = path.join(ROOT, 'assets', 'js');
const jsFiles = fs
    .readdirSync(jsDir)
    .filter(f => f.endsWith('.js'))
    .sort();

describe('JS dependency comment blocks (CONTRIBUTING.md §2)', () => {
    test('at least one JS file is found to test', () => {
        expect(jsFiles.length).toBeGreaterThan(0);
    });

    for (const filename of jsFiles) {
        const filePath = path.join(jsDir, filename);
        const content  = fs.readFileSync(filePath, 'utf8');

        const usedGlobals = KNOWN_GLOBALS.filter(g => {
            // Match the global as a standalone identifier, not part of a longer word.
            return new RegExp(`\\b${g}\\b`).test(content);
        });

        if (usedGlobals.length === 0) {
            test(`assets/js/${filename} — no known external globals (nothing to check)`, () => {
                expect(usedGlobals).toHaveLength(0);
            });
            continue;
        }

        test(
            `assets/js/${filename} references ${usedGlobals.join(', ')} ` +
            `and must open with a dependency block comment`,
            () => {
                // The file must begin with a block comment (/* … */) before any code.
                // Whitespace before the comment is allowed.
                expect(content.trimStart()).toMatch(/^\/\*/);
            }
        );

        test(
            `assets/js/${filename} dependency block must document at least one external URL`,
            () => {
                // The opening block comment must contain a URL so the reader
                // can trace the dependency without consulting another file.
                const openingBlock = content.match(/^[\s\S]*?\*\//);
                expect(openingBlock).not.toBeNull();
                expect(openingBlock[0]).toMatch(/https?:\/\//);
            }
        );
    }
});
