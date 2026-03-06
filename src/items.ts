export type Shape = number[][];

export interface Synergy {
  targetTag: string;
  direction: 'adjacent' | 'global' | 'diagonal';
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

  // --- Fire Items ---
  fire_wand_1: {
    id: 'fire_wand_1',
    name: '烈焰法杖',
    level: 1,
    nextLevelId: 'fire_wand_2',
    shape: [[1], [1]],
    tags: ['weapon', 'magic', 'fire'],
    stats: { attack: 15 },
    synergies: [
      { targetTag: 'fire', direction: 'global', bonus: { attack: 10 }, description: '全局火焰: +10 攻击力' }
    ],
    color: 'bg-orange-200 border-orange-400 text-orange-800',
    icon: '🔥',
    price: 20
  },
  fire_wand_2: {
    id: 'fire_wand_2',
    name: '爆裂法杖',
    level: 2,
    nextLevelId: 'fire_wand_3',
    shape: [[1], [1]],
    tags: ['weapon', 'magic', 'fire'],
    stats: { attack: 35 },
    synergies: [
      { targetTag: 'fire', direction: 'global', bonus: { attack: 25 }, description: '全局火焰: +25 攻击力' }
    ],
    color: 'bg-orange-300 border-orange-500 text-orange-900',
    icon: '🔥',
    price: 40
  },
  fire_wand_3: {
    id: 'fire_wand_3',
    name: '陨石法杖',
    level: 3,
    shape: [[1], [1]],
    tags: ['weapon', 'magic', 'fire'],
    stats: { attack: 80 },
    synergies: [
      { targetTag: 'fire', direction: 'global', bonus: { attack: 60 }, description: '全局火焰: +60 攻击力' }
    ],
    color: 'bg-orange-400 border-orange-600 text-white',
    icon: '🔥',
    price: 80
  },

  // --- Ice Items ---
  ice_shield_1: {
    id: 'ice_shield_1',
    name: '冰霜之盾',
    level: 1,
    nextLevelId: 'ice_shield_2',
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield', 'ice'],
    stats: { defense: 8 },
    synergies: [
      { targetTag: 'ice', direction: 'adjacent', bonus: { defense: 5, maxHp: 20 }, description: '相邻冰霜: +5 防御, +20 生命' }
    ],
    color: 'bg-cyan-200 border-cyan-400 text-cyan-800',
    icon: '❄️',
    price: 20
  },
  ice_shield_2: {
    id: 'ice_shield_2',
    name: '极寒之盾',
    level: 2,
    nextLevelId: 'ice_shield_3',
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield', 'ice'],
    stats: { defense: 18 },
    synergies: [
      { targetTag: 'ice', direction: 'adjacent', bonus: { defense: 12, maxHp: 50 }, description: '相邻冰霜: +12 防御, +50 生命' }
    ],
    color: 'bg-cyan-300 border-cyan-500 text-cyan-900',
    icon: '❄️',
    price: 40
  },
  ice_shield_3: {
    id: 'ice_shield_3',
    name: '绝对零度',
    level: 3,
    shape: [[1, 1], [1, 1]],
    tags: ['armor', 'shield', 'ice'],
    stats: { defense: 40 },
    synergies: [
      { targetTag: 'ice', direction: 'adjacent', bonus: { defense: 30, maxHp: 120 }, description: '相邻冰霜: +30 防御, +120 生命' }
    ],
    color: 'bg-cyan-400 border-cyan-600 text-white',
    icon: '❄️',
    price: 80
  },

  // --- Food Items ---
  meat_1: {
    id: 'meat_1',
    name: '烤肉',
    level: 1,
    nextLevelId: 'meat_2',
    shape: [[1, 1]],
    tags: ['consumable', 'food'],
    stats: { maxHp: 30 },
    synergies: [
      { targetTag: 'food', direction: 'adjacent', bonus: { maxHp: 20 }, description: '相邻食物: +20 生命' }
    ],
    color: 'bg-rose-200 border-rose-400 text-rose-800',
    icon: '🍖',
    price: 10
  },
  meat_2: {
    id: 'meat_2',
    name: '大块烤肉',
    level: 2,
    nextLevelId: 'meat_3',
    shape: [[1, 1]],
    tags: ['consumable', 'food'],
    stats: { maxHp: 70 },
    synergies: [
      { targetTag: 'food', direction: 'adjacent', bonus: { maxHp: 50 }, description: '相邻食物: +50 生命' }
    ],
    color: 'bg-rose-300 border-rose-500 text-rose-900',
    icon: '🍖',
    price: 20
  },
  meat_3: {
    id: 'meat_3',
    name: '龙肉排',
    level: 3,
    shape: [[1, 1]],
    tags: ['consumable', 'food'],
    stats: { maxHp: 160 },
    synergies: [
      { targetTag: 'food', direction: 'adjacent', bonus: { maxHp: 120 }, description: '相邻食物: +120 生命' }
    ],
    color: 'bg-rose-400 border-rose-600 text-white',
    icon: '🍖',
    price: 40
  },

  // --- Dark Items ---
  cursed_blade_1: {
    id: 'cursed_blade_1',
    name: '诅咒之刃',
    level: 1,
    nextLevelId: 'cursed_blade_2',
    shape: [[1], [1], [1]],
    tags: ['weapon', 'sword', 'dark'],
    stats: { attack: 40 },
    synergies: [
      { targetTag: 'holy', direction: 'global', bonus: { attack: -20 }, description: '全局神圣: -20 攻击力' }
    ],
    color: 'bg-fuchsia-200 border-fuchsia-400 text-fuchsia-800',
    icon: '🗡️',
    price: 25
  },
  cursed_blade_2: {
    id: 'cursed_blade_2',
    name: '魔剑',
    level: 2,
    nextLevelId: 'cursed_blade_3',
    shape: [[1], [1], [1]],
    tags: ['weapon', 'sword', 'dark'],
    stats: { attack: 90 },
    synergies: [
      { targetTag: 'holy', direction: 'global', bonus: { attack: -45 }, description: '全局神圣: -45 攻击力' }
    ],
    color: 'bg-fuchsia-300 border-fuchsia-500 text-fuchsia-900',
    icon: '🗡️',
    price: 50
  },
  cursed_blade_3: {
    id: 'cursed_blade_3',
    name: '灾厄之刃',
    level: 3,
    shape: [[1], [1], [1]],
    tags: ['weapon', 'sword', 'dark'],
    stats: { attack: 200 },
    synergies: [
      { targetTag: 'holy', direction: 'global', bonus: { attack: -100 }, description: '全局神圣: -100 攻击力' }
    ],
    color: 'bg-fuchsia-400 border-fuchsia-600 text-white',
    icon: '🗡️',
    price: 100
  },

  // --- Holy Items ---
  holy_cross_1: {
    id: 'holy_cross_1',
    name: '神圣十字架',
    level: 1,
    nextLevelId: 'holy_cross_2',
    shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    tags: ['accessory', 'holy'],
    stats: { maxHp: 50 },
    synergies: [
      { targetTag: 'dark', direction: 'global', bonus: { defense: 10 }, description: '全局黑暗: +10 防御力' }
    ],
    color: 'bg-yellow-200 border-yellow-400 text-yellow-800',
    icon: '✝️',
    price: 30
  },
  holy_cross_2: {
    id: 'holy_cross_2',
    name: '白银十字架',
    level: 2,
    nextLevelId: 'holy_cross_3',
    shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    tags: ['accessory', 'holy'],
    stats: { maxHp: 120 },
    synergies: [
      { targetTag: 'dark', direction: 'global', bonus: { defense: 25 }, description: '全局黑暗: +25 防御力' }
    ],
    color: 'bg-yellow-300 border-yellow-500 text-yellow-900',
    icon: '✝️',
    price: 60
  },
  holy_cross_3: {
    id: 'holy_cross_3',
    name: '救赎十字架',
    level: 3,
    shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    tags: ['accessory', 'holy'],
    stats: { maxHp: 300 },
    synergies: [
      { targetTag: 'dark', direction: 'global', bonus: { defense: 60 }, description: '全局黑暗: +60 防御力' }
    ],
    color: 'bg-yellow-400 border-yellow-600 text-white',
    icon: '✝️',
    price: 120
  },

  // --- Crowns (Diagonal Synergy) ---
  crown_1: {
    id: 'crown_1',
    name: '王者之冠',
    level: 1,
    nextLevelId: 'crown_2',
    shape: [[1, 1]],
    tags: ['accessory'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'diagonal', bonus: { critChance: 0.1 }, description: '对角武器: +10% 暴击' },
      { targetTag: 'armor', direction: 'diagonal', bonus: { maxHp: 50 }, description: '对角防具: +50 生命' }
    ],
    color: 'bg-amber-200 border-amber-400 text-amber-800',
    icon: '👑',
    price: 35
  },
  crown_2: {
    id: 'crown_2',
    name: '霸者之冠',
    level: 2,
    nextLevelId: 'crown_3',
    shape: [[1, 1]],
    tags: ['accessory'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'diagonal', bonus: { critChance: 0.2 }, description: '对角武器: +20% 暴击' },
      { targetTag: 'armor', direction: 'diagonal', bonus: { maxHp: 120 }, description: '对角防具: +120 生命' }
    ],
    color: 'bg-amber-300 border-amber-500 text-amber-900',
    icon: '👑',
    price: 70
  },
  crown_3: {
    id: 'crown_3',
    name: '神明之冠',
    level: 3,
    shape: [[1, 1]],
    tags: ['accessory'],
    stats: {},
    synergies: [
      { targetTag: 'weapon', direction: 'diagonal', bonus: { critChance: 0.4 }, description: '对角武器: +40% 暴击' },
      { targetTag: 'armor', direction: 'diagonal', bonus: { maxHp: 300 }, description: '对角防具: +300 生命' }
    ],
    color: 'bg-amber-400 border-amber-600 text-white',
    icon: '👑',
    price: 140
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
