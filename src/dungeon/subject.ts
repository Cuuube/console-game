namespace Game {
    export class DngSubject extends Subject {
        x: number = 0;
        y: number = 0;
        props: Property[] = [
            new Bomb(),
        ];
        originalVision: number = 3;
        symbol: string = SYMBOL_CHAR.SUBJECT;

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