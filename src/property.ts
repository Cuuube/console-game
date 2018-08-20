namespace Game {
    export interface IProperty {
    
    }
    
    export enum PropertyType {
        bomb,
        torch,
    }
    export class Property {
        type: number = 0
        sight: number = 0
    }

    export class PropCreator {
        MAX_PROP_NUMBER: number = 1;
        props: Property[] = [];
        basket = [
            Bomb,
            Torch,
        ]
        possibility: number = 0.1
        create(possibility: number = this.possibility) {
            if (Utils.possibility(possibility)) {
                let prop: Property = new (Utils.getOne(this.basket))();
                
                return prop;
            }
        }
    }
    
    export class Bomb extends Property {
        type = PropertyType.bomb
        private distance: number = 2
    
        constructor (distance: number = 2) {
            super()
            this.distance = distance
        }
    
        destory(x: number, y: number, dataSet: DataSet) {
            for (let j = 0; j < dataSet.length; j++) {
                for (let i = 0; i < dataSet[j].length; i++) {
                    if (!Utils.calcDistance(x, y, i, j, this.distance)) {
                        // 只炸障碍物，不炸道具
                        if (dataSet[j][i].type === ObjectType.OBSTACLE) {
                            dataSet[j][i] = new BlankMO();
                        }
                    }
                }
            }
        }
    }
    
    export class Torch extends Property {
        type = PropertyType.torch
        sight: number = 2;
        constructor (sight: number = 2) {
            super()
            this.sight = sight;
        }
    }
}
