namespace Game {
    export enum ObjectType {
        BLANK,
        SUBJECT,
        OBSTACLE,
        TARGET,
        PROPS,
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

    // 障碍元素，踩上去会死
    export class ObstacleMO extends MapObject {
        public type: number = ObjectType.OBSTACLE;
        public symbol: string = SYMBOL_CHAR.OBSTACLE;
        touch(subject: Subject): number {
            // 游戏结束
            return GameSignal.over;
        }
    }

    // 通关目标元素，踩上去会胜利
    export class TargetMO extends MapObject {
        public type: number = ObjectType.TARGET;
        public symbol: string = SYMBOL_CHAR.TARGET;
        touch(subject: Subject): number {
            // 游戏胜利，进入下一关
            return GameSignal.continue;
        }
    }

    // 道具元素，踩上去会拿到道具
    export class PropMO extends MapObject {
        public type: number = ObjectType.PROPS;
        public symbol: string = '';
        public isProp: boolean = true;
        // 碰撞之后的callback
        public ontouch: Function = () => {};
        constructor(public property: Property) {
            super();
            this.type = this.property.type;
            this.symbol = SYMBOL_CHAR.getPropertySymbol(this.property.type)
        }
        touch(subject: Subject): number {
            // 添加道具
            subject.props.push(this.property);
            this.ontouch();

            return GameSignal.none;
        }
    }

    // 道具控制类，控制地图上的道具出现频率
    export class PropManager {
        MAX_PROP_NUMBER: number = 1;
        currentPropsNumber: number = 0;
        basket = [
            Bomb,
            Torch,
        ]
        possibility: number = 0.1

        constructor(
            public dataSet: DataSet
        ) {}
        create(possibility: number = this.possibility) {
            if (Utils.possibility(possibility) && (this.MAX_PROP_NUMBER - this.currentPropsNumber > 0)) {
                let property: Property = new (Utils.getOne(this.basket))();
                let propMO: PropMO = new PropMO(property);
                let { x, y } = Utils.findBlankPosition(this.dataSet);

                propMO.ontouch = () => {
                    this.dataSet[y][x] = new BlankMO();
                    this.currentPropsNumber--;
                }
                this.currentPropsNumber++;
                this.dataSet[y][x] = propMO;
            }
        }

        removeAllProps() {
            Utils.mapDateSet(this.dataSet, (x, y) => {
                if ((this.dataSet[y][x] as PropMO).isProp) {
                    this.dataSet[y][x] = new BlankMO();
                }
            })
        }
    }
}