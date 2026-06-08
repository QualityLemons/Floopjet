/*
 * 404 page countdown and redirect logic for Floop Feedback Tools.
 * Counts down from 5 seconds and redirects to index.html.
 * No external dependencies.
 * Author: John E. Parman
 */

var seconds = 5;
var el = document.getElementById('countdown');
var interval = setInterval(function () {
    seconds -= 1;
    if (el) { el.textContent = seconds; }
    if (seconds <= 0) {
        clearInterval(interval);
        window.location.href = '/index.html';
    }
}, 1000);
