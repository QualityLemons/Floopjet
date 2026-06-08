/*
 * LEGACY FILE — NO LONGER LOADED BY ANY PAGE.
 *
 * This file previously used React 18, ReactDOM 18, and Babel Standalone as browser globals
 * loaded from unpkg CDN, and was included via <script type="text/babel"> in gallery.html.
 *
 * Former external dependencies (browser globals, no longer loaded):
 *   - React 18       — https://unpkg.com/react@18/umd/react.production.min.js
 *   - ReactDOM 18    — https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
 *   - Babel Standalone — https://unpkg.com/@babel/standalone/babel.min.js
 *
 * It has been superseded by src/gallery.jsx, which uses proper ES module imports and is
 * compiled at build time by Vite into assets/js/dist/gallery.js.
 * gallery.html now loads assets/js/dist/gallery.js instead of this file.
 *
 * This file is retained for historical reference only.
 */
const { useState, useEffect } = React;

const Gallery = () => {
    const [drawings, setDrawings] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem('sandbox-gallery');
        if (data) {
            setDrawings(JSON.parse(data));
        }
    }, []);

    const handleClear = () => {
        if (window.confirm("Delete all drawings in the gallery?")) {
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
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 mb-6 text-lg font-medium">The gallery is currently empty.</p>
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
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                    {item.date}
                                </span>
                                <span aria-hidden="true">🎨</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="mt-20 text-center border-t border-slate-200 pt-10">
                <p className="text-slate-400 text-xs tracking-widest uppercase">End of Gallery</p>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Gallery />);
