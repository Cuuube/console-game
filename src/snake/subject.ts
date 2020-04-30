namespace Game {
    export class SnakeSubject extends Subject {
        x: number = 5;
        y: number = 5;

        symbol: string = SYMBOL_CHAR.SUBJECT;

        growth = false;

        constructor() {
            super();
            this.dataSetMeta = [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
                { x: 0, y: 3 },
            ]
            this.computed();
        }

        moveTo(x: number, y: number, dataSet: DataSet) {
            let height = dataSet.length;
            let width = dataSet[0].length;

            // 移动超出边缘则不移动
            if (x + this.minX < 0
                || y + this.minY < 0
                || x + this.maxX > width - 1
                || y + this.maxY > height - 1) {
                return;
            }
            if (this.cannotMove(x, y, dataSet)) {
                return;
            }
            // 把屁股的方块去掉，头部新增当前位置
            this.dataSetMeta.unshift({ x, y });
            if (this.growth) {
                this.growth = false;
            } else {
                this.dataSetMeta.pop();
            }

            this.x = x;
            this.y = y;
            this.computed();
        }

        cannotMove(x: number, y: number, dataSet: DataSet) {
            // 不能移动到自己身上
            if (x === this.x && y === this.y) {
                return true;
            }
            return this.dataSetMeta.some(posision => {
                let X = posision.x + x;
                let Y = posision.y + y;

                return x === X && y === Y;
            })
        }
    }
}