namespace Game {
    export class Subject {
        x: number = 0;
        y: number = 0;
        props: Property[] = [];
        dataSetMeta: TPosision[] = [ // 自身实体的点集，相对坐标（自身为0，左上为负，右下为正）
            { x: 0, y: 0 },
        ];
        dataSet: TPosision[] = []; // 自身在地图中的点集
        maxX: number = 0; // 自身实体在地图最大x坐标
        maxY: number = 0; // 自身实体在地图最大y坐标
        minX: number = 0; // 自身实体在地图最小x坐标
        minY: number = 0; // 自身实体在地图最小y坐标
        symbol: string = SYMBOL_CHAR.SUBJECT;

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
            this.x = x;
            this.y = y;
            this.computed();
        }

        inSelf(x: number, y: number): boolean {
            return this.dataSet.some(position => {
                let sameX = position.x === x;
                let sameY = position.y === y;

                return sameX && sameY
            });
        }

        touch(map: DataSet) {
            let signal: number[] = [];
            this.dataSet.forEach(({ x, y }) => {
                signal.push(map[y][x].touch(this));
            })
            signal = signal.sort();
            // 将最可能有问题的优先弹出
            return signal.pop();
        }

        computed() {
            let xSet = this.dataSetMeta
                .map(posision => posision.x)
                .sort((a, b) => a < b ? -1 : 1);
            let ySet = this.dataSetMeta
                .map(posision => posision.y)
                .sort((a, b) => a < b ? -1 : 1);

            this.minX = xSet[0];
            this.minY = ySet[0];
            this.maxX = xSet[xSet.length - 1];
            this.maxY = ySet[ySet.length - 1];
            this.calcDataSet();

        }

        calcDataSet() {
            this.dataSet = this.dataSetMeta.map(posision => ({
                x: posision.x + this.x,
                y: posision.y + this.y,
            }))
        }

        // 继承
        cannotMove(x: number, y: number, dataSet: DataSet) {
            return false;
        }
    }

}