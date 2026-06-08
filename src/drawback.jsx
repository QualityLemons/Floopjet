/*
 * Drawback — HTML5 canvas drawing component for Floop Feedback Tools.
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
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const Drawback = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const clearBtnRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeColor, setActiveColor] = useState('#0f172a');
    const [statusMsg, setStatusMsg] = useState('');

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
        setStatusMsg('Canvas cleared — ready to draw again.');
        if (clearBtnRef.current) clearBtnRef.current.focus();
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
                <p className="text-slate-600 mt-2">A minimalist drawing tool for visual feedback and storytelling.</p>
            </header>

            <div className="mb-4 flex items-center space-x-4" role="group" aria-label="Choose drawing colour">
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => setActiveColor(color.value)}
                        className={`w-11 h-11 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${activeColor === color.value ? 'border-indigo-500 scale-110 shadow-md' : 'border-slate-300'}`}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.name}
                        aria-pressed={activeColor === color.value}
                    />
                ))}
                <button
                    ref={clearBtnRef}
                    onClick={handleClear}
                    className="ml-auto px-4 py-2 min-h-[44px] bg-red-400 text-white rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 font-medium text-sm"
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
                className="w-full h-[400px] bg-white rounded-lg shadow-md border cursor-crosshair touch-none"
                aria-label="Drawing canvas — use mouse or touch to draw"
                role="img"
            />

            <button
                onClick={handleSubmit}
                className="mt-6 px-6 py-3 min-h-[44px] bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Submit to Gallery
            </button>
            <p aria-live="polite" aria-atomic="true" className="sr-only">{statusMsg}</p>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<Drawback />);
