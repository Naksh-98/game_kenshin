"use client";
import React, { useState, useRef, useEffect } from 'react';
import Doll from './Doll';
import { getAsset } from './GameAssets';

const WeatherOverlay = ({ type }) => {
    if (!type || type === 'none') return null;

    // Fixed array avoids re-renders on every interaction
    const particles = React.useMemo(() => Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const width = type === 'snow' ? 4 + Math.random() * 4 : 10 + Math.random() * 6;
        const height = type === 'snow' ? width : width * 0.8;
        const duration = (type === 'snow' ? 8 : 12) + Math.random() * 5;
        const delay = Math.random() * -15;

        return (
            <div
                key={i}
                className={`particle particle-${type}`}
                style={{
                    left: `${left}%`,
                    width: `${width}px`,
                    height: `${height}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                }}
            />
        );
    }), [type]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[50000] overflow-hidden">
            {particles}
        </div>
    );
};

export default function VillageMap({ items, setItems, onEditItem, highlightedId, horizonPos: rawHorizonPos = 50, isSelectionMode, onToggleSelection, scrollContainerRef, cameraZoom = 1, setCameraZoom, tutorialStep, tutorialItemId, weather }) {
    const horizonPos = parseInt(rawHorizonPos, 10) || 50;
    const [draggingId, setDraggingId] = useState(null); // Can be 'multi' if dragging multiple
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Used for single item
    const [dragOffsets, setDragOffsets] = useState({}); // Used for multi drag { id: {dx, dy} }
    const containerRef = useRef(null);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const interactionData = useRef({ startX: 0, startY: 0, itemId: null });
    const backgroundDrag = useRef({ startX: 0, startScrollLeft: 0 });
    const lastTouchTime = useRef(0);
    const initialPinchDist = useRef(null);
    const initialPinchAngle = useRef(null);
    const initialZoom = useRef(1);
    const initialRotation = useRef(0);

    const [selectedIds, setSelectedIds] = useState([]);

    // Check water collisions
    const isOverWater = (x, y, waterItems) => {
        return waterItems.some(w => {
            let type = w.type;
            let wWidth = type === 'pond' ? 120 : (type === 'river_h' ? 100 : 60);
            let wHeight = type === 'pond' ? 100 : (type === 'river_h' ? 60 : 100);
            // using scaled size roughly
            wWidth *= Math.abs(w.data?.transform?.scaleX || 1);
            wHeight *= Math.abs(w.data?.transform?.scaleY || 1);
            return x > w.x - 20 && x < w.x + wWidth + 20 && y > w.y - 20 && y < w.y + wHeight + 20;
        });
    };

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

                        // Check water collision
                        const waterItems = prevItems.filter(i => ['pond', 'river_h', 'river_v'].includes(i.type));
                        if (isOverWater(newX, newY, waterItems)) {
                            npcState.action = 'idle';
                            npcState.lastUpdate = now;
                            // cancel movement, stay in place
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }

                        if (progress >= 1) {
                            npcState.action = 'idle';
                            npcState.lastUpdate = now;
                        }

                        specificUpdates = true;
                        return { ...item, x: newX, y: newY, npc: { ...npcState } };
                    }

                    // Chatting and Object interaction
                    if (npcState.action === 'idle') {
                        const nearbyDoll = prevItems.find(other =>
                            other.id !== item.id &&
                            other.type === 'doll' &&
                            other.npc?.action !== 'talking' &&
                            Math.hypot(other.x - item.x, other.y - item.y) < 80
                        );
                        const nearbyNature = prevItems.find(o => o.id !== item.id && (o.type.startsWith('tree_') || o.type === 'flower_rose') && Math.hypot(o.x - item.x, o.y - item.y) < 80);
                        const nearbyWater = prevItems.find(o => ['pond', 'river_h', 'river_v'].includes(o.type) && Math.hypot(o.x - item.x, o.y - item.y) < 120);
                        const nearbyHouse = prevItems.find(o => o.type.startsWith('house_') && Math.hypot(o.x - item.x, o.y - item.y) < 120);

                        if (nearbyDoll) {
                            npcState.action = 'talking';
                            npcState.lastUpdate = now;
                            npcState.duration = 4000;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        } else if (nearbyWater && Math.random() < 0.05) {
                            npcState.action = 'thinking';
                            npcState.thought = ["Look at those fish!", "I love the sound of water.", "Should I go swimming? No, I can't swim.", "The pond is so peaceful."][Math.floor(Math.random() * 4)];
                            npcState.lastUpdate = now;
                            npcState.duration = 4000;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        } else if (nearbyNature && Math.random() < 0.05) {
                            npcState.action = 'thinking';
                            npcState.thought = ["What a beautiful plant!", "Nature is so peaceful...", "I should plant more of these."][Math.floor(Math.random() * 3)];
                            npcState.lastUpdate = now;
                            npcState.duration = 4000;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        } else if (nearbyHouse && Math.random() < 0.05) {
                            npcState.action = 'thinking';
                            npcState.thought = ["Who lives here?", "Nice architecture!", "I wonder if they have cookies inside.", "Such a cozy place."][Math.floor(Math.random() * 4)];
                            npcState.lastUpdate = now;
                            npcState.duration = 4000;
                            specificUpdates = true;
                            return { ...item, npc: { ...npcState } };
                        }
                    }

                    if (npcState.action === 'talking' || npcState.action === 'thinking') {
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

        if (e.touches && e.touches.length === 2) {
            setDraggingId('pinch-item');
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const angle = Math.atan2(
                e.touches[1].clientY - e.touches[0].clientY,
                e.touches[1].clientX - e.touches[0].clientX
            ) * 180 / Math.PI;

            initialPinchDist.current = dist;
            initialPinchAngle.current = angle;

            const item = items.find(i => i.id === id);
            initialZoom.current = item?.data?.transform?.scaleX || 1;
            initialRotation.current = item?.data?.transform?.rotate || 0;
            interactionData.current = { itemId: id };
            return;
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

            const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
            const mapX = (clientX - rect.left) / cameraZoom;
            const mapY = (clientY - rect.top) / cameraZoom;

            // Calculate offsets for ALL selected items relative to mouse
            const newOffsets = {};
            items.filter(i => selectedIds.includes(i.id)).forEach(i => {
                newOffsets[i.id] = { dx: mapX - i.x, dy: mapY - i.y };
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

            const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
            const mapX = (clientX - rect.left) / cameraZoom;
            const mapY = (clientY - rect.top) / cameraZoom;
            setOffset({ x: mapX - x, y: mapY - y });

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
        if (draggingId === 'pinch-item' && e.touches && e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const angle = Math.atan2(
                e.touches[1].clientY - e.touches[0].clientY,
                e.touches[1].clientX - e.touches[0].clientX
            ) * 180 / Math.PI;

            let newZoom = initialZoom.current;
            let newRotation = initialRotation.current;

            if (initialPinchDist.current) {
                const scale = dist / initialPinchDist.current;
                newZoom = Math.max(0.1, Math.min(5, initialZoom.current * scale));
            }

            if (initialPinchAngle.current !== null) {
                let deltaAngle = angle - initialPinchAngle.current;
                if (deltaAngle > 180) deltaAngle -= 360;
                if (deltaAngle < -180) deltaAngle += 360;
                newRotation = initialRotation.current + deltaAngle;
            }

            setItems(prev => prev.map(item =>
                item.id === interactionData.current.itemId
                    ? { ...item, data: { ...item.data, transform: { ...(item.data?.transform || {}), scaleX: newZoom, scaleY: newZoom, rotate: newRotation } } }
                    : item
            ));
            return;
        }

        if (draggingId === 'pinch' && e.touches && e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (initialPinchDist.current) {
                const scale = dist / initialPinchDist.current;
                const newZoom = Math.max(0.2, Math.min(3, initialZoom.current * scale));
                setCameraZoom && setCameraZoom(newZoom);
            }
            return;
        }

        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY;

        const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const mapX = (clientX - rect.left) / cameraZoom;
        const mapY = (clientY - rect.top) / cameraZoom;

        if (draggingId === 'background') {
            if (scrollContainerRef?.current) {
                const dx = clientX - backgroundDrag.current.startX;
                const dy = clientY - backgroundDrag.current.startY;
                scrollContainerRef.current.scrollLeft = backgroundDrag.current.startScrollLeft - dx;
                scrollContainerRef.current.scrollTop = backgroundDrag.current.startScrollTop - dy;
            }
            return;
        }

        if (draggingId === 'multi' && clientX !== undefined && clientY !== undefined) {
            setItems(prev => prev.map(item => {
                if (selectedIds.includes(item.id)) {
                    const myOffset = dragOffsets[item.id] || { dx: 0, dy: 0 };
                    const newX = mapX - myOffset.dx;
                    let newY = mapY - myOffset.dy;

                    // Restrict dolls to ground
                    if (item.type === 'doll') {
                        const groundY = (window.innerHeight * (horizonPos / 100)) - 20;
                        if (newY < groundY) newY = groundY;
                    }
                    return { ...item, x: newX, y: newY };
                }
                return item;
            }));
        } else if (draggingId) {
            if (clientX !== undefined && clientY !== undefined) {
                const newX = mapX - offset.x;
                let newY = mapY - offset.y;

                // Restrict dolls to ground
                const draggingItem = items.find(i => i.id === draggingId);
                if (draggingItem && draggingItem.type === 'doll') {
                    const groundY = (window.innerHeight * (horizonPos / 100)) - 20;
                    if (newY < groundY) newY = groundY;
                }

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

        if (draggingId === 'background' || draggingId === 'pinch' || draggingId === 'pinch-item') {
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
        if (e.touches && e.touches.length === 2 && setCameraZoom) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const angle = Math.atan2(
                e.touches[1].clientY - e.touches[0].clientY,
                e.touches[1].clientX - e.touches[0].clientX
            ) * 180 / Math.PI;

            initialPinchDist.current = dist;
            initialPinchAngle.current = angle;

            // Check if we are already holding an item with the first finger
            if (draggingId && draggingId !== 'background' && draggingId !== 'multi' && draggingId !== 'pinch') {
                const item = items.find(i => i.id === draggingId);
                initialZoom.current = item?.data?.transform?.scaleX || 1;
                initialRotation.current = item?.data?.transform?.rotate || 0;
                interactionData.current = { itemId: draggingId };
                setDraggingId('pinch-item');
                return;
            }

            initialZoom.current = cameraZoom;
            setDraggingId('pinch');
            return;
        }

        if (!isSelectionMode) {
            setSelectedIds([]);

            // Start background drag
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;
            backgroundDrag.current = {
                startX: clientX,
                startY: clientY,
                startScrollLeft: scrollContainerRef?.current?.scrollLeft || 0,
                startScrollTop: scrollContainerRef?.current?.scrollTop || 0
            };
            setDraggingId('background');
        }
    };

    return (
        <>
            <WeatherOverlay type={weather} />
            {/* God Rays Layer */}
            {items.find(i => i.type === 'sun') && (() => {
                const sunItem = items.find(i => i.type === 'sun');
                return (
                    <div
                        className="animate-spin-slow"
                        style={{
                            position: 'absolute',
                            opacity: 0.4,
                            top: `${sunItem.y + 40 - 2000}px`,
                            left: `${sunItem.x + 40 - 2000}px`,
                            width: '4000px',
                            height: '4000px',
                            pointerEvents: 'none',
                            zIndex: 15000, // Below UI
                            transformOrigin: 'center',
                            mixBlendMode: 'overlay',
                            maskImage: 'radial-gradient(circle, black 0%, transparent 50%)',
                            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 50%)',
                            background: `radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255,255,255,0) 60%), 
                                         conic-gradient(from 0deg at center, 
                                            rgba(255, 255, 255, 0.0) 0deg, rgba(255, 255, 255, 0.3) 10deg, rgba(255, 255, 255, 0.0) 20deg, 
                                            rgba(255, 255, 255, 0.4) 40deg, rgba(255, 255, 255, 0.0) 50deg, rgba(255, 255, 255, 0.2) 70deg, 
                                            rgba(255, 255, 255, 0.0) 90deg, rgba(255, 255, 255, 0.4) 130deg, rgba(255, 255, 255, 0.0) 150deg, 
                                            rgba(255, 255, 255, 0.3) 180deg, rgba(255, 255, 255, 0.0) 210deg, rgba(255, 255, 255, 0.4) 240deg, 
                                            rgba(255, 255, 255, 0.0) 260deg, rgba(255, 255, 255, 0.2) 300deg, rgba(255, 255, 255, 0.0) 330deg, 
                                            rgba(255, 255, 255, 0.3) 360deg)`
                        }}
                    />
                );
            })()}
            <div
                ref={containerRef}
                onMouseDown={handleBackgroundMouseDown}
                onTouchStart={handleBackgroundMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className={`w-full h-full relative bg-transparent touch-none overscroll-none ${draggingId ? 'cursor-grabbing' : 'cursor-default'}`}
                style={{ touchAction: 'none' }}
            >
                {/* Snow Ground Tessellation Layer */}
                {weather === 'snow' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${horizonPos}vh`,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            zIndex: 0,
                            opacity: 0.6,
                            backgroundImage: `
                                radial-gradient(rgb(214 214 214 / 80%) 0%, rgb(255 255 255 / 0%) 40%), 
                                radial-gradient(rgb(235 235 235 / 70%) 0%, rgb(255 255 255 / 0%) 30%), 
                                radial-gradient(rgb(235 235 235 / 60%) 0%, rgba(255, 255, 255, 0) 50%)
                            `,
                            backgroundSize: '150px 100px, 100px 70px, 200px 150px',
                            backgroundPosition: '0 0, 40px 30px, 100px 80px',
                            backgroundRepeat: 'repeat'
                        }}
                    />
                )}

                {items.map(item => {
                    const isTutorialTarget = tutorialStep === 3 && item.id === tutorialItemId;
                    const isHighlighted = highlightedId === item.id || isTutorialTarget;
                    const isSelected = selectedIds.includes(item.id);

                    // Compute shadow offset based on sun position
                    const sunItem = items.find(i => i.type === 'sun');
                    const sunX = sunItem ? sunItem.x : window.innerWidth / 2;
                    const shadowSkew = Math.max(-60, Math.min(60, (item.x - sunX) * 0.1));
                    const isGroundItem = ['pond', 'river_h', 'river_v', 'dirt_path_h', 'dirt_path_v', 'stone_path_h', 'stone_path_v', 'garden', 'sun', 'grass', 'grass_two'].includes(item.type);

                    let currentFilter = isHighlighted ? 'drop-shadow(0 0 15px rgba(255, 234, 167, 0.8)) brightness(1.1)' :
                        (isSelected ? 'drop-shadow(0 0 10px rgba(0, 184, 148, 0.9)) brightness(1.1)' : 'none');

                    // Fallback normal drop shadow if no sun is present
                    if (!sunItem && !isGroundItem) {
                        if (currentFilter === 'none') {
                            currentFilter = 'drop-shadow(0px 10px 5px rgba(0, 0, 0, 0.25))';
                        } else {
                            currentFilter += ' drop-shadow(0px 10px 5px rgba(0, 0, 0, 0.25))';
                        }
                    }

                    return (
                        <div
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: item.x,
                                top: item.y,
                                transition: (item.npc?.action === 'walking' && draggingId !== item.id && !selectedIds.includes(item.id))
                                    ? 'left 0.05s linear, top 0.05s linear, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: `
                                scale(${draggingId === item.id ? 1.1 : (isHighlighted ? 1.5 : 1)}) 
                                translate(0, 0)
                                rotate(${item.data?.transform?.rotate || 0}deg)
                                scale(${item.data?.transform?.scaleX || 1}, ${item.data?.transform?.scaleY || 1})
                                skew(${item.data?.transform?.skewX || 0}deg, ${item.data?.transform?.skewY || 0}deg)
                            `,
                                zIndex: isTutorialTarget ? 10000009 : (isHighlighted ? 20000 : (item.type === 'doll' ? 10000 + Math.floor(item.y) : (item.type.startsWith('grass') ? 9000 + Math.floor(item.y) : (item.type.startsWith('house') ? 10 : (item.type.includes('tree') ? 20 : 30 + Math.floor(item.y)))))),
                                cursor: 'grab', // Always allow grab, even if selected
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
                            {/* Genuine Ground Shadow Layer - Only if Sun exists */}
                            {!isGroundItem && sunItem && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    transformOrigin: 'bottom center',
                                    transform: `skewX(${shadowSkew}deg) scaleY(-0.4) translate(0px, 0px)`,
                                    filter: 'brightness(0) blur(4px) opacity(0.25)',
                                    zIndex: -1,
                                    pointerEvents: 'none'
                                }}>
                                    {item.type !== 'doll' ? getAsset(item.type, item.data) : (
                                        <Doll
                                            {...item.data}
                                            isAnimating={item.npc?.action === 'walking'}
                                            animationType={item.npc?.action === 'talking' ? 'talking' : (item.data.animationType || 'idle')}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Main Asset Layer */}
                            <div style={{ position: 'relative', zIndex: 1, filter: currentFilter }}>
                                {item.type !== 'doll' && getAsset(item.type, item.data)}

                                {isTutorialTarget && (
                                    <div className="animate-pop absolute -top-[80px] left-1/2 -translate-x-1/2 bg-rose-500 text-white p-4 rounded-xl shadow-[0_10px_40px_rgba(225,29,72,0.6)] z-[10000010] min-w-[200px] text-center pointer-events-none ring-4 ring-rose-300">
                                        <h3 className="font-bold text-sm mb-1 leading-tight">👆 Tap to customize!</h3>
                                        <p className="text-xs opacity-90 leading-tight">You can change colors, adjust size, and more.</p>
                                        <div className="absolute -bottom-3 left-1/2 -ml-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-rose-500" />
                                    </div>
                                )}

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
                                        {(item.npc?.action === 'talking' || item.npc?.action === 'thinking') && (
                                            <div className="animate-pop absolute -top-[60px] left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-lg z-[100] w-[140px] text-center pointer-events-none text-black">
                                                <div className="text-[10px] text-gray-500 mb-0.5">
                                                    {item.npc.action === 'thinking' ? "Thinking..." : "Sharing a story..."}
                                                </div>
                                                <div className="text-[11px] italic text-gray-900">
                                                    "{item.npc.action === 'thinking' ? item.npc.thought : (item.data.story?.slice(0, 40) || "Hello!")}..."
                                                </div>
                                                <div className="absolute -bottom-1.5 left-1/2 -ml-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
