"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { HouseShapes } from './GameAssets';

export default function HouseEditor({ onSave, initialData, onClose, onDelete }) {
    const [house, setHouse] = useState(initialData || {
        id: Date.now(),
        type: 'house_cottage',
        color: '#ff9f43',
        roofColor: '#e15f41'
    });

    const [transform, setTransform] = useState({
        rotate: Number(initialData?.transform?.rotate) || 0,
        scaleX: Number(initialData?.transform?.scaleX) || 1,
        scaleY: Number(initialData?.transform?.scaleY) || 1,
        skewX: Number(initialData?.transform?.skewX) || 0,
        skewY: Number(initialData?.transform?.skewY) || 0
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const updateHouse = useCallback((key, value) => {
        setHouse(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleTransform = useCallback((key, value) => {
        const parsed = parseFloat(value);
        setTransform(prev => ({ ...prev, [key]: isNaN(parsed) ? 0 : parsed }));
    }, []);

    // Shared classes
    const selectClass = "w-full px-3 min-h-[44px] rounded-xl border-2 border-gray-300 bg-white text-[16px] text-gray-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all cursor-pointer touch-manipulation";
    const labelClass = "block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide";
    const rangeClass = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 touch-manipulation";

    return (
        <div
            className="w-full max-w-[550px] md:mx-auto p-5 md:p-8 flex flex-col gap-5 items-center relative rounded-2xl shadow-2xl bg-white backdrop-blur-xl max-h-[90vh] overflow-y-auto overscroll-contain"
            style={{ touchAction: 'pan-y' }}
        >
            {/* Header */}
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Renovate House</h2>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white rounded-xl px-4 min-h-[40px] text-sm font-bold shadow-md hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
                >
                    Delete
                </button>
            </div>

            {/* Preview — contained in a fixed box so large transforms don't overflow */}
            <div className="w-full h-[180px] md:h-[220px] flex items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 border border-gray-100 relative shrink-0">
                <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-orange-400 tracking-wider">Preview</div>
                {/* Auto-shrink: divide by max(scaleX, scaleY) so preview always fits */}
                <div
                    style={{
                        transform: `
                            scale(${Math.min(1, 1 / Math.max(Math.abs(transform.scaleX || 1), Math.abs(transform.scaleY || 1)))}) 
                            scale(${transform.scaleX || 1}, ${transform.scaleY || 1}) 
                            rotate(${transform.rotate || 0}deg) 
                            skew(${transform.skewX || 0}deg, ${transform.skewY || 0}deg)
                        `,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out'
                    }}
                >
                    {house.type === 'house_cottage' && <HouseShapes.Cottage color={house.color} roofColor={house.roofColor} />}
                    {house.type === 'house_mansion' && <HouseShapes.Mansion color={house.color} roofColor={house.roofColor} />}
                    {house.type === 'house_pagoda' && <HouseShapes.Pagoda color={house.color} roofColor={house.roofColor} />}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 w-full bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="col-span-2">
                    <span className={labelClass}>Architecture</span>
                    <select
                        value={house.type}
                        onChange={(e) => updateHouse('type', e.target.value)}
                        className={selectClass}
                    >
                        <option value="house_cottage">Cottage</option>
                        <option value="house_mansion">Mansion</option>
                        <option value="house_pagoda">Pagoda</option>
                    </select>
                </label>

                <label>
                    <span className={labelClass}>Wall Color</span>
                    <div className="h-[44px] w-full rounded-xl border-2 border-gray-300 overflow-hidden relative shadow-sm">
                        <input
                            type="color"
                            value={house.color}
                            onChange={(e) => updateHouse('color', e.target.value)}
                            className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer p-0 border-0 touch-manipulation"
                        />
                    </div>
                </label>

                <label>
                    <span className={labelClass}>Roof Color</span>
                    <div className="h-[44px] w-full rounded-xl border-2 border-gray-300 overflow-hidden relative shadow-sm">
                        <input
                            type="color"
                            value={house.roofColor}
                            onChange={(e) => updateHouse('roofColor', e.target.value)}
                            className="absolute -top-4 -left-4 w-[200%] h-[200%] cursor-pointer p-0 border-0 touch-manipulation"
                        />
                    </div>
                </label>
            </div>

            {/* Transform Controls */}
            <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Transform</h3>

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

            {/* Save Button */}
            <div className="w-full mt-auto pt-3 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2 -mx-5 px-5 -mb-5 md:static md:bg-transparent md:p-0 md:m-0 z-10">
                <button
                    className="w-full py-4 min-h-[52px] rounded-xl bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg hover:from-orange-500 hover:to-red-500 active:scale-[0.98] transition-all font-bold text-base uppercase tracking-wide touch-manipulation"
                    onClick={() => onSave({ ...house, transform })}
                >
                    Save Renovations
                </button>
            </div>
        </div>
    );
}
