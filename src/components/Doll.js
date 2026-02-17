import React from 'react';

/**
 * Doll Component
 * Renders a customizable Chibi doll using inline SVGs/CSS
 */
export default function Doll({
    hairColor = "#6d4c41",
    skinColor = "#f3d2c1",
    outfitColor = "#ff6b6b",
    hairStyle = 0,
    outfitStyle = 0,
    eyeType = 0,
    isAnimating = false,
    animationType = 'idle' // 'idle', 'walking', 'waving', 'dancing'
}) {

    const Eyes = () => {
        const styles = [
            // 0: Classic Dots
            <>
                <div style={{ position: 'absolute', top: '24px', left: '16px', width: '6px', height: '8px', borderRadius: '50%', backgroundColor: '#333' }} />
                <div style={{ position: 'absolute', top: '24px', right: '16px', width: '6px', height: '8px', borderRadius: '50%', backgroundColor: '#333' }} />
            </>,
            // 1: Happy Arches
            <>
                <div style={{ position: 'absolute', top: '24px', left: '16px', width: '8px', height: '4px', borderTop: '2px solid #333', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '24px', right: '16px', width: '8px', height: '4px', borderTop: '2px solid #333', borderRadius: '50%' }} />
            </>,
            // 2: Closed/Sleepy
            <>
                <div style={{ position: 'absolute', top: '26px', left: '16px', width: '8px', height: '2px', backgroundColor: '#333' }} />
                <div style={{ position: 'absolute', top: '26px', right: '16px', width: '8px', height: '2px', backgroundColor: '#333' }} />
            </>,
            // 3: Anime Shine
            <>
                <div style={{ position: 'absolute', top: '22px', left: '14px', width: '10px', height: '12px', borderRadius: '50%', backgroundColor: '#333' }}>
                    <div style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fff' }} />
                </div>
                <div style={{ position: 'absolute', top: '22px', right: '14px', width: '10px', height: '12px', borderRadius: '50%', backgroundColor: '#333' }}>
                    <div style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fff' }} />
                </div>
            </>,
            // 5: Surprised
            <>
                <div style={{ position: 'absolute', top: '22px', left: '14px', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #333' }} />
                <div style={{ position: 'absolute', top: '22px', right: '14px', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #333' }} />
            </>,
            // 6: Angry
            <>
                <div style={{ position: 'absolute', top: '20px', left: '16px', width: '10px', height: '2px', backgroundColor: '#333', transform: 'rotate(20deg)' }} />
                <div style={{ position: 'absolute', top: '20px', right: '16px', width: '10px', height: '2px', backgroundColor: '#333', transform: 'rotate(-20deg)' }} />
                <div style={{ position: 'absolute', top: '26px', left: '18px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#333' }} />
                <div style={{ position: 'absolute', top: '26px', right: '18px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#333' }} />
            </>,
            // 7: Crying/Tears
            <>
                <div style={{ position: 'absolute', top: '26px', left: '16px', width: '8px', height: '2px', backgroundColor: '#333' }} />
                <div style={{ position: 'absolute', top: '26px', right: '16px', width: '8px', height: '2px', backgroundColor: '#333' }} />
                <div style={{ position: 'absolute', top: '28px', left: '14px', width: '4px', height: '8px', borderRadius: '50%', backgroundColor: '#74b9ff' }} />
                <div style={{ position: 'absolute', top: '28px', right: '22px', width: '4px', height: '8px', borderRadius: '50%', backgroundColor: '#74b9ff' }} />
            </>,
            // 8: Hearts
            <>
                <div style={{ position: 'absolute', top: '22px', left: '14px', fontSize: '10px' }}>❤️</div>
                <div style={{ position: 'absolute', top: '22px', right: '14px', fontSize: '10px' }}>❤️</div>
            </>
        ];
        return styles[eyeType % styles.length] || styles[0];
    };

    const Head = () => (
        <div style={{
            width: '60px',
            height: '56px',
            borderRadius: '24px',
            backgroundColor: skinColor,
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {/* Blush */}
            <div style={{ position: 'absolute', top: '34px', left: '8px', width: '10px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,100,100,0.2)' }} />
            <div style={{ position: 'absolute', top: '34px', right: '8px', width: '10px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255,100,100,0.2)' }} />

            <Eyes />

            {/* Mouth */}
            <div style={{ position: 'absolute', top: '40px', left: '26px', width: '8px', height: '3px', borderRadius: '0 0 50% 50%', backgroundColor: '#555' }} />
        </div>
    );

    const Hair = () => {
        const styles = [
            // 0: Bob
            <div key="0">
                <div style={{ position: 'absolute', top: '-8px', left: '-4px', width: '68px', height: '60px', backgroundColor: hairColor, borderRadius: '30px 30px 20px 20px', zIndex: 3, clipPath: 'polygon(0 0, 100% 0, 100% 80%, 90% 100%, 10% 100%, 0 80%)' }} />
                <div style={{ position: 'absolute', top: '0', left: '14px', width: '40px', height: '20px', backgroundColor: hairColor, borderRadius: '0 0 20px 20px', filter: 'brightness(1.1)' }} />
            </div>,
            // 1: Pigtails
            <div key="1">
                <div style={{ position: 'absolute', top: '-4px', left: '-20px', width: '24px', height: '40px', backgroundColor: hairColor, borderRadius: '50%', zIndex: 1, transform: 'rotate(20deg)' }} />
                <div style={{ position: 'absolute', top: '-4px', right: '-20px', width: '24px', height: '40px', backgroundColor: hairColor, borderRadius: '50%', zIndex: 1, transform: 'rotate(-20deg)' }} />
                <div style={{ position: 'absolute', top: '-8px', left: '-2px', width: '64px', height: '40px', backgroundColor: hairColor, borderRadius: '24px 24px 0 0', zIndex: 3 }} />
                <div style={{ position: 'absolute', top: '0', left: '20px', width: '20px', height: '15px', backgroundColor: hairColor, borderRadius: '0 0 10px 10px', zIndex: 4, filter: 'brightness(1.1)' }} />
            </div>,
            // 2: Spiky
            <div key="2" style={{ position: 'absolute', top: '-10px', left: '-2px', width: '64px', height: '40px', backgroundColor: hairColor, borderRadius: '20px 20px 0 0', zIndex: 3 }}>
                <div style={{ position: 'absolute', top: '-8px', left: '10px', width: '10px', height: '15px', backgroundColor: hairColor, borderRadius: '50% 50% 0 0', transform: 'rotate(-10deg)' }} />
                <div style={{ position: 'absolute', top: '-12px', left: '26px', width: '12px', height: '18px', backgroundColor: hairColor, borderRadius: '50% 50% 0 0' }} />
                <div style={{ position: 'absolute', top: '-8px', right: '10px', width: '10px', height: '15px', backgroundColor: hairColor, borderRadius: '50% 50% 0 0', transform: 'rotate(10deg)' }} />
            </div>,
            // 3: Long Wavy
            <div key="3">
                <div style={{ position: 'absolute', top: '-5px', left: '-5px', width: '70px', height: '80px', backgroundColor: hairColor, borderRadius: '30px 30px 0 0', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '-8px', left: '-2px', width: '64px', height: '40px', backgroundColor: hairColor, borderRadius: '24px 24px 0 0', zIndex: 3 }} />
                <div style={{ position: 'absolute', top: '5px', left: '46px', width: '12px', height: '50px', backgroundColor: hairColor, borderRadius: '10px', zIndex: 4 }} />
            </div>,
            // 4: Bun
            <div key="4">
                <div style={{ position: 'absolute', top: '-18px', left: '18px', width: '24px', height: '24px', backgroundColor: hairColor, borderRadius: '50%', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '-8px', left: '-2px', width: '64px', height: '45px', backgroundColor: hairColor, borderRadius: '24px 24px 10px 10px', zIndex: 3 }} />
            </div>,
            // 5: Curly Afro
            <div key="5">
                <div style={{ position: 'absolute', top: '-15px', left: '-10px', width: '80px', height: '70px', backgroundColor: hairColor, borderRadius: '50%', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '-5px', left: '0px', width: '60px', height: '40px', backgroundColor: hairColor, borderRadius: '50% 50% 0 0', zIndex: 3, opacity: 0.8 }} />
            </div>,
            // 6: Mohawk
            <div key="6">
                <div style={{ position: 'absolute', top: '-15px', left: '25px', width: '10px', height: '40px', backgroundColor: hairColor, borderRadius: '50% 50% 0 0', zIndex: 3 }} />
                <div style={{ position: 'absolute', top: '-5px', left: '0px', width: '60px', height: '40px', backgroundColor: hairColor, borderRadius: '0 0 10px 10px', zIndex: 1, opacity: 0.3 }} /> {/* Shaved sides */}
            </div>,
            // 7: Side Part
            <div key="7">
                <div style={{ position: 'absolute', top: '-5px', left: '-2px', width: '64px', height: '40px', backgroundColor: hairColor, borderRadius: '24px 24px 4px 4px', zIndex: 3 }} />
                <div style={{ position: 'absolute', top: '5px', left: '40px', width: '2px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 4 }} />
            </div>,
            // 8: Bald (Empty)
            <div key="8" />
        ];
        return styles[hairStyle % styles.length] || styles[0];
    };

    const Body = () => {
        return (
            <div style={{
                position: 'relative',
                marginTop: '-12px',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'center'
            }}>
                {/* Legs - Common */}
                <div className={(isAnimating || animationType === 'walking') ? 'leg-swing-left' : animationType === 'dancing' ? 'dance-leg-left' : ''} style={{ position: 'absolute', bottom: '-10px', left: '4px', width: '10px', height: '14px', backgroundColor: '#333', borderRadius: '0 0 4px 4px', transformOrigin: 'top center' }} />
                <div className={(isAnimating || animationType === 'walking') ? 'leg-swing-right' : animationType === 'dancing' ? 'dance-leg-right' : ''} style={{ position: 'absolute', bottom: '-10px', right: '4px', width: '10px', height: '14px', backgroundColor: '#333', borderRadius: '0 0 4px 4px', transformOrigin: 'top center' }} />

                {/* Outfit Variants */}
                {outfitStyle === 0 && ( // T-Shirt & Pants (Basic)
                    <div style={{ width: '32px', height: '40px', backgroundColor: outfitColor, borderRadius: '12px 12px 8px 8px' }}>
                        <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '12px', backgroundColor: '#4a90e2', borderRadius: '0 0 8px 8px' }} /> {/* Pants */}
                    </div>
                )}

                {outfitStyle === 1 && ( // Dress
                    <div style={{ width: '32px', height: '40px', backgroundColor: outfitColor, borderRadius: '12px 12px 0 0' }}>
                        <div style={{ position: 'absolute', bottom: '-5px', left: '-4px', width: '40px', height: '20px', backgroundColor: outfitColor, borderRadius: '4px 4px 12px 12px' }} />
                    </div>
                )}

                {outfitStyle === 2 && ( // Overalls
                    <div style={{ width: '34px', height: '40px', backgroundColor: '#57606f', borderRadius: '8px 8px 12px 12px' }}>
                        <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '15px', backgroundColor: outfitColor, borderRadius: '4px' }} /> {/* Shirt under */}
                        <div style={{ position: 'absolute', top: '0', left: '6px', width: '4px', height: '40px', backgroundColor: '#57606f' }} />
                        <div style={{ position: 'absolute', top: '0', right: '6px', width: '4px', height: '40px', backgroundColor: '#57606f' }} />
                    </div>
                )}

                {outfitStyle === 3 && ( // Robe/Kimono
                    <div style={{ width: '36px', height: '42px', backgroundColor: outfitColor, borderRadius: '10px 10px 4px 4px', borderLeft: '4px solid rgba(0,0,0,0.1)' }}>
                        <div style={{ position: 'absolute', top: '15px', width: '100%', height: '8px', backgroundColor: '#ffeaa7' }} /> {/* Sash */}
                    </div>
                )}

                {outfitStyle === 4 && ( // Super Shield/Cape
                    <div style={{ width: '32px', height: '40px', backgroundColor: '#2f3542', borderRadius: '12px' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px' }}>⚡</div>
                        <div style={{ position: 'absolute', top: '5px', left: '-10px', width: '52px', height: '35px', backgroundColor: outfitColor, borderRadius: '4px', zIndex: -1 }} /> {/* Cape */}
                    </div>
                )}

                {outfitStyle === 5 && ( // Hoodie
                    <div style={{ width: '34px', height: '40px', backgroundColor: outfitColor, borderRadius: '12px 12px 8px 8px' }}>
                        <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0 0 4px 4px' }} /> {/* Pocket */}
                        <div style={{ position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)', width: '38px', height: '12px', backgroundColor: outfitColor, borderRadius: '8px', zIndex: -1 }} /> {/* Hood Down */}
                    </div>
                )}

                {outfitStyle === 6 && ( // Suit/Formal
                    <div style={{ width: '32px', height: '40px', backgroundColor: '#2d3436', borderRadius: '4px' }}>
                        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '100%', backgroundColor: '#fff' }} /> {/* Shirt */}
                        <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', backgroundColor: outfitColor, borderRadius: '50%' }} /> {/* Tie/Bow */}
                        <div style={{ position: 'absolute', top: '0', left: '0', width: '8px', height: '100%', backgroundColor: '#2d3436' }} />
                        <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '100%', backgroundColor: '#2d3436' }} />
                    </div>
                )}

                {outfitStyle === 7 && ( // Adventurer
                    <div style={{ width: '32px', height: '40px', backgroundColor: '#e17055', borderRadius: '8px' }}>
                        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', border: '2px dashed #636e72', borderRadius: '8px' }} />
                        <div style={{ position: 'absolute', top: '10px', right: '-4px', width: '8px', height: '12px', backgroundColor: outfitColor, borderRadius: '2px' }} /> {/* Pouch */}
                    </div>
                )}

                {/* Arms - Animated based on type */}
                <div className={animationType === 'waving' ? 'animate-wave' : animationType === 'dancing' ? 'dance-arm-left' : ''} style={{
                    position: 'absolute', left: '-8px', top: '4px', width: '10px', height: '22px',
                    backgroundColor: outfitColor, borderRadius: '10px',
                    transformOrigin: 'top center',
                    transform: 'rotate(20deg)'
                }} />
                <div className={animationType === 'dancing' ? 'dance-arm-right' : ''} style={{
                    position: 'absolute', right: '-8px', top: '4px', width: '10px', height: '22px',
                    backgroundColor: outfitColor, borderRadius: '10px',
                    transform: 'rotate(-20deg)'
                }} />
            </div>
        );
    };

    return (
        <div className={`flex flex-col items-center cursor-pointer transition-transform drop-shadow-md ${isAnimating || animationType === 'walking' ? 'animate-float' : animationType === 'dancing' ? 'animate-dance' : ''} z-100000000`}>
            <div className="relative">
                <Hair />
                <Head />
            </div>
            <Body />
        </div>
    );
}
