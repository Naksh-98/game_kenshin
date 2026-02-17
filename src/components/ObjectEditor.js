"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { getAsset } from './GameAssets';

export default function ObjectEditor({ onSave, initialData, onClose, onDelete }) {
    const [data, setData] = useState(initialData?.data || {});

    const [transform, setTransform] = useState({
        rotate: Number(initialData?.data?.transform?.rotate) || 0,
        scaleX: Number(initialData?.data?.transform?.scaleX) || 1,
        scaleY: Number(initialData?.data?.transform?.scaleY) || 1,
        skewX: Number(initialData?.data?.transform?.skewX) || 0,
        skewY: Number(initialData?.data?.transform?.skewY) || 0
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleChange = useCallback((key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleTransform = useCallback((key, value) => {
        const parsed = parseFloat(value);
        setTransform(prev => ({ ...prev, [key]: isNaN(parsed) ? 0 : parsed }));
    }, []);

    const handleSave = () => {
        onSave({ ...data, transform });
    };

    // Shared classes
    const labelClass = "block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide";
    const rangeClass = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 touch-manipulation";

    return (
        <div
            className="w-full md:w-[700px] max-h-[85vh] flex flex-col-reverse md:flex-row overflow-hidden rounded-2xl shadow-2xl bg-white backdrop-blur-xl"
            style={{ touchAction: 'pan-y' }}
        >

            {/* LEFT: Controls (Bottom on mobile) */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto border-t md:border-t-0 md:border-r border-gray-200 flex flex-col gap-4 overscroll-contain">

                {/* Header */}
                <div className="flex justify-between items-center sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-4 px-4 -mt-4 pt-4 pb-2">
                    <h3 className="font-bold text-xl text-gray-900">Customize Object</h3>
                    <button
                        onClick={onDelete}
                        className="bg-red-500 text-white rounded-xl px-4 min-h-[40px] text-sm font-bold shadow-md hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
                    >
                        Delete
                    </button>
                </div>

                <div className="flex flex-col gap-3">

                    {/* Water Specific Controls - Add Fish */}
                    {['pond', 'river_h', 'river_v'].includes(initialData.type) && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <h4 className="mb-3 text-xs font-bold text-blue-800 uppercase tracking-wide">Add Fish Here 🐟</h4>

                            <label className="block mb-3">
                                <span className="text-xs font-bold text-blue-700 block mb-1">Fish Color</span>
                                <div className="flex gap-2 flex-wrap items-center">
                                    {/* Custom Color Picker */}
                                    <label className="relative cursor-pointer w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform">
                                        <input
                                            type="color"
                                            value={data.fishColor || '#ff9f43'}
                                            onChange={(e) => handleChange('fishColor', e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 border-0 cursor-pointer"
                                        />
                                    </label>

                                    {/* Presets */}
                                    {['#ff9f43', '#ff6b6b', '#54a0ff', '#feca57', '#48dbfb', '#1dd1a1'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => handleChange('fishColor', c)}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${data.fishColor === c ? 'border-black scale-110 shadow' : 'border-white'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </label>

                            <label className="block mb-4">
                                <span className="text-xs font-bold text-blue-700 block mb-1">Fish Scale: {data.fishScale || 1}x</span>
                                <input
                                    type="range" min="0.5" max="2" step="0.1"
                                    value={data.fishScale || 1}
                                    onChange={(e) => handleChange('fishScale', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </label>

                            <button
                                onClick={() => {
                                    const fishData = {
                                        color: data.fishColor || '#ff9f43',
                                        scale: data.fishScale || 1
                                    };
                                    initialData.onAddFish && initialData.onAddFish(fishData);
                                }}
                                className="w-full py-3 rounded-lg bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2"
                            >
                                <span>+ Spawn Fish</span>
                            </button>
                        </div>
                    )}

                    {/* Garden Specific Controls */}
                    {initialData.type === 'garden' && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="mb-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Garden Settings</h4>
                            <div className="flex gap-4 mb-3">
                                <label className="flex-1">
                                    <span className="text-xs font-bold text-gray-600 block mb-1.5">Rows: {data.rows || 2}</span>
                                    <input
                                        type="range" min="1" max="6" value={data.rows || 2}
                                        onChange={(e) => handleChange('rows', parseInt(e.target.value))}
                                        className={rangeClass}
                                    />
                                </label>
                                <label className="flex-1">
                                    <span className="text-xs font-bold text-gray-600 block mb-1.5">Cols: {data.cols || 2}</span>
                                    <input
                                        type="range" min="1" max="6" value={data.cols || 2}
                                        onChange={(e) => handleChange('cols', parseInt(e.target.value))}
                                        className={rangeClass}
                                    />
                                </label>
                            </div>
                            <label>
                                <span className="text-xs font-bold text-gray-600 block mb-2">Flower Type</span>
                                <div className="flex gap-2 flex-wrap">
                                    {['none', 'rose', 'tulip', 'sunflower', 'lavender'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => handleChange('flowerType', type)}
                                            className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-bold border-2 transition-all touch-manipulation ${data.flowerType === type
                                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Transform Controls */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Transform</h4>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600">Rotation ({Math.round(transform.rotate)}°)</label>
                            <input
                                type="range" min="-180" max="180" value={transform.rotate}
                                onChange={(e) => handleTransform('rotate', e.target.value)}
                                className={rangeClass}
                            />
                        </div>

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
                </div>

                {/* Save Button */}
                <div className="mt-auto pt-3 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2 -mx-4 px-4 -mb-4 md:static md:bg-transparent md:p-0 md:m-0 z-10">
                    <button
                        className="w-full py-4 min-h-[52px] rounded-xl bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 active:bg-indigo-700 active:scale-[0.98] transition-all font-bold text-base uppercase tracking-wide touch-manipulation"
                        onClick={handleSave}
                    >
                        Apply Changes
                    </button>
                </div>
            </div>

            {/* RIGHT: Preview (Top on mobile) */}
            <div className="h-40 md:h-auto md:flex-1 bg-gray-50 flex items-center justify-center relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-l border-gray-200">
                <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/80 px-2 py-1 rounded-lg">
                    Preview
                </div>

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

                {/* Object Preview — auto-shrinks so large scale values still fit */}
                <div style={{
                    transition: 'transform 0.15s ease-out',
                    transform: `
                        scale(${Math.min(0.75, 0.75 / Math.max(Math.abs(transform.scaleX || 1), Math.abs(transform.scaleY || 1)))})
                        rotate(${transform.rotate || 0}deg) 
                        scale(${transform.scaleX || 1}, ${transform.scaleY || 1}) 
                        skew(${transform.skewX || 0}deg, ${transform.skewY || 0}deg)
                    `,
                    transformOrigin: 'center center'
                }}>
                    {getAsset(initialData.type, data)}
                </div>
            </div>

        </div>
    );
}
