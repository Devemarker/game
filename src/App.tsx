/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ITEM_DEFS, ItemDef } from './items';
import { calculateStats, getOccupiedCells, checkOverlap, ItemInstance } from './engine';
import { Sword, Shield, Heart, Coins, RefreshCw, Play, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const GRID_COLS = 5;
const GRID_ROWS = 5;
const CELL_SIZE = 48; // px
const CELL_GAP = 4; // px
const STEP = CELL_SIZE + CELL_GAP;

const BATTLE_BGS = [
  'https://picsum.photos/seed/slime-forest/800/400?blur=1',
  'https://picsum.photos/seed/goblin-cave/800/400?blur=1',
  'https://picsum.photos/seed/orc-camp/800/400?blur=1',
  'https://picsum.photos/seed/dragon-volcano/800/400?blur=1',
];

const checkSynergyPotential = (def: ItemDef, backpack: ItemInstance[]) => {
  return backpack.some(bpItem => {
    const bpDef = ITEM_DEFS[bpItem.itemId];
    return def.synergies.some(s => bpDef.tags.includes(s.targetTag)) ||
           bpDef.synergies.some(s => def.tags.includes(s.targetTag));
  });
};

type DragState = {
  instanceId: string;
  source: 'shop' | 'backpack';
  startX: number;
  startY: number;
  pointerX: number;
  pointerY: number;
  itemOffsetX: number;
  itemOffsetY: number;
  previewX: number | null;
  previewY: number | null;
  isValid: boolean;
  mergeTargetId: string | null;
} | null;

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  icon: string;
  size: string;
}

const ENEMIES: Enemy[] = [
  { name: '史莱姆', hp: 50, maxHp: 50, attack: 8, defense: 0, icon: '🦠', size: 'text-5xl' },
  { name: '哥布林', hp: 80, maxHp: 80, attack: 12, defense: 2, icon: '👺', size: 'text-6xl' },
  { name: '兽人', hp: 150, maxHp: 150, attack: 20, defense: 5, icon: '👹', size: 'text-7xl' },
  { name: '巨龙', hp: 400, maxHp: 400, attack: 35, defense: 10, icon: '🐉', size: 'text-8xl' },
];

export default function App() {
  const [backpack, setBackpack] = useState<ItemInstance[]>([]);
  const [shop, setShop] = useState<ItemInstance[]>([]);
  const [gold, setGold] = useState(50);
  const [level, setLevel] = useState(0);
  
  const [dragState, setDragState] = useState<DragState>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<'planning' | 'battling' | 'gameover'>('planning');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [playerHp, setPlayerHp] = useState(100);
  
  const [attacking, setAttacking] = useState<'player' | 'player_magic' | 'enemy' | null>(null);
  const [hitTarget, setHitTarget] = useState<'player' | 'enemy' | null>(null);
  const [damagePopups, setDamagePopups] = useState<{id: number, value: number, target: 'player'|'enemy', isCrit?: boolean}[]>([]);
  const [spellActive, setSpellActive] = useState(false);

  const { stats, activeSynergies, hasMagic } = useMemo(() => calculateStats(backpack), [backpack]);

  const synergyHotspots = useMemo(() => {
    if (!dragState) return [];
    const draggedItem = (dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId);
    if (!draggedItem) return [];
    const draggedDef = ITEM_DEFS[draggedItem.itemId];
    const hotspots: {x: number, y: number}[] = [];

    const otherItems = backpack.filter(i => i.instanceId !== dragState.instanceId);

    const getAdjacentCells = (item: ItemInstance, def: ItemDef) => {
      const occupied = getOccupiedCells(item, def);
      const adj = new Set<string>();
      occupied.forEach(cell => {
        [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dx, dy]) => {
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS) {
            if (!occupied.some(c => c.x === nx && c.y === ny)) {
              adj.add(`${nx},${ny}`);
            }
          }
        });
      });
      return Array.from(adj).map(s => {
        const [x, y] = s.split(',').map(Number);
        return {x, y};
      });
    };

    otherItems.forEach(other => {
      const otherDef = ITEM_DEFS[other.itemId];
      let isSynergy = false;
      if (draggedDef.synergies.some(syn => otherDef.tags.includes(syn.targetTag))) isSynergy = true;
      if (otherDef.synergies.some(syn => draggedDef.tags.includes(syn.targetTag))) isSynergy = true;

      if (isSynergy) {
        hotspots.push(...getAdjacentCells(other, otherDef));
      }
    });

    const uniqueHotspots: {x: number, y: number}[] = [];
    const seen = new Set<string>();
    hotspots.forEach(h => {
      const key = `${h.x},${h.y}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueHotspots.push(h);
      }
    });
    return uniqueHotspots;
  }, [dragState, backpack, shop]);

  // Initialize shop
  useEffect(() => {
    refreshShop(true);
  }, []);

  const refreshShop = (isFree = false) => {
    if (!isFree && gold < 5 && shop.length > 0) return; // Free first refresh or if empty, otherwise costs 5
    if (!isFree && shop.length > 0) {
      setGold(g => Math.max(0, g - 5));
    }
    
    const itemKeys = Object.keys(ITEM_DEFS).filter(k => ITEM_DEFS[k].level === 1);
    const newShop: ItemInstance[] = Array.from({ length: 4 }).map(() => {
      const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
      return {
        instanceId: Math.random().toString(36).substring(7),
        itemId: randomKey,
      };
    });
    setShop(newShop);
  };

  const handlePointerDown = (e: React.PointerEvent, item: ItemInstance, source: 'shop' | 'backpack') => {
    if (gameState !== 'planning') return;
    
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    setDragState({
      instanceId: item.instanceId,
      source,
      startX: item.x ?? 0,
      startY: item.y ?? 0,
      pointerX: e.clientX,
      pointerY: e.clientY,
      itemOffsetX: e.clientX - rect.left,
      itemOffsetY: e.clientY - rect.top,
      previewX: null,
      previewY: null,
      isValid: false,
      mergeTargetId: null,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!gridRef.current) return;
      
      const gridRect = gridRef.current.getBoundingClientRect();
      
      // Calculate position relative to grid
      const relativeX = e.clientX - dragState.itemOffsetX - gridRect.left;
      const relativeY = e.clientY - dragState.itemOffsetY - gridRect.top;
      
      // Snap to grid
      const gridX = Math.round(relativeX / STEP);
      const gridY = Math.round(relativeY / STEP);
      
      const item = (dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId);
      if (!item) return;
      
      const def = ITEM_DEFS[item.itemId];
      const shapeHeight = def.shape.length;
      const shapeWidth = def.shape[0].length;
      
      let isValid = false;
      let mergeTargetId: string | null = null;
      let previewX = gridX;
      let previewY = gridY;
      
      // Check bounds
      if (gridX >= 0 && gridX + shapeWidth <= GRID_COLS && gridY >= 0 && gridY + shapeHeight <= GRID_ROWS) {
        // Check overlap
        const testItem = { ...item, x: gridX, y: gridY };
        const testCells = getOccupiedCells(testItem, def);
        
        const otherItems = backpack.filter(i => i.instanceId !== dragState.instanceId);
        const overlappingItems: ItemInstance[] = [];
        
        for (const other of otherItems) {
          const otherDef = ITEM_DEFS[other.itemId];
          const otherCells = getOccupiedCells(other, otherDef);
          if (checkOverlap(testCells, otherCells)) {
            overlappingItems.push(other);
          }
        }
        
        if (overlappingItems.length === 0) {
          isValid = true;
        } else if (overlappingItems.length === 1) {
          const target = overlappingItems[0];
          // Allow merge if it's the exact same item type, has a next level, and dropped at the exact same position
          if (target.itemId === item.itemId && def.nextLevelId && target.x === gridX && target.y === gridY) {
            isValid = true;
            mergeTargetId = target.instanceId;
          }
        }
      } else {
        previewX = -1;
        previewY = -1;
      }

      setDragState(prev => prev ? {
        ...prev,
        pointerX: e.clientX,
        pointerY: e.clientY,
        previewX,
        previewY,
        isValid,
        mergeTargetId
      } : null);
    };

    const handlePointerUp = () => {
      if (!dragState) return;
      
      const item = (dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId);
      if (!item) {
        setDragState(null);
        return;
      }

      const def = ITEM_DEFS[item.itemId];

      if (dragState.isValid && dragState.previewX !== null && dragState.previewY !== null && dragState.previewX >= 0) {
        // Valid drop on grid
        if (dragState.mergeTargetId) {
          // Handle Merge
          const nextLevelId = def.nextLevelId!;
          if (dragState.source === 'shop') {
            if (gold >= def.price) {
              setGold(g => g - def.price);
              setShop(prev => prev.filter(i => i.instanceId !== dragState.instanceId));
              setBackpack(prev => prev.map(i => i.instanceId === dragState.mergeTargetId ? { ...i, itemId: nextLevelId } : i));
            }
          } else {
            setBackpack(prev => prev
              .filter(i => i.instanceId !== dragState.instanceId)
              .map(i => i.instanceId === dragState.mergeTargetId ? { ...i, itemId: nextLevelId } : i)
            );
          }
        } else {
          // Normal placement
          if (dragState.source === 'shop') {
            if (gold >= def.price) {
              setGold(g => g - def.price);
              setShop(prev => prev.filter(i => i.instanceId !== dragState.instanceId));
              setBackpack(prev => [...prev, { ...item, x: dragState.previewX!, y: dragState.previewY! }]);
            } else {
              // Not enough gold
            }
          } else {
            // Move within backpack
            setBackpack(prev => prev.map(i => i.instanceId === dragState.instanceId ? { ...i, x: dragState.previewX!, y: dragState.previewY! } : i));
          }
        }
      } else {
        // Invalid drop, return to source
        if (dragState.source === 'backpack') {
          // If dropped outside, maybe sell? For now, just return to original position.
          // To sell, we could check if it's dropped in the shop area.
          // Let's implement selling: if dropped outside grid (previewX == -1)
          if (dragState.previewX === -1) {
             setBackpack(prev => prev.filter(i => i.instanceId !== dragState.instanceId));
             setGold(g => g + Math.floor(def.price / 2));
          }
        }
      }

      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, backpack, shop, gold]);

  const addDamagePopup = (value: number, target: 'player' | 'enemy', isCrit = false) => {
    const id = Math.random();
    setDamagePopups(prev => [...prev, { id, value, target, isCrit }]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const startBattle = async () => {
    if (backpack.length === 0) return;
    const enemy = { ...ENEMIES[Math.min(level, ENEMIES.length - 1)] };
    setCurrentEnemy(enemy);
    setPlayerHp(stats.maxHp);
    setGameState('battling');
    setBattleLog([`野生的 ${enemy.name} 出现了！`]);
    setDamagePopups([]);
    setAttacking(null);
    setHitTarget(null);
    
    let currentEnemyHp = enemy.hp;
    let currentPlayerHp = stats.maxHp;
    const logs = [`野生的 ${enemy.name} 出现了！`];
    
    const addLog = (msg: string) => {
      logs.push(msg);
      setBattleLog([...logs]);
    };

    await sleep(1000);
    
    while (currentEnemyHp > 0 && currentPlayerHp > 0) {
      // Player attacks
      if (hasMagic) {
        setAttacking('player_magic');
        await sleep(150);
        setSpellActive(true);
        await sleep(250);
        setSpellActive(false);
      } else {
        setAttacking('player');
        await sleep(150);
      }
      
      const pBaseDamage = Math.max(1, stats.attack - enemy.defense);
      let pDamage = Math.floor(pBaseDamage * (0.6 + Math.random() * 0.4));
      let isCrit = false;
      
      if (Math.random() < stats.critChance) {
        isCrit = true;
        pDamage *= 2;
      }
      
      currentEnemyHp -= pDamage;
      setHitTarget('enemy');
      addDamagePopup(pDamage, 'enemy', isCrit);
      addLog(`你对 ${enemy.name} 造成了 ${pDamage} 点伤害！${isCrit ? '(暴击!)' : ''}`);
      setCurrentEnemy(prev => prev ? { ...prev, hp: currentEnemyHp } : null);
      
      await sleep(150);
      setAttacking(null);
      await sleep(200);
      setHitTarget(null);
      
      if (currentEnemyHp <= 0) {
        await sleep(500);
        addLog(`你击败了 ${enemy.name}！`);
        await sleep(1500);
        setGold(g => g + 20 + level * 10);
        setLevel(l => l + 1);
        refreshShop(true);
        setGameState('planning');
        return;
      }
      
      await sleep(400);
      
      // Enemy attacks
      setAttacking('enemy');
      await sleep(150);
      
      const eBaseDamage = Math.max(1, enemy.attack - stats.defense);
      const eDamage = Math.floor(eBaseDamage * (0.6 + Math.random() * 0.4));
      currentPlayerHp -= eDamage;
      setHitTarget('player');
      addDamagePopup(eDamage, 'player');
      addLog(`${enemy.name} 对你造成了 ${eDamage} 点伤害！`);
      setPlayerHp(currentPlayerHp);
      
      await sleep(150);
      setAttacking(null);
      await sleep(200);
      setHitTarget(null);
      
      if (currentPlayerHp <= 0) {
        await sleep(500);
        addLog(`你被 ${enemy.name} 击败了...`);
        await sleep(1500);
        setGameState('gameover');
        return;
      }
      
      await sleep(400);
    }
  };

  const renderItem = (item: ItemInstance, source: 'shop' | 'backpack', isGlobalDrag = false) => {
    const def = ITEM_DEFS[item.itemId];
    const isDragging = dragState?.instanceId === item.instanceId;
    
    let style: React.CSSProperties = {
      width: def.shape[0].length * CELL_SIZE + (def.shape[0].length - 1) * CELL_GAP,
      height: def.shape.length * CELL_SIZE + (def.shape.length - 1) * CELL_GAP,
    };

    if (isDragging && isGlobalDrag) {
      style = {
        ...style,
        position: 'fixed',
        left: dragState.pointerX - dragState.itemOffsetX,
        top: dragState.pointerY - dragState.itemOffsetY,
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0.9,
      };
    } else if (source === 'backpack') {
      style = {
        ...style,
        position: 'absolute',
        left: item.x! * STEP,
        top: item.y! * STEP,
        opacity: isDragging ? 0.3 : 1,
      };
    } else {
      style = {
        ...style,
        position: 'relative',
        opacity: isDragging ? 0.3 : 1,
      };
    }

    const draggingClasses = isDragging && isGlobalDrag ? 'scale-105 shadow-2xl' : '';
    const pointerClasses = isDragging && !isGlobalDrag ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing';

    return (
      <div
        key={isGlobalDrag ? `global-${item.instanceId}` : item.instanceId}
        onPointerDown={(e) => !isDragging && handlePointerDown(e, item, source)}
        className={`flex items-center justify-center rounded-md border-2 shadow-sm ${def.color} ${pointerClasses} ${draggingClasses}`}
        style={style}
      >
        <span className="text-2xl drop-shadow-sm">{def.icon}</span>
        {def.level > 1 && (
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-600 shadow-sm">
            Lv.{def.level}
          </div>
        )}
        {source === 'shop' && (!isDragging || !isGlobalDrag) && (
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full border border-yellow-500 shadow-sm">
            {def.price}g
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans selection:bg-stone-200 flex flex-col items-center py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
        
        {/* Header Stats */}
        <div className="bg-stone-800 text-stone-100 p-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg tracking-tight">收纳骑士</h1>
            <p className="text-stone-400 text-xs">第 {level + 1} 关</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1 bg-stone-700 px-2 py-1 rounded-lg">
              <Coins size={16} className="text-yellow-400" />
              <span className="font-mono font-bold text-yellow-400">{gold}</span>
            </div>
          </div>
        </div>

        {/* Player Stats Bar */}
        <div className="grid grid-cols-4 divide-x divide-stone-200 border-b border-stone-200 bg-stone-50">
          <div className="p-2 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-red-500">
              <Heart size={16} /> <span className="font-bold">{gameState === 'battling' ? playerHp : stats.maxHp}</span>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">生命</span>
          </div>
          <div className="p-2 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-blue-600">
              <Sword size={16} /> <span className="font-bold">{stats.attack}</span>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">攻击</span>
          </div>
          <div className="p-2 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-600">
              <Shield size={16} /> <span className="font-bold">{stats.defense}</span>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">防御</span>
          </div>
          <div className="p-2 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-teal-600">
              <span className="font-bold">{Math.round(stats.critChance * 100)}%</span>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">暴击</span>
          </div>
        </div>

        {gameState === 'planning' && (
          <div className="p-6 flex flex-col items-center bg-stone-100">
            {/* Backpack Grid */}
            <div className="mb-4 relative">
              <div 
                ref={gridRef}
                className="bg-stone-300 rounded-xl p-1 shadow-inner relative"
                style={{
                  width: GRID_COLS * STEP + CELL_GAP,
                  height: GRID_ROWS * STEP + CELL_GAP,
                }}
              >
                {/* Grid Cells Background */}
                {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                  const x = i % GRID_COLS;
                  const y = Math.floor(i / GRID_COLS);
                  return (
                    <div
                      key={i}
                      className="absolute bg-stone-200 rounded-md"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        left: x * STEP + CELL_GAP,
                        top: y * STEP + CELL_GAP,
                      }}
                    />
                  );
                })}

                {/* Synergy Hotspots */}
                {synergyHotspots.map(h => (
                  <div
                    key={`hotspot-${h.x}-${h.y}`}
                    className="absolute bg-yellow-400/30 border-2 border-yellow-400 border-dashed rounded-md animate-pulse pointer-events-none"
                    style={{
                      left: h.x * STEP + CELL_GAP,
                      top: h.y * STEP + CELL_GAP,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      zIndex: 15
                    }}
                  />
                ))}

                {/* Placed Items */}
                <div className="absolute top-1 left-1">
                  {backpack.map(item => renderItem(item, 'backpack'))}
                </div>

                {/* Drag Preview */}
                {dragState && dragState.previewX !== null && dragState.previewX >= 0 && (
                  <div
                    className={`absolute rounded-md border-2 transition-colors flex items-center justify-center ${dragState.isValid ? (dragState.mergeTargetId ? 'bg-blue-400/60 border-blue-500' : 'bg-green-400/40 border-green-500') : 'bg-red-400/40 border-red-500'}`}
                    style={{
                      width: ITEM_DEFS[(dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId)!.itemId].shape[0].length * CELL_SIZE + (ITEM_DEFS[(dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId)!.itemId].shape[0].length - 1) * CELL_GAP,
                      height: ITEM_DEFS[(dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId)!.itemId].shape.length * CELL_SIZE + (ITEM_DEFS[(dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId)!.itemId].shape.length - 1) * CELL_GAP,
                      left: dragState.previewX * STEP + CELL_GAP - 4, // -4 to align with grid container padding
                      top: dragState.previewY * STEP + CELL_GAP - 4,
                      zIndex: 40,
                      pointerEvents: 'none',
                    }}
                  >
                    {dragState.isValid && dragState.mergeTargetId && (
                      <span className="text-white font-bold text-xl drop-shadow-md animate-pulse">⭐ 升级</span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-stone-400 mt-2">拖出背包出售(半价)</p>
            </div>

            {/* Active Synergies */}
            {activeSynergies.length > 0 && (
              <div className="w-full mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">激活的羁绊</h3>
                <ul className="text-sm text-emerald-700 space-y-1">
                  {activeSynergies.map((syn, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {syn}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shop */}
            <div className="w-full bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-stone-700">商店</h3>
                <button 
                  onClick={() => refreshShop(false)}
                  className="flex items-center gap-1 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-1 rounded-md transition-colors"
                >
                  <RefreshCw size={12} /> 刷新 (5g)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 min-h-[340px] content-start">
                {shop.map(item => {
                  const def = ITEM_DEFS[item.itemId];
                  const isDragging = dragState?.instanceId === item.instanceId;
                  return (
                    <div key={item.instanceId} className={`relative flex flex-col items-center p-2 border border-stone-200 rounded-lg bg-stone-50 transition-opacity ${isDragging ? 'opacity-50' : ''}`}>
                      {checkSynergyPotential(def, backpack) && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-500 shadow-sm animate-bounce z-10">
                          ✨ 羁绊
                        </div>
                      )}
                      <div className="font-bold text-xs mb-1 text-stone-700">{def.name}</div>
                      <div className="flex-1 flex items-center justify-center min-h-[100px] w-full">
                        {renderItem(item, 'shop')}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-1 text-center space-y-0.5 leading-tight">
                        {def.stats.attack ? <div>+{def.stats.attack} 攻击</div> : null}
                        {def.stats.defense ? <div>+{def.stats.defense} 防御</div> : null}
                        {def.stats.maxHp ? <div>+{def.stats.maxHp} 生命</div> : null}
                        {def.stats.critChance ? <div>+{Math.round(def.stats.critChance * 100)}% 暴击</div> : null}
                        {def.synergies.map((s, i) => <div key={i} className="text-emerald-600 font-medium">{s.description}</div>)}
                      </div>
                    </div>
                  );
                })}
                {shop.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center text-stone-400 text-sm h-full min-h-[300px]">
                    售罄！请刷新。
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={startBattle}
              disabled={backpack.length === 0}
              className="mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 bg-stone-800 text-white hover:bg-stone-700"
            >
              <Play size={20} /> 开始战斗
            </button>
          </div>
        )}

        {gameState === 'battling' && currentEnemy && (
          <div className="p-6 flex flex-col items-center bg-stone-900 text-stone-100 min-h-[450px]">
            
            {/* Battle Arena */}
            <div className="relative w-full h-64 bg-stone-800 rounded-2xl mb-6 overflow-hidden border-4 border-stone-700 shadow-2xl flex items-center justify-between px-8">
              {/* Background decoration */}
              <motion.img 
                src={BATTLE_BGS[Math.min(level, BATTLE_BGS.length - 1)]} 
                className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-50 mix-blend-luminosity" 
                alt="background" 
                referrerPolicy="no-referrer"
                animate={{
                  x: ['-10%', '0%', '-10%'],
                  y: ['-10%', '0%', '-10%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-900/90" />
              
              {/* Floor line */}
              <div className="absolute bottom-12 left-0 right-0 h-16 bg-stone-900/60 blur-xl" />

              {/* Spell Projectile */}
              <AnimatePresence>
                {spellActive && (
                  <motion.div
                    initial={{ x: -100, y: 0, scale: 0.5, opacity: 0 }}
                    animate={{ x: 120, y: 0, scale: 1.5, opacity: 1 }}
                    exit={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.25, ease: "easeIn" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-5xl drop-shadow-[0_0_20px_rgba(167,139,250,1)]"
                  >
                    ✨
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Player */}
              <div className="relative z-10 flex flex-col items-center mt-4">
                <motion.div
                  animate={
                    attacking === 'player'
                      ? { x: [0, 80, 0], scale: [1, 1.2, 1], rotate: [0, 15, 0] }
                      : attacking === 'player_magic'
                        ? { y: [0, -20, 0], scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }
                      : hitTarget === 'player'
                        ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)', 'brightness(1)'] }
                        : { y: [0, -8, 0] }
                  }
                  transition={
                    attacking === 'player' ? { duration: 0.3 }
                    : attacking === 'player_magic' ? { duration: 0.4 }
                    : hitTarget === 'player' ? { duration: 0.3 }
                    : { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }
                  className="w-24 h-24 flex items-center justify-center text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                >
                  {hasMagic ? '🧙‍♂️' : '🤺'}
                </motion.div>
                <div className="w-16 h-3 bg-black/40 rounded-full blur-sm mt-2" />
                
                {/* HP Bar */}
                <div className="mt-2 flex flex-col items-center">
                  <span className="font-bold text-sm drop-shadow-md">你</span>
                  <div className="w-20 h-2.5 bg-stone-900 rounded-full mt-1 overflow-hidden border border-stone-600 relative">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-emerald-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.max(0, (playerHp / stats.maxHp) * 100)}%` }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] mt-0.5 text-stone-400">{Math.max(0, playerHp)} / {stats.maxHp}</span>
                </div>

                {/* Damage Popups */}
                <AnimatePresence>
                  {damagePopups.filter(d => d.target === 'player').map(d => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, y: -60, scale: 1.2 }}
                      exit={{ opacity: 0, y: -80 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute top-0 text-red-500 font-black text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none z-50"
                    >
                      -{d.value}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="text-3xl font-black text-stone-500 italic z-10 drop-shadow-lg opacity-50">VS</div>
              
              {/* Enemy */}
              <div className="relative z-10 flex flex-col items-center mt-4">
                <motion.div
                  animate={
                    attacking === 'enemy'
                      ? { x: [0, -80, 0], scale: [1, 1.2, 1], rotate: [0, -15, 0] }
                      : hitTarget === 'enemy'
                        ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)', 'brightness(1)'] }
                        : { y: [0, -8, 0] }
                  }
                  transition={
                    attacking === 'enemy' ? { duration: 0.3 }
                    : hitTarget === 'enemy' ? { duration: 0.3 }
                    : { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }
                  }
                  className={`w-24 h-24 flex items-center justify-center ${currentEnemy.size} drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]`}
                >
                  {currentEnemy.icon}
                </motion.div>
                <div className="w-16 h-3 bg-black/40 rounded-full blur-sm mt-2" />

                {/* HP Bar */}
                <div className="mt-2 flex flex-col items-center">
                  <span className="font-bold text-sm text-red-400 drop-shadow-md">{currentEnemy.name}</span>
                  <div className="w-20 h-2.5 bg-stone-900 rounded-full mt-1 overflow-hidden border border-stone-600 relative">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-red-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.max(0, (currentEnemy.hp / currentEnemy.maxHp) * 100)}%` }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] mt-0.5 text-stone-400">{Math.max(0, currentEnemy.hp)} / {currentEnemy.maxHp}</span>
                </div>

                {/* Damage Popups */}
                <AnimatePresence>
                  {damagePopups.filter(d => d.target === 'enemy').map(d => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, y: -60, scale: 1.2 }}
                      exit={{ opacity: 0, y: -80 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`absolute top-0 font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none z-50 ${d.isCrit ? 'text-yellow-400 text-5xl' : 'text-white text-3xl'}`}
                    >
                      {d.isCrit && <span className="text-sm block text-center -mb-2 text-yellow-300">暴击!</span>}
                      -{d.value}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full flex-1 bg-stone-800 rounded-xl p-4 overflow-y-auto font-mono text-sm space-y-2 border border-stone-700 shadow-inner">
              {battleLog.map((log, i) => (
                <div key={i} className={`animate-in fade-in slide-in-from-bottom-2 ${log.includes('击败了') ? 'text-yellow-400 font-bold' : log.includes('对你造成了') ? 'text-red-400' : 'text-stone-300'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="p-8 flex flex-col items-center justify-center bg-stone-900 text-stone-100 min-h-[400px]">
            <Skull size={64} className="text-red-500 mb-4" />
            <h2 className="text-3xl font-bold mb-2">游戏结束</h2>
            <p className="text-stone-400 mb-8">你到达了第 {level + 1} 关</p>
            <button
              onClick={() => {
                setBackpack([]);
                setGold(50);
                setLevel(0);
                refreshShop(true);
                setGameState('planning');
              }}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors"
            >
              再来一局
            </button>
          </div>
        )}

      </div>
      
      {/* Render dragged item globally to avoid clipping */}
      {dragState && renderItem((dragState.source === 'shop' ? shop : backpack).find(i => i.instanceId === dragState.instanceId)!, dragState.source, true)}
    </div>
  );
}

