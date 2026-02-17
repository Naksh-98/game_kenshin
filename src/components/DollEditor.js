"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Doll from './Doll';

export default function DollEditor({ onSave, initialData, onDelete }) {
    const [doll, setDoll] = useState({
        id: Date.now(),
        hairColor: "#6d4c41",
        skinColor: "#f3d2c1",
        outfitColor: "#ff6b6b",
        hairStyle: 0,
        outfitStyle: 0,
        eyeType: 0,
        animationType: 'idle',
        story: "Once upon a time...",
        ...initialData // Merge provided data over defaults
    });

    const [transform, setTransform] = useState({
        rotate: Number(initialData?.transform?.rotate) || 0,
        scaleX: Number(initialData?.transform?.scaleX) || 1,
        scaleY: Number(initialData?.transform?.scaleY) || 1,
        skewX: Number(initialData?.transform?.skewX) || 0,
        skewY: Number(initialData?.transform?.skewY) || 0
    });

    const [showHexInput, setShowHexInput] = useState(null); // 'skin' | 'hair' | 'outfit' | null

    // Comprehensive safe color palette for mobile
    const safeColors = [
        '#ffadad', '#ff6b6b', '#ff4757', '#c0392b', // Reds
        '#ffd6a5', '#fdcb6e', '#e17055', '#d35400', // Oranges
        '#fdffb6', '#ffeaa7', '#f1c40f', '#f39c12', // Yellows
        '#caffbf', '#55efc4', '#00b894', '#27ae60', // Greens
        '#9bf6ff', '#74b9ff', '#0984e3', '#2980b9', // Blues
        '#a0c4ff', '#a29bfe', '#6c5ce7', '#8e44ad', // Purples
        '#ffc6ff', '#fd79a8', '#e84393', '#d63031', // Pinks
        '#ffffff', '#dfe6e9', '#b2bec3', '#636e72', '#2d3436', '#000000', // Grays
        '#f3d2c1', '#ffdbac', '#e0ac69', '#cd8c5e', '#b37142', '#8d5524', '#5e3a18', '#3c2314' // Skin/Hair
    ];

    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen on mount and resize
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const updateDoll = useCallback((key, value) => {
        setDoll(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleTransform = useCallback((key, value) => {
        const parsed = parseFloat(value);
        setTransform(prev => ({ ...prev, [key]: isNaN(parsed) ? 0 : parsed }));
    }, []);

    // Shared select classes — 16px font prevents iOS zoom, min-h-[44px] ensures touch target
    const selectClass = "w-full px-3 min-h-[44px] rounded-xl border-2 border-gray-300 bg-white text-[16px] text-gray-900 font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all cursor-pointer touch-manipulation";

    // Shared label classes
    const labelClass = "block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide";

    // Shared range slider classes — taller hit area
    const rangeClass = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500 touch-manipulation";

    const ColorSection = ({ label, field, presets }) => (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className={labelClass}>{label}</span>
                <button
                    onClick={() => setShowHexInput(showHexInput === field ? null : field)}
                    className="text-[10px] items-center flex gap-1 text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors"
                >
                    {showHexInput === field ? 'Hide Colors' : 'More Colors 🎨'}
                </button>
            </div>

            {/* Main Presets */}
            <div className="flex flex-wrap gap-2">
                {presets.map(c => (
                    <button
                        key={c}
                        onClick={() => updateDoll(field, c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${doll[field] === c ? 'border-rose-500 scale-110 shadow-md ring-2 ring-rose-200' : 'border-gray-200 hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
            </div>

            {/* Expanded Palette */}
            {showHexInput === field && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                    <div className="grid grid-cols-8 gap-1.5 mb-3">
                        {safeColors.map(c => (
                            <button
                                key={c}
                                onClick={() => updateDoll(field, c)}
                                className={`w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-125 ${doll[field] === c ? 'ring-2 ring-rose-400 ring-offset-1 z-10 scale-110' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Hex</span>
                        <div className="flex-1 relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">#</span>
                            <input
                                type="text"
                                value={(doll[field] || '').replace('#', '')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9A-Fa-f]*$/.test(val) && val.length <= 6) {
                                        updateDoll(field, '#' + val);
                                    }
                                }}
                                className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-300 text-sm font-mono focus:border-rose-500 focus:outline-none uppercase"
                                placeholder="FF0000"
                                maxLength={6}
                            />
                        </div>
                        <div className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm" style={{ backgroundColor: doll[field] }} />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div
            className="w-full md:w-[700px] max-h-[90vh] md:mx-auto flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-2xl bg-white backdrop-blur-xl"
            style={{ touchAction: 'pan-y' }} // Allow vertical scroll, prevent unwanted gestures
        >
            {/* Preview Section (Top on mobile) */}
            <div className="shrink-0 md:flex-[0.8] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 bg-rose-50/50 p-4 md:p-6 relative">
                <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-rose-400 tracking-wider">Preview</div>

                {/* Preview — auto-shrinks so large scale values still fit */}
                <div
                    style={{
                        transform: `
                            scale(${Math.min(1, 1 / Math.max(Math.abs(transform.scaleX || 1), Math.abs(transform.scaleY || 1)))}) 
                            scale(${transform.scaleX || 1}, ${transform.scaleY || 1}) 
                            rotate(${transform.rotate || 0}deg) 
                            skew(${transform.skewX || 0}deg, ${transform.skewY || 0}deg)
                        `,
                        transformOrigin: 'center bottom',
                        transition: 'transform 0.15s ease-out'
                    }}
                >
                    <Doll {...doll} isAnimating={doll.animationType === 'walking'} />
                </div>

                {/* Animation Buttons */}
                <div className="mt-2 md:mt-auto w-full text-center">
                    <span className={labelClass}>Animation</span>
                    <div className="flex gap-2 justify-center bg-white/60 p-1.5 rounded-xl backdrop-blur-sm">
                        {['idle', 'walking', 'waving', 'dancing'].map(type => (
                            <button
                                key={type}
                                onClick={() => updateDoll('animationType', type)}
                                className={`px-4 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-all uppercase touch-manipulation ${doll.animationType === type
                                    ? 'bg-rose-500 text-white shadow-md scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200 shadow-sm'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto p-4 md:p-6 bg-white overscroll-contain">

                {/* Header with Delete */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Customize</h2>
                    <button
                        onClick={onDelete}
                        className="bg-red-500 text-white rounded-xl px-4 min-h-[40px] text-sm font-bold shadow-md hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
                    >
                        Delete
                    </button>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <span className={labelClass}>Hair Style</span>
                        <div className="grid grid-cols-3 gap-2">
                            {['Bob', 'Pigtails', 'Spiky', 'Long', 'Bun', 'Afro', 'Mohawk', 'Side', 'Bald'].map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateDoll('hairStyle', i)}
                                    className={`px-1 py-2 rounded-lg text-[10px] font-bold border-2 transition-all touch-manipulation ${doll.hairStyle === i
                                        ? 'bg-rose-500 text-white border-rose-500'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className={labelClass}>Outfit Type</span>
                        <div className="grid grid-cols-3 gap-2">
                            {['Tee', 'Dress', 'Overalls', 'Kimono', 'Cape', 'Hoodie', 'Suit', 'Quest'].map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateDoll('outfitStyle', i)}
                                    className={`px-1 py-2 rounded-lg text-[10px] font-bold border-2 transition-all touch-manipulation ${doll.outfitStyle === i
                                        ? 'bg-rose-500 text-white border-rose-500'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className={labelClass}>Eye Style</span>
                        <div className="grid grid-cols-3 gap-2">
                            {['Dots', 'Happy', 'Sleepy', 'Anime', 'Wink', 'OMG', 'Angry', 'Tears', 'Heart'].map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateDoll('eyeType', i)}
                                    className={`px-1 py-2 rounded-lg text-[10px] font-bold border-2 transition-all touch-manipulation ${doll.eyeType === i
                                        ? 'bg-rose-500 text-white border-rose-500'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ColorSection
                        label="Skin Tone"
                        field="skinColor"
                        presets={['#f3d2c1', '#ffdbac', '#e0ac69', '#c68642', '#8d5524', '#3c2314']}
                    />

                    <ColorSection
                        label="Hair Color"
                        field="hairColor"
                        presets={['#6d4c41', '#2c3e50', '#f1c40f', '#e74c3c', '#ecf0f1', '#e056fd']}
                    />

                    <ColorSection
                        label="Outfit Color"
                        field="outfitColor"
                        presets={['#ff6b6b', '#54a0ff', '#1dd1a1', '#feca57', '#5f27cd', '#2c3e50']}
                    />
                </div>

                {/* Transform Controls */}
                <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pose & Size</h3>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-bold text-gray-600">Scale X ({Number(transform.scaleX).toFixed(1)})</label>
                            <input
                                type="range" min="0.1" max="3" step="0.1" value={transform.scaleX}
                                onChange={(e) => handleTransform('scaleX', e.target.value)}
                                className={rangeClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-bold text-gray-600">Scale Y ({Number(transform.scaleY).toFixed(1)})</label>
                            <input
                                type="range" min="0.1" max="3" step="0.1" value={transform.scaleY}
                                onChange={(e) => handleTransform('scaleY', e.target.value)}
                                className={rangeClass}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-bold text-gray-600">Skew X ({Math.round(transform.skewX)}°)</label>
                            <input
                                type="range" min="-45" max="45" value={transform.skewX}
                                onChange={(e) => handleTransform('skewX', e.target.value)}
                                className={rangeClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-bold text-gray-600">Skew Y ({Math.round(transform.skewY)}°)</label>
                            <input
                                type="range" min="-45" max="45" value={transform.skewY}
                                onChange={(e) => handleTransform('skewY', e.target.value)}
                                className={rangeClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Story */}
                <div className="w-full">
                    <span className={labelClass}>Their Story</span>
                    <textarea
                        value={doll.story}
                        onChange={(e) => updateDoll('story', e.target.value)}
                        placeholder="Write a sweet story..."
                        className="w-full h-20 p-3 rounded-xl border-2 border-gray-300 bg-white text-[16px] text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all touch-manipulation"
                    />
                </div>

                {/* Save Button — sticky bottom on mobile */}
                <div className="mt-auto pt-3 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2 -mx-4 px-4 -mb-4 md:static md:bg-transparent md:p-0 md:m-0 z-10">
                    <button
                        className="w-full py-4 min-h-[52px] rounded-xl bg-rose-500 text-white shadow-lg hover:bg-rose-600 active:bg-rose-700 active:scale-[0.98] transition-all font-bold text-base uppercase tracking-wide touch-manipulation"
                        onClick={() => onSave({ ...doll, transform })}
                    >
                        Save Doll
                    </button>
                </div>
            </div>
        </div>
    );
}
