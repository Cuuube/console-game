namespace Game {
    // 障碍元素，踩上去会死
    export class BlockMO extends MapObject {
        public type: number = ObjectType.BLOCK;
        public symbol: string = SYMBOL_CHAR.BLOCK;
    }
}