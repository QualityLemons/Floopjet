const { buildRTF, buildRTFFilename } = require('./helpers');

const sample = {
    date: 'Jan 1, 2026',
    q1: 'Launch a community garden',
    q2: 'The neighbourhood becomes greener',
    q3: 'A thriving open garden space',
    q4: 'Land, tools, and volunteers',
    q5: 'Plants growing by spring',
    q6: 'The empty lot stays unused'
};

describe('buildRTF — structure', () => {
    test('opens with RTF header declaration', () => {
        expect(buildRTF(sample)).toMatch(/^\{\\rtf1\\ansi/);
    });

    test('closes with a single curly brace', () => {
        expect(buildRTF(sample)).toMatch(/\}$/);
    });

    test('includes the report title in bold markup', () => {
        expect(buildRTF(sample)).toContain('\\b PROJECTOR VISION REPORT \\b0');
    });

    test('includes all six numbered section labels', () => {
        const rtf = buildRTF(sample);
        ['1. Goal:', '2. The Difference:', '3. The End-State:',
         '4. Requirements:', '5. Best Result:', '6. Cost of Inaction:'].forEach(label => {
            expect(rtf).toContain(label);
        });
    });
});

describe('buildRTF — content', () => {
    test('embeds the report date', () => {
        expect(buildRTF(sample)).toContain('Jan 1, 2026');
    });

    test('embeds all six answers verbatim', () => {
        const rtf = buildRTF(sample);
        Object.values(sample).forEach(value => {
            expect(rtf).toContain(value);
        });
    });

    test('preserves answers that contain special characters', () => {
        const special = { ...sample, q1: 'Goals & "targets" for <2026>' };
        expect(buildRTF(special)).toContain('Goals & "targets" for <2026>');
    });

    test('handles all-empty answers without throwing', () => {
        const empty = { date: 'Jan 1, 2026', q1: '', q2: '', q3: '', q4: '', q5: '', q6: '' };
        expect(() => buildRTF(empty)).not.toThrow();
    });

    test('handles multi-line answers (newlines in input)', () => {
        const multiline = { ...sample, q1: 'Line one\nLine two' };
        expect(buildRTF(multiline)).toContain('Line one\nLine two');
    });
});

describe('buildRTFFilename', () => {
    test('starts with "Projector-"', () => {
        expect(buildRTFFilename('My goal')).toMatch(/^Projector-/);
    });

    test('ends with ".rtf"', () => {
        expect(buildRTFFilename('My goal')).toMatch(/\.rtf$/);
    });

    test('replaces single spaces with underscores', () => {
        expect(buildRTFFilename('My goal here')).toContain('My_goal_here');
    });

    test('replaces multiple consecutive spaces with a single underscore', () => {
        expect(buildRTFFilename('My  goal')).toContain('My_goal');
    });

    test('truncates titles longer than 20 characters', () => {
        const long = 'This title is definitely longer than twenty characters';
        const filename = buildRTFFilename(long);
        const stem = filename.replace('Projector-', '').replace('.rtf', '');
        expect(stem.replace(/_/g, ' ').length).toBeLessThanOrEqual(20);
    });

    test('handles an empty string without throwing', () => {
        expect(buildRTFFilename('')).toBe('Projector-.rtf');
    });

    test('handles a title that is exactly 20 characters', () => {
        const exact = '12345678901234567890';
        expect(buildRTFFilename(exact)).toBe('Projector-12345678901234567890.rtf');
    });
});
