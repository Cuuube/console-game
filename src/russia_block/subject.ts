namespace Game {
    const dataSetMetaList: TPosision[][] = [
        // 土
        [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: -1 },
        ],
        // 口
        [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: -1 },
        ],
        // L
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ],
        // 5
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ],
        // 2
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
        ],
        // I
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
        ],

    ]

    export class BlockSubject extends Subject {
        symbol: string = SYMBOL_CHAR.BLOCK;

        constructor() {
            super();
            this.randomDataSetMeta();
            this.computed();
        }

        randomDataSetMeta() {
            this.dataSetMeta = Utils.getOne(dataSetMetaList);
        }

        moveTo(x: number, y: number, dataSet: DataSet) {
            let height = dataSet.length;
            let width = dataSet[0].length;

            // 移动超出边缘则不移动
            if (x + this.maxX > width - 1 || x + this.minX < 0) {
                x = this.x
            }
            if (y + this.maxY > height - 1 || y + this.minY < 0) {
                y = this.y
            }
            if (this.cannotMove(x, y, dataSet)) {
                return;
            }
            this.x = x;
            this.y = y;
            this.computed();
        }

        somethingInSelf(dataSet: DataSet) {
            return this.dataSet.some(({ x, y }) => {
                return dataSet[y][x].realOb
            })
        }

        rotate(dataSet: DataSet) {
            let newDataMeta = this.dataSetMeta.map(position => {
                let x = -position.y;
                let y = position.x;
                return { x, y };
            })
            // 如果旋转后依然合法，则允许旋转，否则不允许
            let validate = newDataMeta.every(({ x , y }) => {
                x += this.x
                y += this.y

                return dataSet[y] && dataSet[y][x] && dataSet[y][x].type !== ObjectType.BLOCK;
            })
            if (validate) {
                this.dataSetMeta = newDataMeta;
                this.computed();
            }
        }

        cannotMove(x: number, y: number, dataSet: DataSet) {
            if (x === this.x && y === this.y) {
                return true;
            }
            return this.dataSetMeta.some(posision => {
                let X = posision.x + x;
                let Y = posision.y + y;

                return dataSet[Y] && dataSet[Y][X] && dataSet[Y][X].type === ObjectType.BLOCK;
            })
        }
    }
}