/*
 * Totes Emote — emoji sentiment picker and drawing canvas for Floop Feedback Tools.
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

const ToolContainer = ({ title, description, children, onReset }) => (
    <div className="max-w-xl mx-auto border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm mb-10">
        <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <p className="text-sm text-slate-600 mt-1">{description}</p>
            </div>
            <button
                onClick={onReset}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded min-h-[44px] px-2"
            >
                Reset
            </button>
        </div>
        <div className="tool-content min-h-[160px] flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
            {children}
        </div>
    </div>
);

const EmojiTool = () => {
    const [rating, setRating] = useState(null);
    const feedbackRef = useRef(null);
    const emojis = [
        { symbol: '😢', label: 'Sad' },
        { symbol: '😐', label: 'Neutral' },
        { symbol: '😊', label: 'Happy' },
        { symbol: '🤩', label: 'Excited' },
    ];

    useEffect(() => {
        if (rating && feedbackRef.current) {
            feedbackRef.current.focus();
        }
    }, [rating]);

    return (
        <ToolContainer
            title="How are you feeling?"
            description="A quick sentiment check — pick the emoji that best matches your mood."
            onReset={() => setRating(null)}
        >
            <div className="flex gap-6 text-5xl" role="group" aria-label="Select your mood">
                {emojis.map((emoji) => (
                    <button
                        key={emoji.symbol}
                        onClick={() => setRating(emoji.symbol)}
                        aria-label={emoji.label}
                        aria-pressed={rating === emoji.symbol}
                        className={`transition-all duration-300 transform hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            rating === emoji.symbol ? "grayscale-0 scale-125 drop-shadow-lg" : "grayscale opacity-30 hover:opacity-60"
                        }`}
                    >
                        {emoji.symbol}
                    </button>
                ))}
            </div>
            {rating && (
                <p
                    ref={feedbackRef}
                    tabIndex={-1}
                    className="mt-4 text-slate-600 text-sm font-medium focus:outline-none"
                    aria-live="polite"
                >
                    Captured: <span aria-label={emojis.find(e => e.symbol === rating)?.label}>{rating}</span>
                </p>
            )}
        </ToolContainer>
    );
};

const DrawingCanvas = () => {
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
        context.lineWidth = 4;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = activeColor;
        }
    }, [activeColor]);

    const getCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
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

    const clear = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <ToolContainer
            title="Visual Sketch"
            description="Draw a picture to describe your experience."
            onReset={clear}
        >
            <div className="w-full flex flex-col gap-4">
                <canvas
                    ref={canvasRef}
                    onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
                    onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
                    className="w-full h-64 bg-white border border-slate-200 rounded-lg cursor-crosshair touch-none shadow-inner"
                    aria-label="Drawing canvas — use mouse or touch to sketch"
                    role="img"
                />
                <div className="flex justify-center gap-4" role="group" aria-label="Choose drawing colour">
                    {colors.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => setActiveColor(c.value)}
                            aria-label={c.name}
                            aria-pressed={activeColor === c.value}
                            className={`w-11 h-11 rounded-full border-4 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                activeColor === c.value ? 'border-slate-300 scale-110 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.value }}
                        />
                    ))}
                </div>
            </div>
        </ToolContainer>
    );
};

const App = () => (
    <div className="container mx-auto">
        <EmojiTool />
        <DrawingCanvas />
    </div>
);

const root = createRoot(document.getElementById('root'));
root.render(<App />);
