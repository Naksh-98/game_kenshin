"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import BScroll from 'better-scroll';
import VillageMap from '../components/VillageMap';
import Icons from "../components/Icons";
import ObjectEditor from '../components/ObjectEditor';
import DollEditor from '../components/DollEditor';
import HouseEditor from '../components/HouseEditor';
import { initialItems, getAsset } from '../components/GameAssets';
import Intro from '../components/Intro';

// Simple Minimap
// const Minimap = ({ items }) => {
//   return (
//     <div className="fixed top-6 right-6 w-[150px] h-[150px] bg-white/80 rounded-xl border-2 border-white/50 overflow-hidden z-[100]">
//       {items.map(item => (
//         <div key={item.id} style={{
//           position: 'absolute',
//           left: `${(item.x / window.innerWidth) * 100}%`,
//           top: `${(item.y / window.innerHeight) * 100}%`,
//           width: item.type === 'doll' ? '4px' : '6px',
//           height: item.type === 'doll' ? '4px' : '6px',
//           backgroundColor: item.type === 'doll' ? 'red' : (item.type.includes('house') ? 'orange' : 'green'),
//           borderRadius: '50%'
//         }} />
//       ))}
//     </div>
//   );
// };

export default function Home() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editorType, setEditorType] = useState(null); // 'doll', 'house', 'object'
  const [editorInitialData, setEditorInitialData] = useState(null);
  const [skyColor, setSkyColor] = useState('#81ecec');
  const [groundColor, setGroundColor] = useState('#55efc4');
  const [highlightedId, setHighlightedId] = useState(null);
  const [horizonPos, setHorizonPos] = useState(50); // Percentage
  const [weather, setWeather] = useState('none'); // 'none', 'snow', 'sakura'
  const [cameraZoom, setCameraZoom] = useState(1); // Zoom level
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgmRef = useRef(null);
  const menuRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [showUI, setShowUI] = useState(true);
  const [showDock, setShowDock] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false); // Controls intro visibility

  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialItemId, setTutorialItemId] = useState(null);

  // Close menu & music panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setShowMusicPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Song list — add your songs to public/ folder and list them here
  const songs = [
    { name: 'Sofia City', file: '/musics/bgm.mp3' },
    { name: 'Area Land Under Cultivation', file: '/musics/Area_-_Land_Under_Cultivation.mp3' },
    { name: 'Area Navida Relics Xmas', file: '/musics/Area_-_Navida_Relics_Xmas.mp3' },
    { name: 'Area Ruined Temple', file: '/musics/Area_-_Ruined_Temple.mp3' },
    { name: 'Area Rakau Plains', file: '/musics/Area_-_Rakau_Plains.mp3' },


    { name: 'Area Lutaros Carven', file: '/musics/Area_-_Lutaros_Carven.mp3' },
    { name: 'Area New Moon Palace', file: '/musics/Area_-_New_Moon_Palace.mp3' },
    { name: 'Area Avanclain Shrine', file: '/musics/Area_-_Avanclain_Shrine.mp3' },
    { name: 'Area Ribisco Cave', file: '/musics/Area_-_Ribisco_Cave.mp3' },
    { name: 'Area Rihom Plain', file: '/musics/Area_-_Rihom_Plain.mp3' },
    { name: 'Boss Forest Wolf', file: '/musics/Boss_-_Forest_Wolf.mp3' },


  ];

  // Initialize Audio (No Auto-play)
  useEffect(() => {
    if (songs.length > 0) {
      const audio = new Audio(songs[0].file);
      audio.volume = 0.4;
      audio.loop = false;
      bgmRef.current = audio;
      setAudioReady(true);
    }
  }, []);

  const startMusic = () => {
    // If not playing, play first song using playSong logic so it cycles
    playSong(songs[0].file);
  };

  // Initial load
  useEffect(() => {
    const savedState = localStorage.getItem('village-state');
    const oldSaved = localStorage.getItem('village-items');

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.items) setItems(parsed.items);
        if (parsed.skyColor) setSkyColor(parsed.skyColor);
        if (parsed.groundColor) setGroundColor(parsed.groundColor);
        if (parsed.horizonPos) setHorizonPos(parsed.horizonPos);
        if (parsed.cameraZoom) setCameraZoom(parsed.cameraZoom);
        if (parsed.weather) setWeather(parsed.weather);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    } else if (oldSaved) {
      // Legacy support
      try { setItems(JSON.parse(oldSaved)); } catch (e) { }
    } else {
      // Default items
      const isMobile = window.innerWidth < 768;
      const defaultScale = isMobile ? 0.7 : 0.4;
      setItems([
        { id: 'house-1', type: 'house_cottage', x: 100, y: 500, data: { color: '#ff9f43', roofColor: '#e15f41', transform: { scaleX: defaultScale, scaleY: defaultScale, rotate: 0 } } },
        { id: 'tree-1', type: 'tree_oak', x: 300, y: 400, data: { transform: { scaleX: defaultScale, scaleY: defaultScale, rotate: 0 } } }
      ]);
    }

    // Check intro
    const hasSeenIntro = localStorage.getItem('village-has-seen-intro');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  // Tutorial Logic
  useEffect(() => {
    if (!showIntro) {
      const hasSeenTutorial = localStorage.getItem('village-tutorial-done');
      if (!hasSeenTutorial) {
        setTutorialStep(1);
      }
    }
  }, [showIntro]);

  useEffect(() => {
    if (tutorialStep === 1 && showDock) setTutorialStep(2);
  }, [showDock, tutorialStep]);

  const prevItemsLength = useRef(0);
  useEffect(() => {
    if (tutorialStep === 2 && items.length > prevItemsLength.current && prevItemsLength.current > 0) {
      setTutorialStep(3);
    }
    prevItemsLength.current = items.length;
  }, [items, tutorialStep]);

  useEffect(() => {
    if (tutorialStep === 3 && editingId) setTutorialStep(4);
  }, [editingId, tutorialStep]);

  const prevEditingId = useRef(null);
  useEffect(() => {
    if (tutorialStep === 4 && prevEditingId.current && !editingId) {
      // setTutorialStep(5); // Manual progression now
    }
    prevEditingId.current = editingId;
  }, [editingId, tutorialStep]);

  // Manual progression for steps 5 and 6 via tooltips

  // Auto-save System
  const itemsRef = useRef(items);
  const skyRef = useRef(skyColor);
  const groundRef = useRef(groundColor);
  const horizonRef = useRef(horizonPos);
  const isResettingRef = useRef(false);

  // Keep refs synced with state
  useEffect(() => {
    itemsRef.current = items;
    skyRef.current = skyColor;
    groundRef.current = groundColor;
    horizonRef.current = horizonPos;
  }, [items, skyColor, groundColor, horizonPos]);

  // Periodic Save
  useEffect(() => {
    const saveGame = () => {
      if (isResettingRef.current) return; // Skip save if resetting
      const data = {
        items: itemsRef.current,
        skyColor: skyRef.current,
        groundColor: groundRef.current,
        horizonPos: horizonRef.current,
        cameraZoom: cameraZoom
      };
      localStorage.setItem('village-state', JSON.stringify(data));
      // Optional: console.log("Game Saved");
    };

    const intervalId = setInterval(saveGame, 2000); // Save every 2 seconds
    window.addEventListener('beforeunload', saveGame); // Save on close

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', saveGame);
    };
  }, []);

  // ... (save effect) ...

  const addItem = (type) => {
    // Determine data based on type
    const isMobile = window.innerWidth < 768;
    const defaultScale = isMobile ? 0.7 : 0.4;
    let data = { transform: { scaleX: defaultScale, scaleY: defaultScale, rotate: 0 } }; // Adjusted scale for mobile
    if (type.startsWith('house')) {
      data = { ...data, color: '#ff9f43', roofColor: '#e15f41', type: type };
    }
    if (type === 'doll') {
      data = { ...data, name: 'New Friend', hairColor: '#6d4c41', skinColor: '#f3d2c1', outfitColor: '#ff6b6b', hairStyle: 0, outfitStyle: 0, story: '' };
    }

    // Reserve bottom 180px for the dock UI so items don't spawn behind it
    const dockSafeZone = 180;
    // Spawn in the currently visible viewport area (offset by scroll)
    const scrollX = scrollContainerRef.current?.scrollLeft || 0;
    const scrollY = scrollContainerRef.current?.scrollTop || 0;

    // Calculate spawning Y range based on type
    const horizonPixel = (window.innerHeight * (parseInt(horizonPos) / 100));
    let spawnY;
    let spawnX = (scrollX + Math.random() * (window.innerWidth - 100) + 50) / cameraZoom;

    if (type === 'sun') {
      // Spawn in sky (top to horizon)
      const maxSky = Math.max(50, horizonPixel - 80);
      spawnY = 20 + Math.random() * (maxSky - 20);
    } else if (type === 'fish') {
      // Find a water item to spawn into
      const waterItem = items.find(i => ['pond', 'river_h', 'river_v'].includes(i.type));

      if (!waterItem) {
        alert("Please place a Pond or River first!");
        return;
      }

      // Defaults for size
      let w = 80; let h = 60;
      if (waterItem.type === 'river_h') { w = 90; h = 50; }
      if (waterItem.type === 'river_v') { w = 50; h = 90; }
      if (waterItem.type === 'pond') { w = 100; h = 80; }

      // Spawn relatively center
      spawnX = waterItem.x + 10 + Math.random() * (w - 20);
      spawnY = waterItem.y + 10 + Math.random() * (h - 20);

    } else {
      // Spawn on ground (horizon to dock safe zone)
      // Allow slight overlap with horizon for depth (minus small buffer if needed, or exact)
      const safeMinY = horizonPixel - 20;
      const safeMaxY = window.innerHeight - dockSafeZone - 50;

      // Ensure we have a valid range
      const validMaxY = Math.max(safeMinY + 50, safeMaxY);
      let baseSpawnY = safeMinY + Math.random() * (validMaxY - safeMinY);

      // If we scrolled, try to spawn relatively centered in the visible area if it fits
      let visibleCenterY = (scrollY + window.innerHeight / 2) / cameraZoom;
      if (visibleCenterY > safeMinY && visibleCenterY < window.innerHeight - 50) {
        spawnY = visibleCenterY + (Math.random() - 0.5) * 100;
        spawnY = Math.max(safeMinY, Math.min(spawnY, window.innerHeight - 50));
      } else {
        spawnY = baseSpawnY;
      }
    }

    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      x: spawnX,
      y: spawnY,
      data
    };

    setItems([...items, newItem]);

    if (tutorialStep === 2) {
      setTutorialItemId(newItem.id);
      setHighlightedId(newItem.id);
    } else {
      // Highlight the new item
      setHighlightedId(newItem.id);
      setTimeout(() => setHighlightedId(null), 2000);

      if (type === 'doll') {
        setEditingId(newItem.id);
        setEditorType('doll');
      }
    }

  };

  // --- Save/Load File Logic ---
  const handleExportSave = () => {
    const data = {
      items,
      skyColor,
      groundColor,
      horizonPos,
      cameraZoom,
      weather,
      timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `village-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.items) setItems(parsed.items);
        if (parsed.skyColor) setSkyColor(parsed.skyColor);
        if (parsed.groundColor) setGroundColor(parsed.groundColor);
        if (parsed.horizonPos !== undefined) setHorizonPos(parsed.horizonPos);
        if (parsed.cameraZoom !== undefined) setCameraZoom(parsed.cameraZoom);
        if (parsed.weather) setWeather(parsed.weather);
        alert("Village loaded successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to load save file. Invalid format.");
      }
    };
    reader.readAsText(file);
    setIsMenuOpen(false);
    e.target.value = null; // Reset so same file can be loaded again if needed
  };

  const handleSaveEditor = (newData) => {
    setItems(prev => prev.map(item => {
      if (item.id === editingId) {
        const newType = newData.type && newData.type.startsWith('house') ? newData.type : item.type;
        // Merge transform data if ObjectEditor
        const mergedData = { ...item.data, ...newData };
        return { ...item, type: newType, data: mergedData };
      }
      return item;
    }));
    setEditingId(null);
    setEditorType(null);
    if (tutorialStep === 4) {
      setTutorialStep(5); // Manual progression after editor is closed
    }
  };

  const handleDeleteItem = () => {
    // if (confirm("Delete this item?")) {
    setItems(prev => prev.filter(i => i.id !== editingId));
    setEditingId(null);
    setEditorType(null);
    // }
  };

  /* Fish Spawning Logic */
  const handleAddFish = (parentItem, config) => {
    if (!parentItem) return;

    // Bounds check
    let w = 80; let h = 60;
    if (parentItem.type === 'river_h') { w = 90; h = 50; }
    if (parentItem.type === 'river_v') { w = 50; h = 90; }
    if (parentItem.type === 'pond') { w = 100; h = 80; }

    const spawnX = parentItem.x + 10 + Math.random() * (w - 20);
    const spawnY = parentItem.y + 10 + Math.random() * (h - 20);

    const newFish = {
      id: `fish-${Date.now()}`,
      type: 'fish',
      x: spawnX,
      y: spawnY,
      data: {
        color: config.color || '#ff9f43',
        scale: config.scale || 1
      },
      // Important: Link to parent so we know which container it belongs to (optional, but good for logic)
      containerId: parentItem.id
    };

    setItems(prev => [...prev, newFish]);
  };

  const handleEditItem = (item) => {
    setEditingId(item.id);

    // If it's a water item, attach the fish spawner
    if (['pond', 'river_h', 'river_v'].includes(item.type)) {
      setEditorInitialData({
        ...item,
        onAddFish: (config) => handleAddFish(item, config)
      });
      setEditorType('object');
    } else {
      setEditorInitialData(item);
      if (item.type === 'doll') {
        setEditorType('doll');
      } else if (item.type.startsWith('house_')) {
        setEditorType('house');
      } else {
        setEditorType('object');
      }
    }
  };



  const dockRef = React.useRef(null);

  useEffect(() => {
    if (showDock && dockRef.current) {
      const bs = new BScroll(dockRef.current, {
        scrollX: true,
        scrollY: false,
        click: true,
        bounce: true,
        mouseWheel: true,
        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }
      });
      return () => bs.destroy();
    }
  }, [showDock]);

  // BGM — play selected song, no loop
  // BGM — play selected song, cycle to next on end
  // BGM — play selected song, cycle to next on end
  const playSong = (songFile) => {
    // Stop current song if playing
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.onended = null;
    }

    if (currentSong === songFile) {
      // Clicking the same song stops it
      setCurrentSong(null);
      bgmRef.current = null;
      return;
    }

    const audio = new Audio(songFile);
    audio.volume = isMuted ? 0 : 0.4;
    audio.loop = false;
    bgmRef.current = audio;
    setCurrentSong(songFile);

    // Play next song when ended
    audio.onended = () => {
      const currentIndex = songs.findIndex(s => s.file === songFile);
      // Loop back to start if at end
      const nextIndex = (currentIndex + 1) % songs.length;
      playSong(songs[nextIndex].file);
    };

    audio.play().catch(err => console.error("Audio playback error:", err));
  };

  const toggleMute = () => {
    if (bgmRef.current) {
      if (isMuted) {
        bgmRef.current.volume = 0.4;
        bgmRef.current.play().catch(() => { });
      } else {
        bgmRef.current.volume = 0;
      }
      //  bgmRef.current.volume = isMuted ? 0.4 : 0;
    }
    setIsMuted(!isMuted);
  };

  const stopMusic = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
    setCurrentSong(null);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('village-has-seen-intro', 'true');
  };

  if (showIntro) {
    return <Intro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="w-screen h-[100dvh] relative overflow-hidden touch-none overscroll-none">

      {/* Scrollable world container */}
      <div
        ref={scrollContainerRef}
        className="w-screen h-[100dvh] overflow-hidden touch-none overscroll-none outline-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Wide world content */}
        <div className="relative overflow-hidden" style={{ width: `${Math.max(300, 100 / cameraZoom)}vw`, height: `${Math.max(100, 100 / cameraZoom)}vh`, transform: `scale(${cameraZoom})`, transformOrigin: 'top left' }}>
          {/* Background Layers */}
          <div
            className="absolute top-0 left-0 w-full transition-colors duration-1000 ease-in-out"
            style={{ height: `${horizonPos}vh`, background: skyColor }}
          />
          <div
            className="absolute left-0 w-full bottom-0 transition-colors duration-1000 ease-in-out"
            style={{ top: `${horizonPos}vh`, background: groundColor }}
          />

          {/* Village Canvas */}
          <VillageMap
            items={items}
            setItems={setItems}
            onEditItem={handleEditItem}
            highlightedId={highlightedId}
            tutorialItemId={tutorialItemId}
            tutorialStep={tutorialStep}
            horizonPos={horizonPos}
            isSelectionMode={isSelectionMode}
            onToggleSelection={() => setIsSelectionMode(!isSelectionMode)}
            scrollContainerRef={scrollContainerRef}
            cameraZoom={cameraZoom}
            setCameraZoom={setCameraZoom}
            weather={weather}
          />
        </div>
      </div>

      {/* Dock Toggle Button */}
      {showDock ? <button
        onClick={() => setShowDock(!showDock)}
        className={`fixed bottom-[max(100px,calc(100px+env(safe-area-inset-bottom)))] right-6 w-14 h-14 bg-white/90 backdrop-blur-xl border-2 border-white/50 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all text-gray-700 animate-bounce-subtle ${tutorialStep === 1 ? 'z-[10000010] ring-[6px] ring-white bg-white/100 shadow-[0_0_30px_rgba(255,255,255,0.8)]' : 'z-[10000001]'}`}
        title={showDock ? "Close Menu" : "Open Items"}
      >
        <span className="bottom-1">✖️</span>
      </button> : <button
        onClick={() => setShowDock(!showDock)}
        className={`fixed bottom-[max(24px,calc(24px+env(safe-area-inset-bottom)))] right-6 w-14 h-14 bg-white/90 backdrop-blur-xl border-2 border-white/50 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all text-gray-700 animate-bounce-subtle ${tutorialStep === 1 ? 'z-[10000010] ring-[6px] ring-white bg-white/100 shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse' : 'z-[10000001]'}`}
        title={showDock ? "Close Menu" : "Open Items"}
      >
        <span className="text-blue-500">🎒</span>
      </button>}

      {/* UI Overlay - Dock */}
      <div
        className={`absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] bg-white/65 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_4px_16px_0_rgba(31,38,135,0.15)] pointer-events-auto transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showDock ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0 pointer-events-none'} ${tutorialStep === 2 ? 'z-[10000010] ring-[4px] ring-white bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'z-[1000000]'}`}
      >
        <div
          ref={dockRef}
          className="w-full h-full overflow-hidden px-4 py-3 cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-4 inline-flex w-max items-center pr-8">
            {/* Group 1: Houses */}
            <div className="flex gap-1.5 border-r border-gray-300 pr-4 items-center">
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_cottage')} title="Cottage">🏠</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_mansion')} title="Mansion">🏰</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_pagoda')} title="Pagoda">⛩️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_cabin')} title="Cabin">🪵</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_castle')} title="Castle">🏯</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_skyscraper')} title="Skyscraper">🏢</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_barn')} title="Barn">🛖</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_tent')} title="Tent">⛺</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_modern')} title="Modern">🏘️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_shop')} title="Shop">🏪</button>
            </div>

            {/* Group 2: Nature */}
            <div className="flex gap-1.5 border-r border-gray-300 pr-4 items-center">
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('tree_oak')} title="Oak">🌳</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('grass')} title="Grass">☘️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('grass_two')} title="Weed">🌿</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('tree_pine')} title="Pine">🌲</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('tree_sakura')} title="Sakura">🌸</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('bush')} title="Bush">🌿</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('rock')} title="Rock">🪨</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('flower_rose')} title="Rose">🌹</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('flower_tulip')} title="Tulip">🌷</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('flower_sunflower')} title="Sunflower">🌻</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('cactus')} title="Cactus">🌵</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('mushroom')} title="Mushroom">🍄</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('log')} title="Log">🪵</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('stump')} title="Stump">🪓</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('bamboo')} title="Bamboo">🎋</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('crystal')} title="Crystal">💎</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('sun')} title="Sun">☀️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('snowman')} title="Snowman">⛄</button>
            </div>

            {/* Group 3: Features */}
            <div className="flex gap-1.5 items-center">
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('river_h')} title="River H">🛶</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('river_v')} title="River V">🌊</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('pond')} title="Pond">💧</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('dirt_path_h')} title="Dirt Path H">🛤️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('dirt_path_v')} title="Dirt Path V">🛤️</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('stone_path_h')} title="Stone Path H">🪨</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('stone_path_v')} title="Stone Path V">🪨</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('bridge_h')} title="Bridge H">🌉</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('bridge_v')} title="Bridge V">🌉</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('fish')} title="Fish">🐟</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('garden')} title="Garden">🌻</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('doll')} title="Doll">👶</button>
              <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('snow_ground')} title="Snow Patch">❄️</button>
            </div>
          </div>
        </div>
      </div>      {/* Top Right Menu */}
      <div ref={menuRef} className={`fixed top-4 right-4 flex flex-col items-end transition-all duration-300 ${tutorialStep === 6 ? 'z-[10000010] ring-[6px] ring-white/50 rounded-2xl bg-white/20 p-2 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'z-[1000]'}`}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-white transition-all text-gray-700 font-bold"
          title="Menu"
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className="mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 w-40 animate-pop origin-top-right">
            <button
              onClick={handleExportSave}
              className="px-3 py-2 text-sm text-left hover:bg-black/5 rounded-lg flex items-center gap-2 transition-colors font-medium text-gray-700"
            >
              💾 Save File
            </button>
            <button
              onClick={handleImportClick}
              className="px-3 py-2 text-sm text-left hover:bg-black/5 rounded-lg flex items-center gap-2 transition-colors font-medium text-gray-700"
            >
              📂 Load File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <hr className="border-gray-200 my-1" />
            <button
              onClick={() => setShowMusicPanel(!showMusicPanel)}
              className="px-3 py-2 text-sm text-left hover:bg-black/5 rounded-lg flex items-center gap-2 transition-colors font-medium text-gray-700"
            >
              🎵 Music {currentSong ? '▶' : ''}
            </button>
          </div>
        )}

        {/* Music Panel */}
        {showMusicPanel && (
          <div className="mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 w-52 animate-pop origin-top-right">
            <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Now Playing</div>
            {songs.map(song => (
              <button
                key={song.file}
                onClick={() => playSong(song.file)}
                className={`px-3 py-2 text-sm text-left rounded-lg flex items-center gap-2 transition-colors font-medium ${currentSong === song.file
                  ? 'bg-[#00b894]/15 text-[#00b894] font-bold'
                  : 'hover:bg-black/5 text-gray-700'
                  }`}
              >
                {currentSong === song.file ? '⏸️' : '▶️'} {song.name}
              </button>
            ))}
            {currentSong && (
              <>
                <hr className="border-gray-200 my-1" />
                <button
                  onClick={stopMusic}
                  className="px-3 py-2 text-sm text-left rounded-lg hover:bg-black/5 text-gray-600 transition-colors font-medium flex items-center gap-2"
                >
                  ⏹️ Stop
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Intro / Title + Bg Color Picker */}
      <div className={`fixed top-4 left-4 pointer-events-none max-w-[90vw] transition-all duration-300 ${tutorialStep === 5 ? 'z-[10000010] ring-[6px] ring-white/50 rounded-2xl bg-white/20 p-2 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'z-50'}`}>
        <div className="flex items-center gap-2 pointer-events-auto">
          <h1 className="text-xl md:text-3xl font-extrabold text-[#2d3436] drop-shadow-md">
            Village Decor 🌸
          </h1>
          <button
            onClick={() => setShowUI(!showUI)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm border border-gray-200 transition-all text-sm active:scale-95 touch-manipulation"
            title={showUI ? "Hide Controls" : "Show Controls"}
          >
            {showUI ? '👁️' : '🙈'}
          </button>
        </div>

        {showUI && (
          <div className="animate-fade-in origin-top-left transition-all">
            <p className="opacity-70 text-xs md:text-sm mt-0.5 text-gray-700">Drag items to decorate! Click to edit.</p>

            {audioReady && !currentSong && (
              <button
                onClick={startMusic}
                className="pointer-events-auto mt-2 bg-[#00b894] hover:bg-[#00a884] text-white px-4 py-2 rounded-xl shadow-lg font-bold flex items-center gap-2 transition-all animate-pulse"
              >
                🎵 Start Music
              </button>
            )}

            <div className="pointer-events-auto mt-2 flex flex-col gap-2 max-w-sm">
              <div className="flex gap-2">
                <button
                  className={`py-2 px-4 rounded-xl cursor-pointer text-xs font-bold shadow-md transition-all min-h-[40px] border-2 whitespace-nowrap touch-manipulation ${isSelectionMode
                    ? 'bg-[#00b894] text-white border-[#00a884] hover:bg-[#00a884]'
                    : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-lg'
                    }`}
                  onClick={() => setIsSelectionMode(!isSelectionMode)}
                >
                  {isSelectionMode ? '✅ Done' : '🖱️ Select'}
                </button>

                <button
                  className="py-2 px-4 rounded-xl cursor-pointer text-xs font-bold shadow-md transition-all min-h-[40px] border-2 bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:text-red-500 whitespace-nowrap touch-manipulation"
                  onClick={() => {
                    if (confirm("Start over with a new village?")) {
                      isResettingRef.current = true; // Block auto-save
                      localStorage.removeItem('village-items');
                      localStorage.removeItem('village-state');
                      localStorage.removeItem('village-tutorial-done');
                      localStorage.removeItem('village-has-seen-intro');
                      window.location.reload();
                    }

                  }}
                >
                  🔄 Reset
                </button>
                <div className="flex gap-1 bg-white rounded-xl shadow-md border-2 border-gray-100 p-0.5 min-h-[40px] items-center touch-manipulation">
                  <button onClick={() => setCameraZoom(z => Math.max(0.2, z - 0.1))} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-lg">
                    -
                  </button>
                  <div className="text-xs font-bold w-12 text-center text-gray-700 select-none">
                    {Math.round(cameraZoom * 100)}%
                  </div>
                  <button onClick={() => setCameraZoom(z => Math.min(3, z + 0.1))} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-lg">
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <label className="flex flex-col justify-center gap-0.5 bg-white p-1.5 rounded-lg text-[10px] font-bold shadow-md border-2 border-gray-100 h-10 min-w-[50px]">
                  <span className="text-black leading-none">Sky</span>
                  <input type="color" value={skyColor} onChange={(e) => setSkyColor(e.target.value)} className="border-none w-full h-4 cursor-pointer bg-transparent rounded" />
                </label>

                <label className="flex flex-col justify-center gap-0.5 bg-white p-1.5 rounded-lg text-[10px] font-bold shadow-md border-2 border-gray-100 h-10 min-w-[50px]">
                  <span className="text-black leading-none">Ground</span>
                  <input type="color" value={groundColor} onChange={(e) => setGroundColor(e.target.value)} className="border-none w-full h-4 cursor-pointer bg-transparent rounded" />
                </label>

                <label className="flex flex-col justify-center gap-0.5 bg-white p-1.5 rounded-lg text-[10px] font-bold shadow-md border-2 border-gray-100 h-10 w-24">
                  <span className="text-black leading-none">Horizon</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={horizonPos}
                    onChange={(e) => setHorizonPos(e.target.value)}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b894]"
                  />
                </label>

                <label className="flex flex-col justify-center gap-0.5 bg-white p-1.5 rounded-lg text-[10px] font-bold shadow-md border-2 border-gray-100 h-10 w-24">
                  <span className="text-black leading-none">Weather</span>
                  <select value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full h-4 bg-transparent border-none text-[10px] font-bold cursor-pointer text-[#00b894] outline-none">
                    <option value="none">Clear</option>
                    <option value="snow">Snow</option>
                    <option value="sakura">Sakura</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BGM Toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-16 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer touch-manipulation"
        title={isMuted ? 'Unmute Music' : 'Mute Music'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Editor Modal */}
      {editingId && editorInitialData && (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-hidden touch-none h-[100dvh] max-h-[100dvh] w-screen ${tutorialStep === 4 ? 'z-[10000010]' : 'z-[10000005]'}`}>
          <div className="animate-pop relative w-full h-full max-w-[700px] md:h-auto md:w-auto flex flex-col items-center justify-center max-h-full">
            <button
              className="absolute -top-4 -right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              onClick={() => { setEditingId(null); setEditorType(null); if (tutorialStep === 4) setTutorialStep(5); }}
            >
              <Icons.Close />
            </button>

            {editorType === 'doll' && (
              <DollEditor
                initialData={editorInitialData}
                onSave={handleSaveEditor}
                onDelete={handleDeleteItem}
              />
            )}

            {editorType === 'house' && (
              <HouseEditor
                initialData={editorInitialData}
                onSave={handleSaveEditor}
                onDelete={handleDeleteItem}
              />
            )}

            {editorType === 'object' && (
              <ObjectEditor
                key={editorInitialData.id}
                initialData={editorInitialData}
                onSave={handleSaveEditor}
                onDelete={handleDeleteItem}
              />
            )}

          </div>
        </div>
      )}

      {/* Tutorial Overlays */}
      {tutorialStep > 0 && <div className={`fixed inset-0 pointer-events-none z-[10000008] transition-colors duration-500 ${tutorialStep === 3 ? 'bg-black/10' : 'bg-black/60 backdrop-blur-sm'}`}></div>}

      {tutorialStep === 1 && (
        <div className="fixed bottom-[110px] right-6 bg-rose-500 text-white p-4 rounded-xl shadow-2xl z-[10000010] animate-bounce-subtle text-sm max-w-[200px] font-bold pointer-events-auto origin-bottom-right">
          🎒 Welcome to Village Decor! Tap here to open your Bag!
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-rose-500"></div>
        </div>
      )}

      {tutorialStep === 2 && showDock && (
        <div className="fixed bottom-[200px] left-1/2 -translate-x-1/2 bg-rose-500 text-white p-4 rounded-xl shadow-2xl z-[10000010] animate-bounce-subtle text-sm max-w-[250px] font-bold pointer-events-auto">
          👇 Tap any item in the dock to place it in your village!
          <div className="absolute -bottom-2 left-1/2 -ml-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-rose-500"></div>
        </div>
      )}

      {tutorialStep === 4 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white p-4 rounded-xl shadow-2xl z-[10000011] animate-bounce-subtle text-sm max-w-[300px] font-bold pointer-events-auto">
          ✨ Endless customization! Change colors, hairstyles, or size. Click Save when you're done.
          <div className="absolute -bottom-2 left-1/2 -ml-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-rose-500"></div>
        </div>
      )}

      {tutorialStep === 5 && (
        <div className="fixed top-[200px] left-4 bg-rose-500 text-white p-5 rounded-xl shadow-2xl z-[10000010] animate-bounce-subtle text-sm max-w-[320px] pointer-events-auto">
          <h3 className="font-bold text-lg mb-2">🌍 Environment Controls</h3>
          <ul className="space-y-1.5 text-xs font-semibold leading-tight mb-1">
            <li><span className="text-white bg-white/30 px-1 rounded">👁️</span> Hide or show this menu</li>
            <li><span className="text-white bg-white/30 px-1 rounded">🎵</span> Turn on background music</li>
            <li><span className="text-white bg-white/30 px-1 rounded">🖱️ Select</span> Tap to drag multiple items together</li>
            <li><span className="text-white bg-white/30 px-1 rounded">🔄 Reset</span> Clear everything and start over</li>
            <li><span className="text-white bg-white/30 px-1 rounded">+/-</span> Zoom in and zoom out</li>
            <li><span className="text-white bg-white/30 px-1 rounded">Sky/Ground</span> Pick custom base colors</li>
            <li><span className="text-white bg-white/30 px-1 rounded">Horizon</span> Slide to adjust the ground height</li>
          </ul>
          <button onClick={() => setTutorialStep(6)} className="mt-4 w-full bg-white text-rose-500 py-2.5 rounded-lg font-extrabold shadow-md active:scale-95 transition-transform text-sm drop-shadow-sm">Got it! ➔</button>
          <div className="absolute -top-2 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-rose-500"></div>
        </div>
      )}

      {tutorialStep === 6 && (
        <div className="fixed top-[80px] right-4 bg-rose-500 text-white p-5 rounded-xl shadow-2xl z-[10000010] animate-bounce-subtle text-sm max-w-[280px] pointer-events-auto origin-top-right">
          <h3 className="font-bold text-lg mb-2">⚙️ Main Menu</h3>
          <ul className="space-y-1.5 text-xs font-semibold leading-tight mb-1">
            <li><span className="text-white bg-white/30 px-1 rounded">💾 Save File</span> Download your beautiful village to your device</li>
            <li><span className="text-white bg-white/30 px-1 rounded">📂 Load File</span> Open a previously saved village file</li>
            <li><span className="text-white bg-white/30 px-1 rounded">🎵 Music</span> Open the music player for relaxing tunes</li>
          </ul>
          <button onClick={() => { setTutorialStep(0); localStorage.setItem('village-tutorial-done', 'true'); }} className="mt-4 w-full bg-white text-rose-500 py-2.5 rounded-lg font-extrabold shadow-md active:scale-95 transition-transform text-sm drop-shadow-sm">Finish Tutorial ✓</button>
          <div className="absolute -top-2 right-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-rose-500"></div>
        </div>
      )}

    </div>
  );
}
