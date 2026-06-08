/*
 * Gallery — saved-drawings gallery component for Floop Feedback Tools.
 * Project code written for this application.
 *
 * External library dependencies (installed via npm, bundled by Vite):
 *   - React 18          https://react.dev          (UI component model and hooks)
 *   - ReactDOM 18       https://react.dev          (DOM renderer — createRoot)
 *
 * No external code has been copied into this file.
 * React and ReactDOM are imported as published npm packages; only their
 * public API surface is used here.
 * Author: John E. Parman
 */
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const Gallery = () => {
    const [drawings, setDrawings] = useState([]);
    const emptyRef = useRef(null);
    const justCleared = useRef(false);

    useEffect(() => {
        const data = localStorage.getItem('sandbox-gallery');
        if (data) {
            setDrawings(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        if (justCleared.current && drawings.length === 0 && emptyRef.current) {
            emptyRef.current.focus();
            justCleared.current = false;
        }
    }, [drawings]);

    const handleClear = () => {
        if (window.confirm("Delete all drawings in the gallery?")) {
            justCleared.current = true;
            localStorage.removeItem('sandbox-gallery');
            setDrawings([]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleClear}
                    className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded"
                >
                    Clear All
                </button>
            </div>

            <header className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Gallery</h1>
                <p className="text-slate-500 mt-2">Visual feedback collected via Drawback.</p>
            </header>

            {drawings.length === 0 ? (
                <div ref={emptyRef} tabIndex={-1} className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 focus:outline-none">
                    <p className="text-slate-600 mb-6 text-lg font-medium">The gallery is currently empty.</p>
                    <a
                        href="drawback.html"
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                        Start a new Drawback
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drawings.map((item) => (
                        <div key={item.id} className="sandbox-card !p-0 overflow-hidden animate-in">
                            <div className="aspect-square bg-white flex items-center justify-center border-b border-slate-100">
                                <img
                                    src={item.image}
                                    alt="User drawing"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="p-4 bg-white flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                    {item.date}
                                </span>
                                <span aria-hidden="true">🎨</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="mt-20 text-center border-t border-slate-200 pt-10">
                <p className="text-slate-600 text-xs tracking-widest uppercase">End of Gallery</p>
            </footer>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<Gallery />);
