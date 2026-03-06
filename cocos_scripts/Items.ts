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
    colorHex: string; // Changed from Tailwind classes to Hex for Cocos
    icon: string;     // Can be mapped to SpriteFrame names in Cocos
    price: number;
}

export const ITEM_DEFS: Record<string, ItemDef> = {
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
        colorHex: '#BFDBFE', // blue-200
        icon: 'sword_icon',
        price: 10
    },
    // ... 其他物品定义与 React 版本一致，只需将 color (Tailwind) 替换为 colorHex
    stone_1: {
        id: 'stone_1',
        name: '磨刀石',
        level: 1,
        nextLevelId: 'stone_2',
        shape: [[1]],
        tags: ['stone'],
        stats: {},
        synergies: [],
        colorHex: '#E7E5E4', // stone-200
        icon: 'stone_icon',
        price: 5
    },
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
        colorHex: '#FED7AA', // orange-200
        icon: 'fire_wand_icon',
        price: 20
    },
    // 示例省略了部分物品，实际迁移时可直接拷贝完整的 ITEM_DEFS 并替换 color 字段
};
