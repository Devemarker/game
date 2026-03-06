import { _decorator, Component, Node, EventTouch, Vec3, UITransform } from 'cc';
import { GameManager } from './GameManager';
import { ItemInstance } from './Engine';
import { ITEM_DEFS } from './Items';

const { ccclass, property } = _decorator;

@ccclass('DraggableItem')
export class DraggableItem extends Component {
    
    private gameManager: GameManager = null;
    private itemData: ItemInstance = null;
    private startPos: Vec3 = new Vec3();
    private isDragging: boolean = false;

    public init(item: ItemInstance, manager: GameManager) {
        this.itemData = item;
        this.gameManager = manager;
        
        // 根据 ITEM_DEFS[item.itemId] 初始化节点的图片、颜色、大小等
        const def = ITEM_DEFS[item.itemId];
        const uiTransform = this.getComponent(UITransform);
        // 假设 cellSize 为 50
        const width = def.shape[0].length * 50;
        const height = def.shape.length * 50;
        uiTransform.setContentSize(width, height);
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        this.startPos.set(this.node.position);
        // 提升层级，确保在最上层
        this.node.setSiblingIndex(999);
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;
        const delta = event.getDelta();
        const pos = this.node.position;
        this.node.setPosition(pos.x + delta.x, pos.y + delta.y, pos.z);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.isDragging) return;
        this.isDragging = false;

        // 获取拖拽结束时的世界坐标
        const worldPos = event.getUILocation();
        
        // 假设 GameManager 中有一个方法将世界坐标转换为网格坐标 (gridX, gridY)
        // const { gridX, gridY } = this.gameManager.worldToGrid(worldPos);
        
        // 模拟坐标系转换
        const gridX = 0; 
        const gridY = 0;

        const success = this.gameManager.tryPlaceItem(this.itemData, gridX, gridY);
        
        if (success) {
            // 放置成功，节点吸附到网格
            // this.node.setPosition(gridX * 50, gridY * 50);
        } else {
            // 放置失败，弹回原处
            this.node.setPosition(this.startPos);
        }
    }
}
