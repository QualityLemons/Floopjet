/*
 * Projector form logic for Floop Feedback Tools.
 * Handles character counters, RTF generation, localStorage persistence,
 * draft auto-save/restore, beforeunload guard, and the success banner.
 * No external dependencies.
 * Author: John E. Parman
 */

var PROJECTOR_DRAFT_KEY = 'projector_draft';
var PROJECTOR_FIELDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
var projectorSubmitted = false;

function saveProjectorDraft() {
    var draft = {};
    PROJECTOR_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) draft[id] = el.value;
    });
    localStorage.setItem(PROJECTOR_DRAFT_KEY, JSON.stringify(draft));
}

function restoreProjectorDraft() {
    var raw = localStorage.getItem(PROJECTOR_DRAFT_KEY);
    if (!raw) return;
    try {
        var draft = JSON.parse(raw);
        PROJECTOR_FIELDS.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && draft[id]) {
                el.value = draft[id];
                el.dispatchEvent(new Event('input'));
            }
        });
    } catch (e) {
        localStorage.removeItem(PROJECTOR_DRAFT_KEY);
    }
}

function clearProjectorDraft() {
    localStorage.removeItem(PROJECTOR_DRAFT_KEY);
}

function hasProjectorContent() {
    return PROJECTOR_FIELDS.some(function (id) {
        var el = document.getElementById(id);
        return el && el.value.trim().length > 0;
    });
}

function initProjectorDraftListeners() {
    PROJECTOR_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', saveProjectorDraft);
    });
    window.addEventListener('beforeunload', function (e) {
        if (!projectorSubmitted && hasProjectorContent()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

/**
 * Escapes the three RTF special characters so that user-typed text cannot
 * inject RTF control words or break the document structure.
 *   \  →  \\   (RTF escape character)
 *   {  →  \{   (RTF group open)
 *   }  →  \}   (RTF group close)
 */
function escapeRTF(text) {
    return (text || '').replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
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
initProjectorDraftListeners();
restoreProjectorDraft();

const rtfForm = document.getElementById('rtfForm');
if (rtfForm) { rtfForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const q1El = document.getElementById('q1');
    const q2El = document.getElementById('q2');
    const q3El = document.getElementById('q3');
    const q4El = document.getElementById('q4');
    const q5El = document.getElementById('q5');
    const q6El = document.getElementById('q6');

    if (!q1El || !q2El || !q3El || !q4El || !q5El || !q6El) return;

    const formData = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        q1: q1El.value,
        q2: q2El.value,
        q3: q3El.value,
        q4: q4El.value,
        q5: q5El.value,
        q6: q6El.value
    };

    if (!formData.q1.trim()) {
        const q1Error = document.getElementById('q1-error');
        q1El.setAttribute('aria-invalid', 'true');
        q1El.classList.add('border-red-400');
        if (q1Error) {
            q1Error.textContent = 'This field is required. Please describe what you want to accomplish.';
            q1Error.classList.remove('hidden');
        }
        q1El.focus();
        q1El.addEventListener('input', function clearError() {
            q1El.removeAttribute('aria-invalid');
            q1El.classList.remove('border-red-400');
            if (q1Error) {
                q1Error.textContent = '';
                q1Error.classList.add('hidden');
            }
            q1El.removeEventListener('input', clearError);
        });
        return;
    }

    const history = JSON.parse(localStorage.getItem('projectourist_data') || '[]');
    history.unshift(formData);
    localStorage.setItem('projectourist_data', JSON.stringify(history));

    const rtfHeader = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs28 ";
    const rtfBody = [
        "\\b PROJECTOR VISION REPORT \\b0 \\line",
        "Generated on: " + escapeRTF(formData.date) + " \\line \\line",
        "\\b 1. Goal: \\b0 \\line " + escapeRTF(formData.q1) + " \\line \\line",
        "\\b 2. The Difference: \\b0 \\line " + escapeRTF(formData.q2) + " \\line \\line",
        "\\b 3. The End-State: \\b0 \\line " + escapeRTF(formData.q3) + " \\line \\line",
        "\\b 4. Requirements: \\b0 \\line " + escapeRTF(formData.q4) + " \\line \\line",
        "\\b 5. Best Result: \\b0 \\line " + escapeRTF(formData.q5) + " \\line \\line",
        "\\b 6. Cost of Inaction: \\b0 \\line " + escapeRTF(formData.q6)
    ].join(' ');
    const fullRTF = rtfHeader + rtfBody + "}";

    const blob = new Blob([fullRTF], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Projector-' + formData.q1.substring(0, 20).replace(/\s+/g, '_') + '.rtf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    projectorSubmitted = true;
    clearProjectorDraft();

    const banner = document.getElementById('successBanner');
    if (banner) {
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}); }
