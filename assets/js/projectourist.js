/*
 * Projectourist gallery logic for Floop Feedback Tools.
 * Handles localStorage read, project card rendering, RTF re-download,
 * per-card delete, and full gallery clear.
 * No external dependencies.
 * Author: John E. Parman
 */

/* global confirm */
/* exported loadProjects, deleteProject, clearGallery, downloadExisting */

function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#39;');
}

function loadProjects() {
    var gallery = document.getElementById('projectGallery');
    var data = JSON.parse(localStorage.getItem('projectourist_data') || '[]');

    if (data.length === 0) {
        gallery.innerHTML =
            '<div class="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">' +
                '<p class="text-2xl mb-3" aria-hidden="true">\uD83D\uDCCB</p>' +
                '<p class="text-slate-800 font-bold text-lg mb-2">No saved projects yet</p>' +
                '<p class="text-slate-500 text-sm mb-6">When you submit a vision report in Projector, it will appear here.</p>' +
                '<a href="projector.html" class="inline-block bg-indigo-600 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">' +
                    'Go to Projector &rarr;' +
                '</a>' +
            '</div>';
        return;
    }

    gallery.innerHTML = data.map(function (project, index) {
        var safeDate = escapeHtml(project.date);
        var safeQ1   = escapeHtml(project.q1 || '(untitled)');
        var safeQ2   = escapeHtml(project.q2);
        return '<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col justify-between">' +
                   '<div>' +
                       '<div class="flex justify-between items-start mb-4">' +
                           '<span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">' + safeDate + '</span>' +
                           '<button' +
                               ' onclick="deleteProject(' + index + ')"' +
                               ' aria-label="Delete project: ' + safeQ1 + '"' +
                               ' class="text-slate-300 hover:text-red-500 text-lg leading-none min-w-[44px] min-h-[44px] flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"' +
                           '>&times;</button>' +
                       '</div>' +
                       '<h2 class="text-xl font-bold text-slate-900 mb-2 leading-tight">' + safeQ1 + '</h2>' +
                       '<p class="text-slate-600 text-sm line-clamp-3 italic">&ldquo;' + safeQ2 + '&rdquo;</p>' +
                   '</div>' +
                   '<div class="mt-6 pt-4 border-t border-slate-50 flex gap-4">' +
                       '<button' +
                           ' onclick="downloadExisting(' + index + ')"' +
                           ' class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1 min-h-[44px]"' +
                       '>DOWNLOAD RTF</button>' +
                   '</div>' +
               '</div>';
    }).join('');
}

function deleteProject(index) {
    var data = JSON.parse(localStorage.getItem('projectourist_data') || '[]');
    data.splice(index, 1);
    localStorage.setItem('projectourist_data', JSON.stringify(data));
    loadProjects();
}

function clearGallery() {
    if (confirm('Are you sure? This will delete all locally saved projects.')) {
        localStorage.removeItem('projectourist_data');
        loadProjects();
    }
}

function escapeRTF(text) {
    return (text || '').replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
}

function downloadExisting(index) {
    var data = JSON.parse(localStorage.getItem('projectourist_data') || '[]');
    var project = data[index];
    if (!project) { return; }
    var rtfHeader = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs28 ';
    var rtfBody = [
        '\\b PROJECT SUMMARY \\b0 \\line',
        'Generated on: ' + escapeRTF(project.date) + ' \\line \\line',
        '\\b Goal: \\b0 '         + escapeRTF(project.q1) + ' \\line',
        '\\b Difference: \\b0 '   + escapeRTF(project.q2) + ' \\line',
        '\\b End State: \\b0 '    + escapeRTF(project.q3) + ' \\line',
        '\\b Requirements: \\b0 ' + escapeRTF(project.q4) + ' \\line',
        '\\b Best Case: \\b0 '    + escapeRTF(project.q5) + ' \\line',
        '\\b Worst Case: \\b0 '   + escapeRTF(project.q6)
    ].join(' ') + ' }';
    var blob = new Blob([rtfHeader + rtfBody], { type: 'application/rtf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Project-' + Date.now() + '.rtf';
    a.click();
}

window.onload = loadProjects;
