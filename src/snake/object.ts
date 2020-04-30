namespace Game {
    // 障碍元素，踩上去会死
    export class FoodMO extends MapObject {
        public type: number = ObjectType.TARGET;
        public symbol: string = SYMBOL_CHAR.BOMB;

        touch(subject: SnakeSubject): number {
            // 会让主角长度加一
            subject.growth = true;
            return GameSignal.continue;
        }
    }
}