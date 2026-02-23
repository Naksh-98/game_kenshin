import React, { useState, useRef } from 'react';

export default function Intro({ onComplete }) {
    const [step, setStep] = useState(0);
    const audioRef = useRef(null);

    const handleInteraction = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
        }
    };

    const handleNext = () => {
        handleInteraction();
        if (step < 3) {
            setStep(step + 1);
        }
    };

    return (
        <div
            onClick={handleInteraction}
            className="fixed inset-0 z-[100000] bg-white flex flex-col items-center justify-center overflow-hidden font-sans"
        >

            {/* Audio BGM */}
            <audio ref={audioRef} src="/intro/Guild_Bar.mp3" autoPlay loop className="hidden" />

            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#81ecec] to-[#55efc4] opacity-20" />

            {/* Step 0 & 1: Welcome & Scene 1 */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${step === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-105 pointer-events-none'}`}>
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#2d3436] drop-shadow-lg mb-6 text-center tracking-tight">
                    Welcome to <br /><span className="text-[#00b894] inline-block mt-2 animate-bounce">Village Decor 🌸</span>
                </h1>
                <p className="text-gray-700 text-lg md:text-2xl opacity-90 font-medium">Build your perfect little world.</p>
            </div>

            {/* Step 1 & 2: Explaining decorations */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${step === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white mb-8 animate-pulse">
                    <img src="/intro/intro1.png" alt="Empty Village" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#2d3436] mb-4 text-center">Start with an empty canvas</h2>
                <p className="text-gray-600 text-lg md:text-xl max-w-md text-center">A beautiful green land awaits your creativity.</p>
            </div>

            {/* Step 2 & 3: Placing items */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${step === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-x-8 scale-105 pointer-events-none'}`}>
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full shadow-2xl overflow-hidden border-8 border-white mb-8">
                    <img src="/intro/intro2.png" alt="Decorated Village" className="w-full h-full object-cover origin-center animate-[spin_30s_linear_infinite]" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#00b894] mb-4 text-center drop-shadow-md">Decorate your way</h2>
                <p className="text-[#2d3436] text-lg md:text-xl max-w-md text-center font-medium bg-white/50 p-4 rounded-xl">Drag, drop, rotate, and scale houses, dolls, and nature!</p>
            </div>

            {/* Step 3: Let's go */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 transform ${step === 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'}`}>
                <div className="text-[100px] mb-4 animate-[bounce_2s_infinite]">🏡</div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-[#2d3436] mb-8 text-center">Ready to create?</h2>
                <button
                    onClick={onComplete}
                    className="bg-[#00b894] hover:bg-[#00a884] text-white text-2xl font-bold py-4 px-10 rounded-full shadow-[0_10px_0_0_#008b6e] hover:shadow-[0_5px_0_0_#008b6e] hover:translate-y-[5px] transition-all active:shadow-none active:translate-y-[10px]"
                >
                    Let's Play!
                </button>
            </div>

            {/* Next Button */}
            {step < 3 && (
                <button
                    onClick={handleNext}
                    className="absolute bottom-24 bg-[#00b894] hover:bg-[#00a884] text-white text-xl font-bold py-3 px-8 rounded-full shadow-[0_6px_0_0_#008b6e] hover:shadow-[0_4px_0_0_#008b6e] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[6px] z-50 animate-bounce"
                >
                    Next ➡️
                </button>
            )}

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 bg-white/60 hover:bg-white text-gray-700 font-bold py-2 px-6 rounded-full shadow-md backdrop-blur-sm transition-all border border-gray-200 z-50 text-sm md:text-base hover:scale-105 active:scale-95"
            >
                Skip Intro ⏭️
            </button>

            {/* Progress indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${step === i ? 'bg-[#00b894] w-6' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
}
