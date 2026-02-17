"use client";
import React, { useState, useEffect, useRef } from "react";
import VillageMap from "../components/VillageMap";
import Icons from "../components/Icons";
import DollEditor from "../components/DollEditor";
import HouseEditor from "../components/HouseEditor";
import ObjectEditor from "../components/ObjectEditor";

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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgmRef = useRef(null);
  const menuRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

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
    { name: 'Area Saham Crater', file: '/musics/Area_-_Saham_Crater.mp3' },
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
  }, []);

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
        horizonPos: horizonRef.current
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

    // Calculate spawning Y range based on type
    const horizonPixel = (window.innerHeight * (parseInt(horizonPos) / 100));
    let spawnY;
    let spawnX = scrollX + Math.random() * (window.innerWidth - 100) + 50;

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
      spawnY = safeMinY + Math.random() * (validMaxY - safeMinY);
    }

    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      x: spawnX,
      y: spawnY,
      data
    };

    setItems([...items, newItem]);

    // Highlight the new item
    setHighlightedId(newItem.id);
    setTimeout(() => setHighlightedId(null), 2000);

    if (type === 'doll') {
      setEditingId(newItem.id);
      setEditorType('doll');
    }

  };

  // --- Save/Load File Logic ---
  const handleExportSave = () => {
    const data = {
      items,
      skyColor,
      groundColor,
      horizonPos,
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
  const isDockDown = React.useRef(false);
  const dockStartX = React.useRef(0);
  const dockScrollLeft = React.useRef(0);

  const handleDockMouseDown = (e) => {
    isDockDown.current = true;
    dockRef.current.classList.add('cursor-grabbing');
    dockRef.current.classList.remove('cursor-grab');
    dockStartX.current = e.pageX - dockRef.current.offsetLeft;
    dockScrollLeft.current = dockRef.current.scrollLeft;
  };
  const handleDockMouseLeave = () => {
    isDockDown.current = false;
    dockRef.current?.classList.remove('cursor-grabbing');
    dockRef.current?.classList.add('cursor-grab');
  };
  const handleDockMouseUp = () => {
    isDockDown.current = false;
    dockRef.current?.classList.remove('cursor-grabbing');
    dockRef.current?.classList.add('cursor-grab');
  };
  const handleDockMouseMove = (e) => {
    if (!isDockDown.current) return;
    e.preventDefault();
    const x = e.pageX - dockRef.current.offsetLeft;
    const walk = (x - dockStartX.current); // 1:1 scroll speed
    dockRef.current.scrollLeft = dockScrollLeft.current - walk;
  };

  const handleDockTouchStart = (e) => {
    if (!dockRef.current) return;
    isDockDown.current = true;
    dockStartX.current = e.touches[0].pageX - dockRef.current.offsetLeft;
    dockScrollLeft.current = dockRef.current.scrollLeft;
  };
  const handleDockTouchMove = (e) => {
    if (!isDockDown.current || !dockRef.current) return;
    const x = e.touches[0].pageX - dockRef.current.offsetLeft;
    const walk = (x - dockStartX.current); // 1:1 scroll speed
    dockRef.current.scrollLeft = dockScrollLeft.current - walk;
  };
  const handleDockTouchEnd = () => {
    isDockDown.current = false;
  };

  // BGM — play selected song, no loop
  // BGM — play selected song, cycle to next on end
  const playSong = (songFile) => {
    // Stop current song if playing
    if (bgmRef.current) {
      bgmRef.current.pause();
      // Remove previous listener to avoid duplicates if re-using instance (though we create new Audio each time)
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
    audio.loop = false; // No loop, move to next
    bgmRef.current = audio;
    setCurrentSong(songFile);

    // Play next song when ended
    audio.onended = () => {
      const currentIndex = songs.findIndex(s => s.file === songFile);
      const nextIndex = (currentIndex + 1) % songs.length;
      playSong(songs[nextIndex].file);
    };

    audio.play().catch(() => { });
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

  return (
    <div className="w-screen h-screen relative overflow-x-auto overflow-y-hidden">

      {/* Scrollable world container */}
      <div
        ref={scrollContainerRef}
        className="w-screen h-screen overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#ff6b6b transparent' }}
      >
        {/* Wide world content */}
        <div className="relative" style={{ width: '300vw', height: '100vh', minHeight: '100vh' }}>
          {/* Background Layers */}
          <div
            className="absolute top-0 left-0 w-full transition-colors duration-1000 ease-in-out"
            style={{ height: `${horizonPos}%`, background: skyColor }}
          />
          <div
            className="absolute left-0 w-full bottom-0 transition-colors duration-1000 ease-in-out"
            style={{ height: `${100 - horizonPos}%`, background: groundColor }}
          />

          {/* Village Canvas */}
          <VillageMap
            items={items}
            setItems={setItems}
            onEditItem={handleEditItem}
            highlightedId={highlightedId}
            horizonPos={horizonPos}
            isSelectionMode={isSelectionMode}
            onToggleSelection={() => setIsSelectionMode(!isSelectionMode)}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>

      {/* UI Overlay - Dock */}
      <div
        ref={dockRef}
        onMouseDown={handleDockMouseDown}
        onMouseLeave={handleDockMouseLeave}
        onMouseUp={handleDockMouseUp}
        onMouseMove={handleDockMouseMove}
        onTouchStart={handleDockTouchStart}
        onTouchMove={handleDockTouchMove}
        onTouchEnd={handleDockTouchEnd}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 flex gap-2 z-[1000000] max-w-[95vw] overflow-x-auto bg-white/65 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_4px_16px_0_rgba(31,38,135,0.15)] pointer-events-auto overscroll-x-contain scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-1.5 border-r border-gray-300 pr-2 items-center">
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_cottage')} title="Cottage">🏠</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_mansion')} title="Mansion">🏰</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('house_pagoda')} title="Pagoda">⛩️</button>
        </div>
        <div className="flex gap-1.5 border-r border-gray-300 pr-2 items-center">
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
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('sun')} title="Sun">☀️</button>
        </div>
        <div className="flex gap-1.5 items-center">
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('river_h')} title="River H">🛶</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('river_v')} title="River V">🌊</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('pond')} title="Pond">💧</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('fish')} title="Fish">🐟</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('garden')} title="Garden">🌻</button>
          <button className="w-10 h-10 md:w-10 md:h-10 text-lg md:text-xl flex items-center justify-center rounded-full bg-white/65 border border-white/50 hover:bg-white/85 hover:scale-110 active:scale-95 transition-all shadow-sm touch-manipulation" onClick={() => addItem('doll')} title="Doll">👶</button>
        </div>
      </div>


      {/* Top Right Menu */}
      <div ref={menuRef} className="fixed top-4 right-4 z-50 flex flex-col items-end z-[1000000000000]">
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
      <div className="fixed top-4 left-4 z-50 pointer-events-none max-w-[90vw]">
        <h1 className="text-xl md:text-3xl font-extrabold text-[#2d3436] drop-shadow-md">
          Village Decor 🌸
        </h1>
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
                  window.location.reload();
                }

              }}
            >
              🔄 Reset
            </button>
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
          </div>
        </div>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[20000] flex items-center justify-center">
          <div className="animate-pop relative">
            <button
              className="absolute -top-4 -right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              onClick={() => { setEditingId(null); setEditorType(null); }}
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
                initialData={editorInitialData}
                onSave={handleSaveEditor}
                onDelete={handleDeleteItem}
              />
            )}

          </div>
        </div>
      )}

    </div>
  );
}
