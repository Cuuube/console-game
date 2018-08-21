namespace Game {
    export enum ObjectType {
        BLANK,
        SUBJECT,
        OBSTACLE,
        TARGET,
        PROPS,
        BLOCK, // 砖块，不可移动
    }

    // 地图元素，包含类型、表现字符、碰撞结果
    export class MapObject {
        public type: number = null;
        public symbol: string = null;
        public realOb: boolean = true;
        // subject与地图方块的碰撞结果
        touch(subject: Subject): number {
            // 默认什么都不发生
            return GameSignal.none;
        }
    }

    // 空元素，踩上去没事儿
    export class BlankMO extends MapObject {
        public type: number = ObjectType.BLANK;
        public symbol: string = SYMBOL_CHAR.BLANK;
        public realOb: boolean = false;
    }

    
}