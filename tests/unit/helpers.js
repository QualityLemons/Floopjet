/**
 * Pure helper functions extracted from the browser scripts.
 * These mirror the logic in assets/js/projector.js and assets/js/suggest-tool.js
 * so they can be tested in a Node environment without a DOM.
 */

/**
 * Builds the full RTF string for a Projector report.
 * Mirrors the RTF assembly block in assets/js/projector.js.
 */
function buildRTF(formData) {
    const header = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs28 ';
    const body = [
        '\\b PROJECTOR VISION REPORT \\b0 \\line',
        'Generated on: ' + formData.date + ' \\line \\line',
        '\\b 1. Goal: \\b0 \\line ' + formData.q1 + ' \\line \\line',
        '\\b 2. The Difference: \\b0 \\line ' + formData.q2 + ' \\line \\line',
        '\\b 3. The End-State: \\b0 \\line ' + formData.q3 + ' \\line \\line',
        '\\b 4. Requirements: \\b0 \\line ' + formData.q4 + ' \\line \\line',
        '\\b 5. Best Result: \\b0 \\line ' + formData.q5 + ' \\line \\line',
        '\\b 6. Cost of Inaction: \\b0 \\line ' + formData.q6
    ].join(' ');
    return header + body + '}';
}

/**
 * Generates the RTF download filename from the first answer.
 * Mirrors: 'Projector-' + q1.substring(0, 20).replace(/\s+/g, '_') + '.rtf'
 */
function buildRTFFilename(q1) {
    return 'Projector-' + q1.substring(0, 20).replace(/\s+/g, '_') + '.rtf';
}

/**
 * Returns true when a character count has reached or exceeded the limit.
 * Mirrors the threshold check in both projector.js and suggest-tool.js.
 */
function isAtLimit(length, max) {
    return length >= max;
}

/**
 * Assembles the audience string from an array of checked checkbox values.
 * Mirrors: audiences.join(', ')
 */
function assembleAudiences(values) {
    return values.join(', ');
}

/**
 * Validates that a required text field has a non-empty trimmed value.
 */
function isFieldEmpty(value) {
    return value.trim() === '';
}

module.exports = { buildRTF, buildRTFFilename, isAtLimit, assembleAudiences, isFieldEmpty };
