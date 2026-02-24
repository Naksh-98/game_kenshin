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
            {/* Side Wing */}
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
    ),
    Cabin: ({ color = '#8b5a2b', roofColor = '#3e2723' }) => (
        <div style={{ width: '80px', height: '70px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '5px', width: '70px', height: '40px', backgroundColor: color, borderRadius: '2px' }} />
            {/* Roof */}
            <div style={{ position: 'absolute', top: '0', left: '-5px', width: '0', height: '0', borderLeft: '45px solid transparent', borderRight: '45px solid transparent', borderBottom: `30px solid ${roofColor}` }} />
            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '32px', width: '16px', height: '22px', backgroundColor: '#5d4037', borderRadius: '2px 2px 0 0' }} />
            {/* Log details */}
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '60px', height: '2px', backgroundColor: '#5d4037', opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '10px', width: '60px', height: '2px', backgroundColor: '#5d4037', opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '30px', left: '10px', width: '60px', height: '2px', backgroundColor: '#5d4037', opacity: 0.5 }} />
        </div>
    ),
    Castle: ({ color = '#95a5a6', roofColor = '#7f8c8d' }) => (
        <div style={{ width: '100px', height: '100px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Main Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '20px', width: '60px', height: '60px', backgroundColor: color }} />
            {/* Turrets */}
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '25px', height: '80px', backgroundColor: color }} />
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '25px', height: '80px', backgroundColor: color }} />
            {/* Turret Roofs */}
            <div style={{ position: 'absolute', top: '0', left: '-5px', width: '0', height: '0', borderLeft: '17px solid transparent', borderRight: '17px solid transparent', borderBottom: `20px solid ${roofColor}` }} />
            <div style={{ position: 'absolute', top: '0', right: '-5px', width: '0', height: '0', borderLeft: '17px solid transparent', borderRight: '17px solid transparent', borderBottom: `20px solid ${roofColor}` }} />
            {/* Gate */}
            <div style={{ position: 'absolute', bottom: '0', left: '35px', width: '30px', height: '40px', backgroundColor: '#2c3e50', borderRadius: '15px 15px 0 0' }} />
        </div>
    ),
    Skyscraper: ({ color = '#bdc3c7', roofColor = '#2980b9' }) => (
        <div style={{ width: '60px', height: '150px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Main Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '10px', width: '40px', height: '140px', backgroundColor: color }} />
            {/* Windows */}
            <div style={{ position: 'absolute', bottom: '20px', left: '15px', width: '30px', height: '110px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}>
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', backgroundColor: roofColor }} />
                ))}
            </div>
            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '20px', width: '20px', height: '15px', backgroundColor: '#34495e' }} />
        </div>
    ),
    Barn: ({ color = '#c0392b', roofColor = '#34495e' }) => (
        <div style={{ width: '90px', height: '80px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '10px', width: '70px', height: '50px', backgroundColor: color }} />
            {/* Roof */}
            <div style={{ position: 'absolute', top: '10px', left: '0', width: '90px', height: '20px', backgroundColor: roofColor, transform: 'perspective(20px) rotateX(10deg)' }} />
            {/* Big Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '30px', width: '30px', height: '35px', backgroundColor: '#7f8c8d' }}>
                <div style={{ position: 'absolute', top: '0', left: '14px', width: '2px', height: '35px', backgroundColor: '#2c3e50' }} />
            </div>
            {/* Loft Window */}
            <div style={{ position: 'absolute', top: '35px', left: '40px', width: '10px', height: '10px', backgroundColor: '#2c3e50', borderRadius: '50%' }} />
        </div>
    ),
    Tent: ({ color = '#27ae60', roofColor = '#2ecc71' }) => (
        <div style={{ width: '70px', height: '60px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '0', height: '0', borderLeft: '35px solid transparent', borderRight: '35px solid transparent', borderBottom: `50px solid ${color}` }} />
            {/* Flap */}
            <div style={{ position: 'absolute', bottom: '0', left: '25px', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `20px solid #2c3e50` }} />
        </div>
    ),
    Modern: ({ color = '#ecf0f1', roofColor = '#34495e' }) => (
        <div style={{ width: '100px', height: '80px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Left Block */}
            <div style={{ position: 'absolute', bottom: '0', left: '10px', width: '40px', height: '60px', backgroundColor: color }} />
            {/* Right Block */}
            <div style={{ position: 'absolute', bottom: '0', left: '50px', width: '40px', height: '40px', backgroundColor: '#bdc3c7' }} />
            {/* Roofs */}
            <div style={{ position: 'absolute', bottom: '60px', left: '5px', width: '50px', height: '5px', backgroundColor: roofColor }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '45px', width: '50px', height: '5px', backgroundColor: roofColor }} />
            {/* Huge Window */}
            <div style={{ position: 'absolute', bottom: '15px', left: '55px', width: '25px', height: '20px', backgroundColor: '#3498db', opacity: 0.8 }} />
            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', left: '20px', width: '15px', height: '25px', backgroundColor: '#2c3e50' }} />
        </div>
    ),
    Shop: ({ color = '#f1c40f', roofColor = '#e74c3c' }) => (
        <div style={{ width: '80px', height: '80px', position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
            {/* Body */}
            <div style={{ position: 'absolute', bottom: '0', left: '10px', width: '60px', height: '60px', backgroundColor: color }} />
            {/* Awning */}
            <div style={{ position: 'absolute', top: '15px', left: '5px', width: '70px', height: '15px', backgroundColor: roofColor, borderRadius: '0 0 5px 5px', borderBottom: '2px solid white', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)' }} />
            {/* Window */}
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '30px', height: '25px', backgroundColor: '#81ecec', border: '2px solid #55efc4' }} />
            {/* Door */}
            <div style={{ position: 'absolute', bottom: '0', right: '15px', width: '15px', height: '25px', backgroundColor: '#d63031' }} />
            {/* Sign */}
            <div style={{ position: 'absolute', top: '0', left: '20px', width: '40px', height: '10px', backgroundColor: '#2d3436', color: 'white', fontSize: '6px', textAlign: 'center', lineHeight: '10px' }}>SHOP</div>
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
    Snowman: ({ color = '#ffffff' }) => (
        <div style={{ width: '40px', height: '60px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Top ball */}
            <div style={{ width: '25px', height: '25px', backgroundColor: color, borderRadius: '50%', position: 'relative', zIndex: 2, boxShadow: 'inset -3px -3px rgba(0,0,0,0.1)' }}>
                {/* Eyes */}
                <div style={{ width: '3px', height: '3px', backgroundColor: 'black', borderRadius: '50%', position: 'absolute', top: '8px', left: '7px' }}></div>
                <div style={{ width: '3px', height: '3px', backgroundColor: 'black', borderRadius: '50%', position: 'absolute', top: '8px', right: '7px' }}></div>
                {/* Nose */}
                <div style={{ width: '0', height: '0', borderTop: '2px solid transparent', borderBottom: '2px solid transparent', borderLeft: '6px solid orange', position: 'absolute', top: '12px', left: '10px' }}></div>
            </div>
            {/* Bottom ball */}
            <div style={{ width: '40px', height: '40px', backgroundColor: color, borderRadius: '50%', marginTop: '-10px', zIndex: 1, boxShadow: 'inset -5px -5px rgba(0,0,0,0.1)' }}>
                {/* Buttons */}
                <div style={{ width: '4px', height: '4px', backgroundColor: '#2d3436', borderRadius: '50%', position: 'absolute', bottom: '25px', left: '18px' }}></div>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#2d3436', borderRadius: '50%', position: 'absolute', bottom: '15px', left: '18px' }}></div>
            </div>
            {/* Arms */}
            <div style={{ width: '20px', height: '2px', backgroundColor: '#834c32', position: 'absolute', top: '30px', left: '-10px', transform: 'rotate(-20deg)', zIndex: 0 }}></div>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#834c32', position: 'absolute', top: '30px', right: '-10px', transform: 'rotate(20deg)', zIndex: 0 }}></div>
        </div>
    ),
    Snowball: ({ color = '#ffffff' }) => (
        <div style={{
            width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%',
            boxShadow: 'inset -3px -3px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
        }}></div>
    ),
    Cactus: () => (
        <div style={{ width: '40px', height: '60px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '50px', backgroundColor: '#55efc4', borderRadius: '10px', boxShadow: 'inset -3px 0 rgba(0,0,0,0.1)' }}></div>
            <div style={{ position: 'absolute', top: '20px', left: '0', width: '15px', height: '15px', backgroundColor: '#55efc4', borderRadius: '5px' }}></div>
            <div style={{ position: 'absolute', top: '15px', right: '0', width: '15px', height: '15px', backgroundColor: '#55efc4', borderRadius: '5px' }}></div>
        </div>
    ),
    Mushroom: () => (
        <div style={{ width: '30px', height: '30px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
            <div style={{ width: '30px', height: '15px', backgroundColor: '#ff7675', borderRadius: '15px 15px 0 0', position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'absolute', top: '3px', left: '5px', width: '5px', height: '5px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', top: '5px', right: '6px', width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            </div>
            <div style={{ width: '10px', height: '15px', backgroundColor: '#dfe6e9', borderRadius: '0 0 5px 5px' }}></div>
        </div>
    ),
    Log: () => (
        <div style={{ width: '50px', height: '20px', position: 'relative', display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))' }}>
            <div style={{ width: '45px', height: '16px', backgroundColor: '#834c32', borderRadius: '3px' }}></div>
            <div style={{ position: 'absolute', right: '0', width: '10px', height: '16px', backgroundColor: '#d1ccc0', borderRadius: '50%', border: '2px solid #834c32' }}></div>
        </div>
    ),
    Stump: () => (
        <div style={{ width: '24px', height: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
            <div style={{ width: '24px', height: '10px', backgroundColor: '#d1ccc0', borderRadius: '50%', border: '2px solid #834c32', zIndex: 2, position: 'absolute', top: '0' }}></div>
            <div style={{ width: '20px', height: '15px', backgroundColor: '#834c32', marginTop: '5px', borderRadius: '2px' }}></div>
            <div style={{ position: 'absolute', bottom: '0', left: '-2px', width: '8px', height: '5px', backgroundColor: '#834c32', borderRadius: '2px' }}></div>
            <div style={{ position: 'absolute', bottom: '0', right: '-2px', width: '8px', height: '5px', backgroundColor: '#834c32', borderRadius: '2px' }}></div>
        </div>
    ),
    Bamboo: () => (
        <div style={{ width: '20px', height: '80px', position: 'relative', display: 'flex', gap: '4px', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '80px', backgroundColor: '#2ed573', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', boxShadow: 'inset -2px 0 #10ac84' }}>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#10ac84' }}></div>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#10ac84' }}></div>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#10ac84' }}></div>
            </div>
            <div style={{ width: '4px', height: '60px', backgroundColor: '#2ed573', marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', boxShadow: 'inset -1px 0 #10ac84' }}>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#10ac84' }}></div>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#10ac84' }}></div>
            </div>
        </div>
    ),
    Crystal: () => (
        <div style={{ width: '30px', height: '40px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', filter: 'drop-shadow(0 0 10px rgba(162,155,254,0.5))' }}>
            <div style={{ width: '10px', height: '35px', backgroundColor: '#a29bfe', clipPath: 'polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)', zIndex: 1 }}></div>
            <div style={{ width: '12px', height: '25px', backgroundColor: '#6c5ce7', clipPath: 'polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)', marginLeft: '-5px', zIndex: 2 }}></div>
            <div style={{ width: '8px', height: '20px', backgroundColor: '#81ecec', clipPath: 'polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)', marginLeft: '-5px', zIndex: 0 }}></div>
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
    SnowGround: () => (
        <div style={{
            width: '120px', height: '80px', background: 'radial-gradient(ellipse at center, #ffffff 0%, #e0eaf5 100%)',
            borderRadius: '50% 50% 40% 60%', opacity: 0.9, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            borderBottom: '4px solid #ced6e0', borderLeft: '2px solid #ced6e0'
        }} />
    ),
    DirtPathHorizontal: () => (
        <div style={{ width: '100px', height: '40px', background: '#e1b12c', opacity: 0.8, borderRadius: '5px', border: 'none' }} />
    ),
    DirtPathVertical: () => (
        <div style={{ width: '40px', height: '100px', background: '#e1b12c', opacity: 0.8, borderRadius: '5px', border: 'none' }} />
    ),
    StonePathHorizontal: () => (
        <div style={{ width: '100px', height: '40px', background: '#b2bec3', opacity: 0.9, borderRadius: '2px', display: 'flex', gap: '2px', alignItems: 'center', padding: '0 5px' }}>
            <div style={{ width: '20px', height: '30px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '30px', height: '25px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '20px', height: '32px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '15px', height: '28px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
        </div>
    ),
    StonePathVertical: () => (
        <div style={{ width: '40px', height: '100px', background: '#b2bec3', opacity: 0.9, borderRadius: '2px', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', padding: '5px 0' }}>
            <div style={{ width: '30px', height: '20px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '25px', height: '30px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '32px', height: '20px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
            <div style={{ width: '28px', height: '15px', backgroundColor: '#636e72', borderRadius: '4px' }}></div>
        </div>
    ),
    BridgeHorizontal: () => (
        <div style={{ width: '100px', height: '60px', background: '#d1ccc0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #834c32', borderRight: '4px solid #834c32' }}>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#834c32' }}></div>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div style={{ width: '4px', height: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ width: '4px', height: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ width: '4px', height: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ width: '4px', height: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ width: '4px', height: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#834c32' }}></div>
        </div>
    ),
    BridgeVertical: () => (
        <div style={{ width: '60px', height: '100px', background: '#d1ccc0', display: 'flex', justifyContent: 'space-between', borderTop: '4px solid #834c32', borderBottom: '4px solid #834c32' }}>
            <div style={{ height: '100%', width: '6px', backgroundColor: '#834c32' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#a4b0be', opacity: 0.5 }}></div>
            </div>
            <div style={{ height: '100%', width: '6px', backgroundColor: '#834c32' }}></div>
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
    if (type === 'house_cabin') return <HouseShapes.Cabin {...data} />;
    if (type === 'house_castle') return <HouseShapes.Castle {...data} />;
    if (type === 'house_skyscraper') return <HouseShapes.Skyscraper {...data} />;
    if (type === 'house_barn') return <HouseShapes.Barn {...data} />;
    if (type === 'house_tent') return <HouseShapes.Tent {...data} />;
    if (type === 'house_modern') return <HouseShapes.Modern {...data} />;
    if (type === 'house_shop') return <HouseShapes.Shop {...data} />;

    // Nature
    if (type === 'tree_oak') return <NatureShapes.TreeOak />;
    if (type === 'tree_pine') return <NatureShapes.TreePine />;
    if (type === 'tree_sakura') return <NatureShapes.TreeSakura />;
    if (type === 'bush') return <NatureShapes.Bush />;
    if (type === 'cactus') return <NatureShapes.Cactus />;
    if (type === 'mushroom') return <NatureShapes.Mushroom />;
    if (type === 'log') return <NatureShapes.Log />;
    if (type === 'stump') return <NatureShapes.Stump />;
    if (type === 'bamboo') return <NatureShapes.Bamboo />;
    if (type === 'crystal') return <NatureShapes.Crystal />;
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
    if (type === 'snowman') return <NatureShapes.Snowman {...data} />;
    if (type === 'snow_ball') return <NatureShapes.Snowball {...data} />;

    // Flowers
    if (type === 'flower_rose') return <NatureShapes.Flower type="rose" />;
    if (type === 'flower_tulip') return <NatureShapes.Flower type="tulip" />;
    if (type === 'flower_sunflower') return <NatureShapes.Flower type="sunflower" />;

    // Floor
    if (type === 'river_h') return <FloorShapes.RiverHorizontal />;
    if (type === 'river_v') return <FloorShapes.RiverVertical />;
    if (type === 'pond') return <FloorShapes.Pond />;
    if (type === 'snow_ground') return <FloorShapes.SnowGround />;
    if (type === 'dirt_path_h') return <FloorShapes.DirtPathHorizontal />;
    if (type === 'dirt_path_v') return <FloorShapes.DirtPathVertical />;
    if (type === 'stone_path_h') return <FloorShapes.StonePathHorizontal />;
    if (type === 'stone_path_v') return <FloorShapes.StonePathVertical />;
    if (type === 'bridge_h') return <FloorShapes.BridgeHorizontal />;
    if (type === 'bridge_v') return <FloorShapes.BridgeVertical />;
    if (type === 'garden') return <FloorShapes.GardenPatch {...data} />;

    return <div style={{ width: 50, height: 50, background: 'red' }}>?</div>;
};
