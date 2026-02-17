"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Doll from './Doll';

export default function DollEditor({ onSave, initialData, onDelete }) {
    const [doll, setDoll] = useState(initialData || {
        id: Date.now(),
        hairColor: "#6d4c41",
        skinColor: "#f3d2c1",
        outfitColor: "#ff6b6b",
        hairStyle: 0,
        outfitStyle: 0,
        eyeType: 0,
        animationType: 'idle',
        story: "Once upon a time..."
    });

    const [transform, setTransform] = useState({
        rotate: Number(initialData?.transform?.rotate) || 0,
        scaleX: Number(initialData?.transform?.scaleX) || 1,
        scaleY: Number(initialData?.transform?.scaleY) || 1,
        skewX: Number(initialData?.transform?.skewX) || 0,
        skewY: Number(initialData?.transform?.skewY) || 0
    });

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
                <div className="grid grid-cols-2 gap-4">
                    <label>
                        <span className={labelClass}>Hair Stylew</span>
                        <select
                            value={doll.hairStyle}
                            onChange={(e) => updateDoll('hairStyle', parseInt(e.target.value))}
                            className={selectClass}
                        >
                            <option value={0}>Bob Cut</option>
                            <option value={1}>Pigtails</option>
                            <option value={2}>Spiky</option>
                            <option value={3}>Long Wavy</option>
                            <option value={4}>Bun</option>
                            <option value={5}>Curly Afro</option>
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Outfit Type</span>
                        <select
                            value={doll.outfitStyle}
                            onChange={(e) => updateDoll('outfitStyle', parseInt(e.target.value))}
                            className={selectClass}
                        >
                            <option value={0}>Basic Tee</option>
                            <option value={1}>Dress</option>
                            <option value={2}>Overalls</option>
                            <option value={3}>Kimono/Robe</option>
                            <option value={4}>Super Cape</option>
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Eye Style</span>
                        <select
                            value={doll.eyeType || 0}
                            onChange={(e) => updateDoll('eyeType', parseInt(e.target.value))}
                            className={selectClass}
                        >
                            <option value={0}>Dots</option>
                            <option value={1}>Happy</option>
                            <option value={2}>Sleepy</option>
                            <option value={3}>Anime Shine</option>
                            <option value={4}>Wink</option>
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Skin Tone</span>
                        <div className="h-[44px] w-full rounded-xl border-2 border-gray-300 overflow-hidden relative shadow-sm">
                            <input type="color" value={doll.skinColor} onChange={(e) => updateDoll('skinColor', e.target.value)} className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer p-0 border-0 touch-manipulation" />
                        </div>
                    </label>

                    <label>
                        <span className={labelClass}>Hair Color</span>
                        <div className="h-[44px] w-full rounded-xl border-2 border-gray-300 overflow-hidden relative shadow-sm">
                            <input type="color" value={doll.hairColor} onChange={(e) => updateDoll('hairColor', e.target.value)} className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer p-0 border-0 touch-manipulation" />
                        </div>
                    </label>

                    <label>
                        <span className={labelClass}>Outfit Color</span>
                        <div className="h-[44px] w-full rounded-xl border-2 border-gray-300 overflow-hidden relative shadow-sm">
                            <input type="color" value={doll.outfitColor} onChange={(e) => updateDoll('outfitColor', e.target.value)} className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer p-0 border-0 touch-manipulation" />
                        </div>
                    </label>
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
