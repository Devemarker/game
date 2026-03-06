export type Shape = number[][];

export interface Synergy {
  targetTag: string;
  direction: 'adjacent'; // Keep it simple for MVP
  bonus: {
    attack?: number;
    defense?: number;
    maxHp?: number;
    critChance?: number;
  };
  description: string;
}

export interface ItemDef {
  id: string;
  name: string;
  level: number;
  nextLevelId?: string;
  shape: Shape;
  tags: string[];
  stats: {
    attack?: number;
    defense?: number;
    maxHp?: number;
    critChance?: number;
  };
  synergies: Synergy[];
  color: string;
  icon: string;
  price: number;
}

export const ITEM_DEFS: Record<string, ItemDef> = {
  // --- Swords ---
  sword_1: {
    id: 'sword_1',
    name: '铁剑',
    level: 1,
    nextLevelId: 'sword_2',
    shape: [[1], [1]],
    tags: ['weapon', 'sword'],
    stats: { attack: 10 },
    synergies: [
      { targetTag: 'stone', direction: 'adjacent', bonus: { attack: 5 }, description: '相邻石头: +5 攻击力' }
    ],
    color: 'bg-blue-200 border-blue-400 text-blue-800',
    icon: '🗡️',
    price: 10
  },
  sword_2: {
    id: 'sword_2',
    name: '钢剑',
    level: 2,
    nextLevelId: 'sword_3',
    shape: [[1], [1]],
    tags: ['weapon', 'sword'],
    stats: { attack: 25 },
    synergies: [
      { targetTag: 'stone', direction: 'adjacent', bonus: { attack: 10 }, description: '相邻石头: +10 攻击力' }
    ],
    color: 'bg-blue-300 border-blue-500 text-blue-900',
    icon: '🗡️',
    price: 20
  },
  sword_3: {
    id: 'sword_3',
    name: '圣剑',
    level: 3,
    shape: [[1], [1]],
    tags: ['weapon', 'sword'],
    stats: { attack: 60 },
    synergies: [
      { targetTag: 'stone', direction: 'adjacent', bonus: { attack: 25 }, description: '相邻石头: +25 攻击力' }
    ],
    color: 'bg-blue-400 border-blue-600 text-white',
    icon: '🗡️',
    price: 40
  },

  // --- Stones ---
  stone_1: {
    id: 'stone_1',
    name: '磨刀石',
    level: 1,
    nextLevelId: 'stone_2',
    shape: [[1]],
    tags: ['stone'],
    stats: {},
    synergies: [],
    color: 'bg-stone-200 border-stone-400 text-stone-800',
    icon: '🪨',
    price: 5
  },
  stone_2: {
    id: 'stone_2',
    name: '精良磨刀石',
    level: 2,
    nextLevelId: 'stone_3',
    shape: [[1]],
    tags: ['stone'],
    stats: {},
    synergies: [],
    color: 'bg-stone-300 border-stone-500 text-stone-900',
    icon: '🪨',
    price: 10
  },
  stone_3: {
    id: 'stone_3',
    name: '完美磨刀石',
    level: 3,
    shape: [[1]],
    tags: ['stone'],
    stats: {},
    synergies: [],
    color: 'bg-stone-400 border-stone-600 text-white',
    icon: '🪨',
    price: 20
  },

  // --- Shields ---
  shield_1: {
    id: 'shield_1',
    name: '木盾',
    level: 1,
    nextLevelId: 'shield_2',
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield'],
    stats: { defense: 5 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { defense: 3 }, description: '相邻武器: +3 防御力' }
    ],
    color: 'bg-amber-200 border-amber-400 text-amber-800',
    icon: '🛡️',
    price: 15
  },
  shield_2: {
    id: 'shield_2',
    name: '铁盾',
    level: 2,
    nextLevelId: 'shield_3',
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield'],
    stats: { defense: 12 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { defense: 8 }, description: '相邻武器: +8 防御力' }
    ],
    color: 'bg-amber-300 border-amber-500 text-amber-900',
    icon: '🛡️',
    price: 30
  },
  shield_3: {
    id: 'shield_3',
    name: '金盾',
    level: 3,
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield'],
    stats: { defense: 30 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { defense: 20 }, description: '相邻武器: +20 防御力' }
    ],
    color: 'bg-amber-400 border-amber-600 text-white',
    icon: '🛡️',
    price: 60
  },

  // --- Potions ---
  potion_1: {
    id: 'potion_1',
    name: '生命药水',
    level: 1,
    nextLevelId: 'potion_2',
    shape: [[1]],
    tags: ['consumable', 'potion'],
    stats: { maxHp: 20 },
    synergies: [],
    color: 'bg-red-200 border-red-400 text-red-800',
    icon: '🧪',
    price: 8
  },
  potion_2: {
    id: 'potion_2',
    name: '大生命药水',
    level: 2,
    nextLevelId: 'potion_3',
    shape: [[1]],
    tags: ['consumable', 'potion'],
    stats: { maxHp: 50 },
    synergies: [],
    color: 'bg-red-300 border-red-500 text-red-900',
    icon: '🧪',
    price: 16
  },
  potion_3: {
    id: 'potion_3',
    name: '特效生命药水',
    level: 3,
    shape: [[1]],
    tags: ['consumable', 'potion'],
    stats: { maxHp: 120 },
    synergies: [],
    color: 'bg-red-400 border-red-600 text-white',
    icon: '🧪',
    price: 32
  },

  // --- Spears ---
  spear_1: {
    id: 'spear_1',
    name: '长枪',
    level: 1,
    nextLevelId: 'spear_2',
    shape: [[1], [1], [1]],
    tags: ['weapon', 'spear'],
    stats: { attack: 15 },
    synergies: [],
    color: 'bg-zinc-200 border-zinc-400 text-zinc-800',
    icon: '🔱',
    price: 18
  },
  spear_2: {
    id: 'spear_2',
    name: '精钢长枪',
    level: 2,
    nextLevelId: 'spear_3',
    shape: [[1], [1], [1]],
    tags: ['weapon', 'spear'],
    stats: { attack: 35 },
    synergies: [],
    color: 'bg-zinc-300 border-zinc-500 text-zinc-900',
    icon: '🔱',
    price: 36
  },
  spear_3: {
    id: 'spear_3',
    name: '龙骑士长枪',
    level: 3,
    shape: [[1], [1], [1]],
    tags: ['weapon', 'spear'],
    stats: { attack: 80 },
    synergies: [],
    color: 'bg-zinc-400 border-zinc-600 text-white',
    icon: '🔱',
    price: 72
  },

  // --- Magic Wands ---
  wand_1: {
    id: 'wand_1',
    name: '学徒法杖',
    level: 1,
    nextLevelId: 'wand_2',
    shape: [[1], [1]],
    tags: ['weapon', 'magic'],
    stats: { attack: 12 },
    synergies: [
      { targetTag: 'potion', direction: 'adjacent', bonus: { attack: 8 }, description: '相邻药水: +8 攻击力' }
    ],
    color: 'bg-indigo-200 border-indigo-400 text-indigo-800',
    icon: '🪄',
    price: 14
  },
  wand_2: {
    id: 'wand_2',
    name: '奥术法杖',
    level: 2,
    nextLevelId: 'wand_3',
    shape: [[1], [1]],
    tags: ['weapon', 'magic'],
    stats: { attack: 28 },
    synergies: [
      { targetTag: 'potion', direction: 'adjacent', bonus: { attack: 18 }, description: '相邻药水: +18 攻击力' }
    ],
    color: 'bg-indigo-300 border-indigo-500 text-indigo-900',
    icon: '🪄',
    price: 28
  },
  wand_3: {
    id: 'wand_3',
    name: '大贤者之杖',
    level: 3,
    shape: [[1], [1]],
    tags: ['weapon', 'magic'],
    stats: { attack: 65 },
    synergies: [
      { targetTag: 'potion', direction: 'adjacent', bonus: { attack: 40 }, description: '相邻药水: +40 攻击力' }
    ],
    color: 'bg-indigo-400 border-indigo-600 text-white',
    icon: '🪄',
    price: 56
  },

  // --- Poisons ---
  poison_1: {
    id: 'poison_1',
    name: '毒药瓶',
    level: 1,
    nextLevelId: 'poison_2',
    shape: [[1]],
    tags: ['poison'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { attack: 8 }, description: '相邻武器: +8 攻击力' }
    ],
    color: 'bg-purple-200 border-purple-400 text-purple-800',
    icon: '🏺',
    price: 12
  },
  poison_2: {
    id: 'poison_2',
    name: '猛毒药瓶',
    level: 2,
    nextLevelId: 'poison_3',
    shape: [[1]],
    tags: ['poison'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { attack: 20 }, description: '相邻武器: +20 攻击力' }
    ],
    color: 'bg-purple-300 border-purple-500 text-purple-900',
    icon: '🏺',
    price: 24
  },
  poison_3: {
    id: 'poison_3',
    name: '致命毒药瓶',
    level: 3,
    shape: [[1]],
    tags: ['poison'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { attack: 50 }, description: '相邻武器: +50 攻击力' }
    ],
    color: 'bg-purple-400 border-purple-600 text-white',
    icon: '🏺',
    price: 48
  },

  // --- Helmets ---
  helmet_1: {
    id: 'helmet_1',
    name: '铁头盔',
    level: 1,
    nextLevelId: 'helmet_2',
    shape: [[1, 1]],
    tags: ['armor', 'helmet'],
    stats: { defense: 4, maxHp: 10 },
    synergies: [],
    color: 'bg-slate-200 border-slate-400 text-slate-800',
    icon: '🪖',
    price: 14
  },
  helmet_2: {
    id: 'helmet_2',
    name: '骑士头盔',
    level: 2,
    nextLevelId: 'helmet_3',
    shape: [[1, 1]],
    tags: ['armor', 'helmet'],
    stats: { defense: 10, maxHp: 25 },
    synergies: [],
    color: 'bg-slate-300 border-slate-500 text-slate-900',
    icon: '🪖',
    price: 28
  },
  helmet_3: {
    id: 'helmet_3',
    name: '皇家头盔',
    level: 3,
    shape: [[1, 1]],
    tags: ['armor', 'helmet'],
    stats: { defense: 25, maxHp: 60 },
    synergies: [],
    color: 'bg-slate-400 border-slate-600 text-white',
    icon: '🪖',
    price: 56
  },

  // --- Gloves (Crit) ---
  glove_1: {
    id: 'glove_1',
    name: '盗贼手套',
    level: 1,
    nextLevelId: 'glove_2',
    shape: [[1, 1]],
    tags: ['accessory', 'glove'],
    stats: { critChance: 0.1 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { critChance: 0.05 }, description: '相邻武器: +5% 暴击率' }
    ],
    color: 'bg-teal-200 border-teal-400 text-teal-800',
    icon: '🧤',
    price: 15
  },
  glove_2: {
    id: 'glove_2',
    name: '刺客手套',
    level: 2,
    nextLevelId: 'glove_3',
    shape: [[1, 1]],
    tags: ['accessory', 'glove'],
    stats: { critChance: 0.2 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { critChance: 0.1 }, description: '相邻武器: +10% 暴击率' }
    ],
    color: 'bg-teal-300 border-teal-500 text-teal-900',
    icon: '🧤',
    price: 30
  },
  glove_3: {
    id: 'glove_3',
    name: '暗影护手',
    level: 3,
    shape: [[1, 1]],
    tags: ['accessory', 'glove'],
    stats: { critChance: 0.3 },
    synergies: [
      { targetTag: 'weapon', direction: 'adjacent', bonus: { critChance: 0.15 }, description: '相邻武器: +15% 暴击率' }
    ],
    color: 'bg-teal-400 border-teal-600 text-white',
    icon: '🧤',
    price: 60
  }
};
