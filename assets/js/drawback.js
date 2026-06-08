/*
 * LEGACY FILE — NO LONGER LOADED BY ANY PAGE.
 *
 * This file previously used React 18, ReactDOM 18, and Babel Standalone as browser globals
 * loaded from unpkg CDN, and was included via <script type="text/babel"> in drawback.html.
 *
 * Former external dependencies (browser globals, no longer loaded):
 *   - React 18       — https://unpkg.com/react@18/umd/react.production.min.js
 *   - ReactDOM 18    — https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
 *   - Babel Standalone — https://unpkg.com/@babel/standalone/babel.min.js
 *
 * It has been superseded by src/drawback.jsx, which uses proper ES module imports and is
 * compiled at build time by Vite into assets/js/dist/drawback.js.
 * drawback.html now loads assets/js/dist/drawback.js instead of this file.
 *
 * This file is retained for historical reference only.
 */
const { useState, useRef, useEffect } = React;

const Drawback = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeColor, setActiveColor] = useState('#0f172a');

    const colors = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Black', value: '#0f172a' }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.lineWidth = 5;
        context.strokeStyle = activeColor;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = activeColor;
        }
    }, [activeColor]);

    const getCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const start = (e) => {
        const { x, y } = getCoords(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoords(e);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const stop = () => {
        if (isDrawing) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    };

    const handleClear = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');
        const savedData = localStorage.getItem('sandbox-gallery');
        const existing = savedData ? JSON.parse(savedData) : [];
        const newEntry = {
            id: Date.now(),
            image: imageData,
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem('sandbox-gallery', JSON.stringify([newEntry, ...existing]));
        window.location.href = 'gallery.html';
    };

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Drawback</h1>
                <p className="text-slate-500 mt-2">A minimalist drawing tool for visual feedback and storytelling.</p>
            </header>

            <div className="mb-4 flex space-x-4">
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => setActiveColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 ${activeColor === color.value ? 'border-indigo-500' : 'border-slate-300'} focus:outline-none`}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.name}
                        aria-pressed={activeColor === color.value}
                    />
                ))}
                <button
                    onClick={handleClear}
                    className="ml-auto px-3 py-1 bg-red-400 text-white rounded hover:bg-red-600 transition-all"
                >
                    Clear
                </button>
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={start}
                onMouseMove={draw}
                onMouseUp={stop}
                onMouseLeave={stop}
                onTouchStart={start}
                onTouchMove={draw}
                onTouchEnd={stop}
                className="w-full h-[400px] bg-white rounded-lg shadow-md border"
            />

            <button
                onClick={handleSubmit}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
                Submit to Gallery
            </button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Drawback />);
