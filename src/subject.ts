namespace Game {
    export class Subject {
        x: number = 0;
        y: number = 0;
        props: Property[] = [];
        originalVision: number = 10;
        symbol: string = SYMBOL_CHAR.SUBJECT;

        moveTo(x: number, y: number, dataSet: DataSet) {
            let height = dataSet.length;
            let width = dataSet[0].length;

            // 移动超出边缘则不移动
            if (x < 0
                || y < 0
                || x > width - 1
                || y > height - 1) {
                return;
            }
            this.x = x;
            this.y = y;
        }

        inSelf(x: number, y: number): boolean {
            return this.x === x && this.y === y;
        }

        useBomb(dataSet: DataSet) {
            let { x, y } = this;
            let bomb = <Bomb>this.props.find(property => property.type === PropertyType.bomb)

            if (bomb) {
                this.props = this.props.filter(item => item !== bomb);
                bomb.destory(x, y, dataSet);
            }
        }


        get vision() {
            let addonVisionByProps = 0;

            this.props.forEach(property => {
                addonVisionByProps += property.sight;
            })
            return this.originalVision + addonVisionByProps;
        }
    }
}