"use client";
import React, { useState, useRef, useEffect } from 'react';
import Doll from './Doll';
import { getAsset } from './GameAssets';

export default function VillageMap({ items, setItems, onEditItem, highlightedId, horizonPos: rawHorizonPos = 50, isSelectionMode, onToggleSelection, scrollContainerRef }) {
    const horizonPos = parseInt(rawHorizonPos, 10) || 50;
    const [draggingId, setDraggingId] = useState(null); // Can be 'multi' if dragging multiple
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Used for single item
    const [dragOffsets, setDragOffsets] = useState({}); // Used for multi drag { id: {dx, dy} }
    const containerRef = useRef(null);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    // Ref for synchronous touch tracking (Fixes mobile tap issues)
    const interactionData = useRef({ startX: 0, startY: 0, itemId: null });
    const backgroundDrag = useRef({ startX: 0, startScrollLeft: 0 });
    const lastTouchTime = useRef(0);

    const [selectedIds, setSelectedIds] = useState([]);

    // Clear selection when mode changes - REMOVED so selection persists
    // useEffect(() => {
    //     if (!isSelectionMode) {
    //         setSelectedIds([]);
    //     }
    // }, [isSelectionMode]);

    // NPC Logic
    useEffect(() => {
        // Calculate ground start Y
        const groundY = (window.innerHeight * (horizonPos / 100)) - 20; // 20px buffer
        const dockSafeZone = 100; // Reserve bottom 100px for the dock UI

        // Only dolls move
        const interval = setInterval(() => {
            setItems(prevItems => {
                let specificUpdates = false;
                const newItems = prevItems.map(item => {

                    // ===== FISH LOGIC =====
                    if (item.type === 'fish') {
                        if (draggingId === item.id) return item;

                        const fishState = item.fish || { dx: (Math.random() - 0.5) * 1, dy: (Math.random() - 0.5) * 0.5 };

                        // Dimensions map
                        const dims = {
                            pond: { w: 120, h: 100 },
                            river_h: { w: 100, h: 60 },
                            river_v: { w: 60, h: 100 }
                        };

                        // Helper to get bounds
                        const getBounds = (wItem) => {
                            if (!dims[wItem.type]) return null;
                            const d = dims[wItem.type];
                            const sX = wItem.data?.transform?.scaleX || 1;
                            const sY = wItem.data?.transform?.scaleY || 1;

                            // Center of the item
                            const cx = wItem.x + d.w / 2;
                            const cy = wItem.y + d.h / 2;

                            // Scaled half-sizes
                            const halfW = (d.w * Math.abs(sX)) / 2;
                            const halfH = (d.h * Math.abs(sY)) / 2;

                            return {
                                minX: cx - halfW,
                                maxX: cx + halfW,
                                minY: cy - halfH,
                                maxY: cy + halfH
                            };
                        };

                        // Find container water item (must be fully overlapping or close)
                        const water = prevItems.find(w => {
                            if (!['pond', 'river_h', 'river_v'].includes(w.type)) return false;
                            const b = getBounds(w);
                            // Relaxed bounds for "finding" the water (add margin)
                            const margin = 20;
                            return item.x > b.minX - margin && item.x < b.maxX + margin &&
                                item.y > b.minY - margin && item.y < b.maxY + margin;
                        });

                        if (!water) {
                            // Not in water? Stop moving.
                            return item;
                        }

                        const b = getBounds(water);

                        let newX = item.x + fishState.dx;
                        let newY = item.y + fishState.dy;

                        // Bounce logic
                        const padding = 10;
                        const minX = b.minX + padding;
                        const maxX = b.maxX - padding;
                        const minY = b.minY + padding;
                        const maxY = b.maxY - padding;

                        if (newX < minX || newX > maxX) {
                            fishState.dx = -fishState.dx;
                            newX = Math.max(minX, Math.min(maxX, newX));
                        }
                        if (newY < minY || newY > maxY) {
                            fishState.dy = -fishState.dy;
                            newY = Math.max(minY, Math.min(maxY, newY));
                        }

                        // Randomly change direction slightly
                        if (Math.random() < 0.05) {
                            fishState.dx += (Math.random() - 0.5) * 0.5;
                            fishState.dy += (Math.random() - 0.5) * 0.5;
                            // Clamp speed
                            fishState.dx = Math.max(-0.8, Math.min(0.8, fishState.dx));
                            fishState.dy = Math.max(-0.5, Math.min(0.5, fishState.dy));
                        }

                        // Flip sprite based on direction
                        const scaleX = fishState.dx > 0 ? -1 : 1;
                        // Preserve existing user scale if any (multiply?) - Usually fish scale is set in data.transform.scaleX/Y
                        // But wait! data.transform.scaleX is used for "Fish Size" slider.
                        // We need to Apply the "flip" on top of the size.
                        // The asset renderer uses `transform: scale(...)`.
                        // If we set scaleX to -1, we override the user's size (e.g. 1.5).
                        // We should read the "user scale" from the fish data if we stored it separately?
                        // Actually, in ObjectEditor we save `scaleX`/`scaleY` into `data.transform`.
                        // We need to know the "base" size (from slider) vs "direction" flip.
                        // For now, let's assume `data.transform.scaleX` is absolute size, and we check its sign?
                        // A simpler way: The Fish Asset accepts a `scale` prop (from our earlier edit).
                        // Let's check GameAssets.js... It uses `scale` prop.
                        // But `VillageMap` renders with `transform: scale(...)` based on `item.data.transform`.
                        // This double-scaling might be tricky.

                        // Let's look at VillageMap render:
                        // scale(${item.data?.transform?.scaleX || 1}, ${item.data?.transform?.scaleY || 1})

                        // If we want to FLIP it, we must negate `scaleX`.
                        // But we want to preserve the magnitude (size).

                        const currentScaleX = Math.abs(item.data?.transform?.scaleX || 1);
                        const newScaleX = fishState.dx > 0 ? -currentScaleX : currentScaleX;

                        const newData = {
                            ...item.data,
                            transform: {
                                ...item.data?.transform,
                                scaleX: newScaleX
                            }
                        };

                        specificUpdates = true;
                        return { ...item, x: newX, y: newY, fish: fishState, data: newData };
                    }

                    if (item.type !== 'doll') return item;

                    // Don't move if being dragged or selected
                    if (draggingId === item.id || (draggingId === 'multi' && selectedIds.includes(item.id))) return item;

                    // ===== SAVED ANIMATION IS THE SOURCE OF TRUTH =====
                    // 'idle'    → stand still, no movement
                    // 'walking' → walk around the village
                    // 'waving'  → stand still, wave animation (handled by renderer)
                    const savedAnim = item.data?.animationType || 'idle';

                    // Initialize NPC state if missing
                    const npcState = item.npc || {
                        action: 'idle',
                        targetX: item.x,
                        targetY: item.y,
                        lastUpdate: Date.now() - 3000 // Expired so walking dolls start immediately
                    };

                    const now = Date.now();

                    // ===== FORCE-SYNC: if user changed animation in editor, override NPC immediately =====
                    // If the doll is NOT set to 'walking' but the NPC is currently walking → STOP it
                    if (savedAnim !== 'walking' && npcState.action === 'walking') {
                        npcState.action = 'idle';
                        npcState.lastUpdate = now;
                        specificUpdates = true;
                        return { ...item, npc: { ...npcState } };
                    }

                    // ===== ONLY 'walking' dolls should ever move =====
                    if (savedAnim !== 'walking') {
                        // Idle / Waving dolls: only need to handle the isInSky fix
                        const isInSky = item.y < groundY - 50;
                        if (isInSky) {
                            // Walk down to ground even if idle/waving (safety net)
                            npcState.action = 'walking';
                            npcState.targetX = item.x;
                            npcState.targetY = Math.min(groundY + Math.random() * 100, window.innerHeight - dockSafeZone);
                            npcState.lastUpdate = now;
                            npcState.startTime = now;
                            npcState.startX = item.x;
                            npcState.startY = item.y;
                            npcState.duration = Math.abs(item.y - npcState.targetY) * 20;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }

                        // Chatting interaction still works for non-walking dolls
                        if (npcState.action === 'idle') {
                            const nearby = prevItems.find(other =>
                                other.id !== item.id &&
                                other.type === 'doll' &&
                                other.npc?.action !== 'talking' &&
                                Math.hypot(other.x - item.x, other.y - item.y) < 80
                            );
                            if (nearby) {
                                npcState.action = 'talking';
                                npcState.lastUpdate = now;
                                npcState.duration = 4000;
                                specificUpdates = true;
                                return { ...item, npc: { ...npcState } };
                            }
                        }

                        if (npcState.action === 'talking') {
                            if (now - npcState.lastUpdate > npcState.duration) {
                                npcState.action = 'idle';
                                npcState.lastUpdate = now;
                                specificUpdates = true;
                                return { ...item, npc: { ...npcState } };
                            }
                        }

                        // Ensure NPC state is saved if it was just initialized
                        if (!item.npc) {
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }

                        return item;
                    }

                    // ===== WALKING DOLLS: full movement AI =====

                    // If idle and timeout expired → start a new walk
                    if (npcState.action === 'idle' && now - npcState.lastUpdate > 2000) {
                        const isInSky = item.y < groundY - 50;
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 50 + Math.random() * 150;

                        npcState.action = 'walking';
                        const worldWidth = window.innerWidth * 3;
                        npcState.targetX = Math.max(0, Math.min(worldWidth - 100, item.x + Math.cos(angle) * dist));

                        let potentialY = item.y + Math.sin(angle) * dist;
                        if (isInSky) {
                            potentialY = groundY + Math.random() * 100;
                        }
                        // Clamp Y above the dock safe zone
                        npcState.targetY = Math.max(groundY, Math.min(window.innerHeight - dockSafeZone, potentialY));

                        npcState.lastUpdate = now;
                        npcState.startTime = now;
                        npcState.startX = item.x;
                        npcState.startY = item.y;
                        npcState.duration = dist * 20;
                        specificUpdates = true;
                        return { ...item, npc: { ...npcState } };
                    }

                    // If currently walking, interpolate position
                    if (npcState.action === 'walking') {
                        const elapsed = now - npcState.startTime;
                        const progress = Math.min(1, elapsed / npcState.duration);

                        const newX = npcState.startX + (npcState.targetX - npcState.startX) * progress;
                        const newY = npcState.startY + (npcState.targetY - npcState.startY) * progress;

                        if (progress >= 1) {
                            npcState.action = 'idle';
                            npcState.lastUpdate = now;
                        }

                        specificUpdates = true;
                        return { ...item, x: newX, y: newY, npc: { ...npcState } };
                    }

                    // Chatting
                    if (npcState.action === 'idle') {
                        const nearby = prevItems.find(other =>
                            other.id !== item.id &&
                            other.type === 'doll' &&
                            other.npc?.action !== 'talking' &&
                            Math.hypot(other.x - item.x, other.y - item.y) < 80
                        );
                        if (nearby) {
                            npcState.action = 'talking';
                            npcState.lastUpdate = now;
                            npcState.duration = 4000;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }
                    }

                    if (npcState.action === 'talking') {
                        if (now - npcState.lastUpdate > npcState.duration) {
                            npcState.action = 'idle';
                            npcState.lastUpdate = now;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }
                    }

                    // Ensure NPC state is saved if it was just initialized
                    if (!item.npc) {
                        specificUpdates = true;
                        return { ...item, npc: { ...npcState } };
                    }

                    return item;
                });

                return specificUpdates ? newItems : prevItems;
            });
        }, 50); // 20fps for logic/movement
        return () => clearInterval(interval);
    }, [horizonPos, draggingId, selectedIds]);

    // Mouse Handlers
    const handleMouseDown = (e, id, x, y) => {
        e.stopPropagation();

        // Mobile Fix: Prevent double-firing (touch followed by simulated mouse click)
        if (e.type === 'touchstart') {
            lastTouchTime.current = Date.now();
        } else if (e.type === 'mousedown') {
            if (Date.now() - lastTouchTime.current < 500) return;
        }

        if (isSelectionMode) {
            // Toggle selection
            if (selectedIds.includes(id)) {
                setSelectedIds(prev => prev.filter(sid => sid !== id));
            } else {
                setSelectedIds(prev => [...prev, id]);
            }
            return;
        }

        // Check if we are starting a drag on a selected item
        if (selectedIds.includes(id)) {
            // Start multi-drag
            setDraggingId('multi');
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;

            // Calculate offsets for ALL selected items relative to mouse
            const newOffsets = {};
            items.filter(i => selectedIds.includes(i.id)).forEach(i => {
                const scrollX = scrollContainerRef?.current?.scrollLeft || 0;
                newOffsets[i.id] = { dx: (clientX + scrollX) - i.x, dy: clientY - i.y };
            });
            setDragOffsets(newOffsets);
            setDragStartPos({ x: clientX, y: clientY });

            // Sync ref for robust touch detection
            interactionData.current = { startX: clientX, startY: clientY, itemId: 'multi' };
        } else {
            // Normal single drag (clear selection if any)
            setSelectedIds([]);
            setDraggingId(id);
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;
            setDragStartPos({ x: clientX, y: clientY });
            const scrollX = scrollContainerRef?.current?.scrollLeft || 0;
            setOffset({ x: (clientX + scrollX) - x, y: clientY - y });

            // Sync ref for robust touch detection
            interactionData.current = { startX: clientX, startY: clientY, itemId: id };
        }

        // Stop NPC movement
        setItems(prev => prev.map(i => {
            if ((i.id === id || selectedIds.includes(i.id)) && i.npc?.action !== 'idle') {
                return { ...i, npc: { ...i.npc, action: 'idle' } };
            }
            return i;
        }));
    };

    const handleMouseMove = (e) => {
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY;

        const scrollX = scrollContainerRef?.current?.scrollLeft || 0;

        if (draggingId === 'background') {
            if (scrollContainerRef?.current) {
                const dx = clientX - backgroundDrag.current.startX;
                scrollContainerRef.current.scrollLeft = backgroundDrag.current.startScrollLeft - dx;
            }
            return;
        }

        if (draggingId === 'multi' && clientX !== undefined && clientY !== undefined) {
            setItems(prev => prev.map(item => {
                if (selectedIds.includes(item.id)) {
                    const myOffset = dragOffsets[item.id] || { dx: 0, dy: 0 };
                    const newX = clientX - myOffset.dx + scrollX;
                    let newY = clientY - myOffset.dy;

                    // Restrict dolls to ground
                    if (item.type === 'doll') {
                        const groundY = (window.innerHeight * (horizonPos / 100)) - 20;
                        if (newY < groundY) newY = groundY;
                    }
                    // Prevent dragging into dock area (bottom 100px)
                    const maxY = window.innerHeight - 50;
                    if (newY > maxY) newY = maxY;
                    return { ...item, x: newX, y: newY };
                }
                return item;
            }));
        } else if (draggingId) {
            if (clientX !== undefined && clientY !== undefined) {
                const newX = clientX - offset.x + scrollX;
                let newY = clientY - offset.y;

                // Restrict dolls to ground
                const draggingItem = items.find(i => i.id === draggingId);
                if (draggingItem && draggingItem.type === 'doll') {
                    const groundY = (window.innerHeight * (horizonPos / 100)) - 20;
                    if (newY < groundY) newY = groundY;
                }
                // Prevent dragging into dock area (bottom 100px)
                const maxY = window.innerHeight - 50;
                if (newY > maxY) newY = maxY;

                setItems(prev => prev.map(item =>
                    item.id === draggingId ? { ...item, x: newX, y: newY } : item
                ));
            }
        }
    };

    const handleMouseUp = (e) => {
        // If we were in selection mode, handleMouseDown already toggled selection, so no further action here.
        if (isSelectionMode) {
            setDraggingId(null); // Ensure draggingId is cleared if it was set (e.g., if user clicked and dragged slightly in selection mode)
            return;
        }

        if (draggingId === 'background') {
            setDraggingId(null);
            return;
        }

        // If we were dragging (single or multi), check if it was a click or a drag.
        if (draggingId) {
            const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartPos.x;
            const clientY = e.clientY ?? e.changedTouches?.[0]?.clientY ?? dragStartPos.y;
            const dist = Math.hypot(clientX - dragStartPos.x, clientY - dragStartPos.y);

            // If it was a click (not a drag) on a single item, trigger onEditItem.
            // For multi-drag, we don't trigger onEditItem on mouse up.
            if (dist < 5 && draggingId !== 'multi') {
                const item = items.find(i => i.id === draggingId);
                if (item) {
                    onEditItem && onEditItem(item);
                }
            }
        }

        setDraggingId(null);
    };

    const handleBackgroundMouseDown = (e) => {
        if (!isSelectionMode) {
            setSelectedIds([]);

            // Start background drag
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            backgroundDrag.current = {
                startX: clientX,
                startScrollLeft: scrollContainerRef?.current?.scrollLeft || 0
            };
            setDraggingId('background');
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseDown={handleBackgroundMouseDown}
            onTouchStart={handleBackgroundMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className={`h-screen relative bg-transparent ${draggingId ? 'cursor-grabbing' : 'cursor-default'}`}
            style={{ width: '300vw', minWidth: '300vw', touchAction: draggingId ? 'none' : 'pan-x' }}
        >                {items.map(item => {
            const isHighlighted = highlightedId === item.id;
            const isSelected = selectedIds.includes(item.id);
            return (
                <div
                    key={item.id}
                    style={{
                        position: 'absolute',
                        left: item.x,
                        top: item.y,
                        transition: (item.npc?.action === 'walking' && draggingId !== item.id && !selectedIds.includes(item.id))
                            ? 'left 0.05s linear, top 0.05s linear, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease',
                        transform: `
                                scale(${draggingId === item.id ? 1.1 : (isHighlighted ? 1.5 : 1)}) 
                                translate(0, 0)
                                rotate(${item.data?.transform?.rotate || 0}deg)
                                scale(${item.data?.transform?.scaleX || 1}, ${item.data?.transform?.scaleY || 1})
                                skew(${item.data?.transform?.skewX || 0}deg, ${item.data?.transform?.skewY || 0}deg)
                            `,
                        zIndex: isHighlighted ? 20000 : (item.type === 'doll' ? 10000 + Math.floor(item.y) : (item.type.startsWith('grass') ? 9000 + Math.floor(item.y) : (item.type.startsWith('house') ? 10 : (item.type.includes('tree') ? 20 : 30 + Math.floor(item.y))))),
                        cursor: 'grab', // Always allow grab, even if selected
                        filter: isHighlighted ? 'drop-shadow(0 0 15px rgba(255, 234, 167, 0.8)) brightness(1.1)' :
                            (isSelected ? 'drop-shadow(0 0 10px rgba(0, 184, 148, 0.9)) brightness(1.1)' : 'none'),
                        border: isSelected ? '2px dashed #00b894' : 'none', // Show border if selected ALWAYS
                        borderRadius: '10px',
                        touchAction: 'none' // Prevent scrolling while dragging
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item.id, item.x, item.y)}
                    onTouchStart={(e) => handleMouseDown(e, item.id, item.x, item.y)}
                    onTouchEnd={(e) => {
                        // Mobile Tap Detection (Robust)
                        // We use the Ref data because State might not be updated yet for fast taps
                        const validId = interactionData.current.itemId === item.id || draggingId === item.id;

                        if (validId) {
                            const touch = e.changedTouches?.[0];
                            if (touch) {
                                // Use ref start pos if available, else state
                                const startX = interactionData.current.itemId === item.id ? interactionData.current.startX : dragStartPos.x;
                                const startY = interactionData.current.itemId === item.id ? interactionData.current.startY : dragStartPos.y;

                                const dist = Math.hypot(touch.clientX - startX, touch.clientY - startY);

                                if (dist < 30) { // Increased threshold for mobile (30px)
                                    e.preventDefault(); // Prevent ghost clicks
                                    onEditItem && onEditItem(item);
                                }
                            }
                            setDraggingId(null);
                            interactionData.current.itemId = null;
                        }
                    }}
                >
                    {item.type !== 'doll' && getAsset(item.type, item.data)}

                    {item.type === 'doll' && (
                        <div style={{ pointerEvents: 'none' }}>
                            <Doll
                                {...item.data}
                                isAnimating={item.npc?.action === 'walking'}
                                animationType={item.npc?.action === 'talking' ? 'talking' : (item.data.animationType || 'idle')}
                            />
                            {item.data.name && (
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white/80 px-2 rounded-[10px] text-[10px] whitespace-nowrap opacity-80 text-black">
                                    {item.data.name}
                                </div>
                            )}
                            {item.npc?.action === 'talking' && (
                                <div className="animate-pop absolute -top-[60px] left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-lg z-[100] w-[140px] text-center pointer-events-none">
                                    <div className="text-[10px] text-gray-500 mb-0.5">Sharing a story...</div>
                                    <div className="text-[11px] italic text-gray-900">
                                        "{item.data.story?.slice(0, 40) || "Hello!"}..."
                                    </div>
                                    <div className="absolute -bottom-1.5 left-1/2 -ml-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
        </div>
    );
}
