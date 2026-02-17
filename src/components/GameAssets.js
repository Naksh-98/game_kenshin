import React from 'react';

// --- SVGs & CSS Assets ---

export const HouseShapes = {
    Cottage: ({ color = '#ff9f43', roofColor = '#e15f41' }) => (
        <div style={{ width: '80px', height: '80px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '10px', width: '60px', height: '45px', backgroundColor: color, borderRadius: '4px' }} />
            {/* Roof */}
            <div style={{ position: 'absolute', top: '5px', left: '0', width: '0', height: '0', borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `40px solid ${roofColor}` }} />
            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '35px', width: '12px', height: '20px', backgroundColor: '#634236', borderRadius: '4px 4px 0 0' }} />
            {/* Window */}
            <div style={{ position: 'absolute', bottom: '20px', left: '18px', width: '12px', height: '12px', backgroundColor: '#74b9ff', borderRadius: '50%', border: '2px solid white' }} />
        </div>
    ),
    Mansion: ({ color = '#a29bfe', roofColor = '#6c5ce7' }) => (
        <div style={{ width: '100px', height: '90px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Main Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '20px', width: '60px', height: '50px', backgroundColor: color }} />
            {/* Side Wing(?manashion ) */}
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '20px', height: '40px', backgroundColor: color }} />
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '20px', height: '40px', backgroundColor: color }} />

            {/* Roofs */}
            <div style={{ position: 'absolute', top: '10px', left: '15px', width: '70px', height: '30px', backgroundColor: roofColor, borderRadius: '4px 4px 0 0' }} />
            <div style={{ position: 'absolute', top: '30px', left: '-5px', width: '30px', height: '10px', backgroundColor: roofColor, transform: 'rotate(-45deg)' }} />
            <div style={{ position: 'absolute', top: '30px', right: '-5px', width: '30px', height: '10px', backgroundColor: roofColor, transform: 'rotate(45deg)' }} />

            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '42px', width: '16px', height: '24px', backgroundColor: '#2d3436', borderRadius: '8px 8px 0 0' }} />
        </div>
    ),
    Pagoda: ({ color = '#fab1a0', roofColor = '#d63031' }) => (
        <div style={{ width: '80px', height: '100px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Tier 1 */}
            <div style={{ width: '50px', height: '10px', backgroundColor: roofColor, borderRadius: '10px 10px 0 0' }} />
            <div style={{ width: '40px', height: '20px', backgroundColor: color }} />
            {/* Tier 2 */}
            <div style={{ width: '60px', height: '10px', backgroundColor: roofColor, borderRadius: '10px 10px 0 0' }} />
            <div style={{ width: '50px', height: '20px', backgroundColor: color }} />
            {/* Tier 3 */}
            <div style={{ width: '80px', height: '10px', backgroundColor: roofColor, borderRadius: '10px 10px 0 0' }} />
            <div style={{ width: '60px', height: '30px', backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <div style={{ width: '14px', height: '20px', backgroundColor: '#634236' }} />
            </div>
        </div>
    )
};

export const NatureShapes = {
    TreeOak: () => (
        <div style={{ width: '60px', height: '80px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#10ac84', borderRadius: '50%', marginBottom: '-15px', zIndex: 2, boxShadow: 'inset -5px -5px rgba(0,0,0,0.1)' }} />
            <div style={{ width: '16px', height: '35px', backgroundColor: '#834c32', borderRadius: '4px' }} />
        </div>
    ),
    TreePine: () => (
        <div style={{ width: '50px', height: '90px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '0', height: '0', borderLeft: '25px solid transparent', borderRight: '25px solid transparent', borderBottom: '60px solid #2e86de', marginBottom: '-10px', zIndex: 2, filter: 'hue-rotate(100deg)' }} />
            <div style={{ width: '12px', height: '20px', backgroundColor: '#574b90', borderRadius: '2px' }} />
        </div>
    ),
    TreeSakura: () => (
        <div style={{ width: '70px', height: '80px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '60px', backgroundColor: '#fd79a8', borderRadius: '50% 50% 40% 40%', marginBottom: '-15px', zIndex: 2, opacity: 0.9, boxShadow: 'inset -5px -5px rgba(0,0,0,0.05)' }} >
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '5px', height: '5px', background: '#fff', borderRadius: '50%', opacity: 0.6 }}></div>
                <div style={{ position: 'absolute', top: '30px', right: '15px', width: '6px', height: '6px', background: '#fff', borderRadius: '50%', opacity: 0.6 }}></div>
            </div>
            <div style={{ width: '14px', height: '35px', backgroundColor: '#634236', borderRadius: '4px' }} />
        </div>
    ),
    Bush: () => (
        <div style={{ width: '40px', height: '30px', backgroundColor: '#00b894', borderRadius: '20px 20px 0 0', borderBottom: '4px solid #00a884' }} />
    ),
    Rock: () => (
        <div style={{ width: '30px', height: '20px', backgroundColor: '#b2bec3', borderRadius: '10px 10px 5px 5px', borderBottom: '3px solid #636e72' }} />
    ),
    Sun: () => (
        <div className="animate-spin-slow" style={{
            width: '80px', height: '80px', background: '#e1b12c', borderRadius: '50%',
            boxShadow: '0 0 40px #fbc531', opacity: 0.9,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ width: '60px', height: '60px', background: '#fbc531', borderRadius: '50%' }}></div>
        </div>
    ),
    Flower: ({ type = 'rose' }) => {
        const colors = { rose: '#ff4757', tulip: '#ffa502', sunflower: '#ffeb3b', daisy: '#ffffff', lavender: '#a29bfe' };
        const centerColors = { rose: '#c44569', tulip: '#eccc68', sunflower: '#6d4c41', daisy: '#f1c40f', lavender: '#6c5ce7' };
        const color = colors[type] || colors.rose;
        const center = centerColors[type] || centerColors.rose;

        return (
            <div style={{ width: '24px', height: '36px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Petals */}
                <div style={{
                    width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%',
                    boxShadow: type === 'sunflower' ? `0 0 0 4px ${color}, 0 0 0 8px rgba(255,165,2,0.5)` : 'none',
                    position: 'relative', zIndex: 2
                }} >
                    <div style={{ position: 'absolute', top: '5px', left: '5px', width: '10px', height: '10px', backgroundColor: center, borderRadius: '50%' }} />
                </div>
                {/* Stem */}
                <div style={{ width: '4px', height: '16px', backgroundColor: '#2ed573', marginTop: '-2px' }} />
                {/* Leaves */}
                <div style={{ position: 'absolute', bottom: '4px', right: '-6px', width: '10px', height: '6px', backgroundColor: '#2ed573', borderRadius: '0 10px 0 10px' }} />
            </div>
        );
    },
    Fish: ({ color = '#ff9f43', scale = 1 }) => (
        <div className="animate-pulse" style={{
            width: '20px',
            height: '12px',
            backgroundColor: color,
            borderRadius: '50% 50% 50% 50%',
            opacity: 0.9,
            position: 'relative',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
        }}>
            <div style={{ position: 'absolute', right: '-4px', top: '2px', width: '0', height: '0', borderLeft: `6px solid ${color}`, borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
            <div style={{ position: 'absolute', left: '4px', top: '3px', width: '2px', height: '2px', backgroundColor: 'black', borderRadius: '50%', opacity: 0.9 }} />
        </div>
    )
};

export const FloorShapes = {
    RiverHorizontal: () => (
        <div style={{ width: '100px', height: '60px', background: 'linear-gradient(to bottom, #74b9ff, #0984e3)', opacity: 0.8, borderRadius: '10px', border: '2px solid rgba(255,255,255,0.3)' }} />
    ),
    RiverVertical: () => (
        <div style={{ width: '60px', height: '100px', background: 'linear-gradient(to right, #74b9ff, #0984e3)', opacity: 0.8, borderRadius: '10px', border: '2px solid rgba(255,255,255,0.3)' }} />
    ),
    Pond: () => (
        <div style={{ width: '120px', height: '100px', background: '#0984e3', opacity: 0.8, borderRadius: '50%', border: '4px solid #74b9ff', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }} >
            <div style={{ position: 'absolute', top: '20px', left: '30px', width: '20px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}></div>
        </div>
    ),
    GardenPatch: ({ rows = 2, cols = 2, flowerType = 'none' }) => {
        // Ensure valid numbers
        const r = Math.max(1, Math.min(6, parseInt(rows) || 2));
        const c = Math.max(1, Math.min(6, parseInt(cols) || 2));

        return (
            <div
                className="bg-[#55efc4] rounded-[10px] border-4 border-dashed border-[#00b894] grid p-[5px] gap-[5px] opacity-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
                style={{
                    width: `${c * 40}px`,
                    height: `${r * 40}px`,
                    gridTemplateColumns: `repeat(${c}, 1fr)`,
                    gridTemplateRows: `repeat(${r}, 1fr)`,
                }}
            >
                {Array.from({ length: r * c }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
                        {flowerType !== 'none' && (
                            <div className="scale-[0.8] mt-[5px]">
                                <NatureShapes.Flower type={flowerType} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
};

export const getAsset = (type, data = {}) => {
    // Houses
    if (type === 'house_cottage') return <HouseShapes.Cottage {...data} />;
    if (type === 'house_mansion') return <HouseShapes.Mansion {...data} />;
    if (type === 'house_pagoda') return <HouseShapes.Pagoda {...data} />;

    // Nature
    if (type === 'tree_oak') return <NatureShapes.TreeOak />;
    if (type === 'tree_pine') return <NatureShapes.TreePine />;
    if (type === 'tree_sakura') return <NatureShapes.TreeSakura />;
    if (type === 'bush') return <NatureShapes.Bush />;
    if (type === 'fish') return <NatureShapes.Fish {...data} />;
    if (type === 'grass') return (
        <div className="w-20 h-4 overflow-hidden relative">
            <img src="/gif/grass.gif" alt="Grass" className="absolute bottom-0 left-0 w-full h-auto max-w-none pointer-events-none select-none" />
        </div>
    );
    if (type === 'grass_two') return (
        <div className="w-16 h-16 overflow-hidden relative">
            <img src="/gif/grass_two.gif" alt="Grass" className="absolute bottom-0 left-0 w-full h-auto max-w-none pointer-events-none select-none" />
        </div>
    );
    if (type === 'rock') return <NatureShapes.Rock />;
    if (type === 'sun') return <NatureShapes.Sun />;

    // Flowers
    if (type === 'flower_rose') return <NatureShapes.Flower type="rose" />;
    if (type === 'flower_tulip') return <NatureShapes.Flower type="tulip" />;
    if (type === 'flower_sunflower') return <NatureShapes.Flower type="sunflower" />;

    // Floor
    if (type === 'river_h') return <FloorShapes.RiverHorizontal />;
    if (type === 'river_v') return <FloorShapes.RiverVertical />;
    if (type === 'pond') return <FloorShapes.Pond />;
    if (type === 'garden') return <FloorShapes.GardenPatch {...data} />;

    return <div style={{ width: 50, height: 50, background: 'red' }}>?</div>;
};
