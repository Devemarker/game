import { _decorator, Component, Node, Prefab, instantiate, Label, Sprite, UITransform, EventTouch, Vec3 } from 'cc';
import { ITEM_DEFS, ItemDef } from './Items';
import { Engine, ItemInstance, PlayerStats } from './Engine';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    gridContainer: Node = null;

    @property(Node)
    shopContainer: Node = null;

    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Label)
    goldLabel: Label = null;

    @property(Label)
    hpLabel: Label = null;

    @property(Label)
    attackLabel: Label = null;

    @property(Label)
    defenseLabel: Label = null;

    // Game State
    private backpack: ItemInstance[] = [];
    private shop: ItemInstance[] = [];
    private gold: number = 50;
    private level: number = 0;
    
    private gridCols: number = 5;
    private gridRows: number = 5;
    private cellSize: number = 50; // 对应 React 中的 CELL_SIZE

    start() {
        this.refreshShop(true);
        this.updateUI();
    }

    public refreshShop(isFree: boolean = false) {
        if (!isFree && this.gold < 5 && this.shop.length > 0) return;
        if (!isFree && this.shop.length > 0) {
            this.gold = Math.max(0, this.gold - 5);
        }

        const itemKeys = Object.keys(ITEM_DEFS).filter(k => ITEM_DEFS[k].level === 1);
        this.shop = [];
        
        for (let i = 0; i < 4; i++) {
            const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            this.shop.push({
                instanceId: Math.random().toString(36).substring(7),
                itemId: randomKey,
            });
        }
        
        this.renderShop();
        this.updateUI();
    }

    public handleUpgradeGrid() {
        const upgradeCost = (this.gridCols + this.gridRows - 9) * 20;
        if (this.gold >= upgradeCost) {
            this.gold -= upgradeCost;
            if (this.gridCols === this.gridRows) {
                this.gridCols++;
            } else {
                this.gridRows++;
            }
            this.updateGridVisuals();
            this.updateUI();
        }
    }

    // --- Core Logic Methods ---

    public tryPlaceItem(item: ItemInstance, gridX: number, gridY: number): boolean {
        const def = ITEM_DEFS[item.itemId];
        const testItem = { ...item, x: gridX, y: gridY };
        const cells = Engine.getOccupiedCells(testItem, def);

        // Check bounds
        const outOfBounds = cells.some(c => c.x < 0 || c.x >= this.gridCols || c.y < 0 || c.y >= this.gridRows);
        if (outOfBounds) return false;

        // Check overlap
        const otherItems = this.backpack.filter(i => i.instanceId !== item.instanceId);
        let hasOverlap = false;
        for (const other of otherItems) {
            const otherCells = Engine.getOccupiedCells(other, ITEM_DEFS[other.itemId]);
            if (Engine.checkOverlap(cells, otherCells)) {
                hasOverlap = true;
                break;
            }
        }

        if (hasOverlap) return false;

        // Valid placement
        item.x = gridX;
        item.y = gridY;
        
        // Move from shop to backpack if needed
        if (this.shop.find(i => i.instanceId === item.instanceId)) {
            this.shop = this.shop.filter(i => i.instanceId !== item.instanceId);
            this.backpack.push(item);
            this.gold -= def.price;
            this.renderShop();
        }

        this.updateUI();
        return true;
    }

    public sellItem(item: ItemInstance) {
        const def = ITEM_DEFS[item.itemId];
        this.gold += Math.floor(def.price / 2);
        this.backpack = this.backpack.filter(i => i.instanceId !== item.instanceId);
        this.updateUI();
    }

    // --- UI Rendering (Cocos Specific) ---

    private updateUI() {
        if (this.goldLabel) this.goldLabel.string = this.gold.toString();
        
        const { stats } = Engine.calculateStats(this.backpack);
        if (this.hpLabel) this.hpLabel.string = stats.maxHp.toString();
        if (this.attackLabel) this.attackLabel.string = stats.attack.toString();
        if (this.defenseLabel) this.defenseLabel.string = stats.defense.toString();
    }

    private updateGridVisuals() {
        // 在此处更新 Cocos 节点 (gridContainer) 的尺寸和背景格子
        const uiTransform = this.gridContainer.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.setContentSize(this.gridCols * this.cellSize, this.gridRows * this.cellSize);
        }
    }

    private renderShop() {
        // 清理旧商店节点
        this.shopContainer.removeAllChildren();
        
        // 实例化新节点
        this.shop.forEach((item, index) => {
            const node = instantiate(this.itemPrefab);
            // 这里可以挂载一个 DraggableItem 脚本来处理拖拽
            // node.getComponent(DraggableItem).init(item, this);
            this.shopContainer.addChild(node);
        });
    }
}
