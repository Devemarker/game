import { ITEM_DEFS, ItemDef, Shape } from './items';

export interface ItemInstance {
  instanceId: string;
  itemId: string;
  x?: number;
  y?: number;
}

export interface PlayerStats {
  attack: number;
  defense: number;
  maxHp: number;
  critChance: number;
}

export function getOccupiedCells(item: ItemInstance, def: ItemDef) {
  const cells: {x: number, y: number}[] = [];
  if (item.x === undefined || item.y === undefined) return cells;
  
  for (let r = 0; r < def.shape.length; r++) {
    for (let c = 0; c < def.shape[r].length; c++) {
      if (def.shape[r][c] === 1) {
        cells.push({ x: item.x + c, y: item.y + r });
      }
    }
  }
  return cells;
}

export function checkOverlap(cells1: {x: number, y: number}[], cells2: {x: number, y: number}[]) {
  for (const c1 of cells1) {
    for (const c2 of cells2) {
      if (c1.x === c2.x && c1.y === c2.y) return true;
    }
  }
  return false;
}

export function isAdjacent(cells1: {x: number, y: number}[], cells2: {x: number, y: number}[]) {
  for (const c1 of cells1) {
    for (const c2 of cells2) {
      const dx = Math.abs(c1.x - c2.x);
      const dy = Math.abs(c1.y - c2.y);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        return true;
      }
    }
  }
  return false;
}

export function calculateStats(backpack: ItemInstance[]): { stats: PlayerStats, activeSynergies: string[], hasMagic: boolean } {
  const baseStats: PlayerStats = { attack: 5, defense: 0, maxHp: 100, critChance: 0 };
  const activeSynergies: string[] = [];
  let hasMagic = false;

  // Add base stats
  for (const item of backpack) {
    const def = ITEM_DEFS[item.itemId];
    if (def.stats.attack) baseStats.attack += def.stats.attack;
    if (def.stats.defense) baseStats.defense += def.stats.defense;
    if (def.stats.maxHp) baseStats.maxHp += def.stats.maxHp;
    if (def.stats.critChance) baseStats.critChance += def.stats.critChance;
    if (def.tags.includes('magic')) hasMagic = true;
  }

  // Calculate synergies
  for (let i = 0; i < backpack.length; i++) {
    const item1 = backpack[i];
    const def1 = ITEM_DEFS[item1.itemId];
    const cells1 = getOccupiedCells(item1, def1);

    for (const synergy of def1.synergies) {
      let synergyActive = false;
      for (let j = 0; j < backpack.length; j++) {
        if (i === j) continue;
        const item2 = backpack[j];
        const def2 = ITEM_DEFS[item2.itemId];
        
        if (def2.tags.includes(synergy.targetTag)) {
          const cells2 = getOccupiedCells(item2, def2);
          if (synergy.direction === 'adjacent' && isAdjacent(cells1, cells2)) {
            synergyActive = true;
            break;
          }
        }
      }

      if (synergyActive) {
        if (synergy.bonus.attack) baseStats.attack += synergy.bonus.attack;
        if (synergy.bonus.defense) baseStats.defense += synergy.bonus.defense;
        if (synergy.bonus.maxHp) baseStats.maxHp += synergy.bonus.maxHp;
        if (synergy.bonus.critChance) baseStats.critChance += synergy.bonus.critChance;
        activeSynergies.push(`${def1.name}: ${synergy.description}`);
      }
    }
  }

  return { stats: baseStats, activeSynergies, hasMagic };
}
