interface IProperty {
    
}

class Property {
    type = ''
    sight = 0
}

class Bomb extends Property {
    type = 'bomb'
    private distance: number = 2

    constructor (distance: number = 2) {
        super()
        this.distance = distance
    }

    destory(x: number, y: number, dotSet: boolean[][]) {
        for (let j = 0; j < dotSet.length; j++) {
            for (let i = 0; i < dotSet[j].length; i++) {
                if (!Utils.calcDistance(x, y, i, j, this.distance)) {
                    dotSet[j][i] = false;
                }
            }
        }
    }
}

class Torch extends Property {
    type = 'torch'
    sight: number = 2;
    constructor (sight: number = 2) {
        super()
        this.sight = sight;
    }
}