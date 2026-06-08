/*
 * Suggest-a-Tool form logic for Floop Feedback Tools.
 * Handles character counters, audience checkbox states, form submission
 * to the Google Apps Script endpoint, draft auto-save/restore, and
 * beforeunload guard.
 *
 * External service dependency:
 *   - Google Apps Script endpoint (SHEETS_URL below) — https://script.google.com
 *     Receives form submissions as JSON and appends them to a connected Google Sheet.
 *     This is a third-party service; the endpoint URL is not project code.
 * Author: John E. Parman
 */

var SUGGEST_DRAFT_KEY = 'suggest_draft';
var SUGGEST_TEXT_FIELDS = ['s1q1', 's1q2', 's1q3', 's2q1', 's2q2', 's3q2', 's3q3'];
var suggestSubmitted = false;

function saveSuggestDraft() {
    var draft = { fields: {}, checkboxes: [] };
    SUGGEST_TEXT_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) draft.fields[id] = el.value;
    });
    document.querySelectorAll('#audienceGrid input[type="checkbox"]:checked').forEach(function (box) {
        draft.checkboxes.push(box.value);
    });
    localStorage.setItem(SUGGEST_DRAFT_KEY, JSON.stringify(draft));
}

function restoreSuggestDraft() {
    var raw = localStorage.getItem(SUGGEST_DRAFT_KEY);
    if (!raw) return;
    try {
        var draft = JSON.parse(raw);
        if (draft.fields) {
            SUGGEST_TEXT_FIELDS.forEach(function (id) {
                var el = document.getElementById(id);
                if (el && draft.fields[id]) {
                    el.value = draft.fields[id];
                    el.dispatchEvent(new Event('input'));
                }
            });
        }
        if (Array.isArray(draft.checkboxes)) {
            document.querySelectorAll('#audienceGrid input[type="checkbox"]').forEach(function (box) {
                if (draft.checkboxes.indexOf(box.value) !== -1) {
                    box.checked = true;
                    box.dispatchEvent(new Event('change'));
                }
            });
        }
    } catch (e) {
        localStorage.removeItem(SUGGEST_DRAFT_KEY);
    }
}

function clearSuggestDraft() {
    localStorage.removeItem(SUGGEST_DRAFT_KEY);
}

function hasSuggestContent() {
    var hasText = SUGGEST_TEXT_FIELDS.some(function (id) {
        var el = document.getElementById(id);
        return el && el.value.trim().length > 0;
    });
    var hasChecked = document.querySelector('#audienceGrid input[type="checkbox"]:checked') !== null;
    return hasText || hasChecked;
}

function initSuggestDraftListeners() {
    SUGGEST_TEXT_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', saveSuggestDraft);
    });
    document.querySelectorAll('#audienceGrid input[type="checkbox"]').forEach(function (box) {
        box.addEventListener('change', saveSuggestDraft);
    });
    window.addEventListener('beforeunload', function (e) {
        if (!suggestSubmitted && hasSuggestContent()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

/**
 * Attaches character counter behaviour to every .form-group textarea on the page.
 * Reads the `maxlength` attribute on each textarea; falls back to 210 if absent.
 * Requires a sibling .counter element inside the same .form-group parent.
 * Safe to call when no matching elements exist — skips silently.
 */
function initCharacterCounters() {
    document.querySelectorAll('.form-group textarea').forEach(function (area) {
        const counter = area.parentElement.querySelector('.counter');
        if (!counter) return;
        const max = parseInt(area.getAttribute('maxlength'), 10) || 210;
        area.addEventListener('input', function () {
            const len = area.value.length;
            counter.textContent = len;
            if (len >= max) {
                counter.classList.add('text-red-500', 'font-bold');
            } else {
                counter.classList.remove('text-red-500', 'font-bold');
            }
        });
    });
}

initCharacterCounters();

document.querySelectorAll('#audienceGrid input[type="checkbox"]').forEach(function (box) {
    box.addEventListener('change', function () {
        const label = this.closest('label');
        if (this.checked) {
            label.classList.add('border-teal-500', 'bg-teal-50');
        } else {
            label.classList.remove('border-teal-500', 'bg-teal-50');
        }
    });
});

initSuggestDraftListeners();
restoreSuggestDraft();

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyRu4MklWmOGIgEVZ5vwAAED510J04ZLTxPUOy4DYDXpySHzEa2JW3hcjNiZY3RcbEMow/exec';

const suggestForm = document.getElementById('suggestForm');
if (suggestForm) { suggestForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameField = document.getElementById('s1q1');
    if (!nameField) return;

    if (!nameField.value.trim()) {
        nameField.focus();
        nameField.classList.add('border-red-400');
        return;
    }
    nameField.classList.remove('border-red-400');
    document.getElementById('errorBanner').classList.add('hidden');

    const audiences = Array.from(
        document.querySelectorAll('#audienceGrid input[type="checkbox"]:checked')
    ).map(function (b) { return b.value; });

    const suggestion = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        name: nameField.value,
        problem: document.getElementById('s1q2').value,
        interaction: document.getElementById('s1q3').value,
        steps: document.getElementById('s2q1').value,
        similar: document.getElementById('s2q2').value,
        audiences: audiences.join(', '),
        idealUser: document.getElementById('s3q2').value,
        extra: document.getElementById('s3q3').value
    };

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    fetch(SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify(suggestion)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.result === 'success') {
            const existing = JSON.parse(localStorage.getItem('floop_suggestions') || '[]');
            existing.unshift(suggestion);
            localStorage.setItem('floop_suggestions', JSON.stringify(existing));

            suggestSubmitted = true;
            clearSuggestDraft();

            document.getElementById('suggestForm').classList.add('hidden');
            const banner = document.getElementById('successBanner');
            banner.classList.remove('hidden');
            banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            throw new Error('Unexpected response');
        }
    })
    .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Submit My Suggestion';
        document.getElementById('errorBanner').classList.remove('hidden');
        document.getElementById('errorBanner').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}); }
