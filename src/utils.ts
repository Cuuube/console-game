namespace Game {
    type TPosision = {
        x: number,
        y: number
    }
    enum logMode {
        log,
        warn,
        error,
        success,
    }
    
    class Utils {
        static calcDistance(selfX: number, selfY: number, targetX: number, targetY: number, sceneDistance: number) {
            let x = Math.abs(targetX - selfX);
            let y = Math.abs(targetY - selfY);
            let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            return distance > sceneDistance
        }
    
        static possibility(num = 0.5) {
            return Math.random() <= num
        }
    
        static createRandomPosition(xSize: number, ySize: number, dotSet: boolean[][]): TPosision {
    
            let x = Math.floor(Math.random() * xSize);
            let y = Math.floor(Math.random() * ySize);
    
            // 确保初始化的当前位置没有障碍物
            if (dotSet[y][x]) {
                return Utils.createRandomPosition(xSize, ySize, dotSet)
            } else {
                return { x, y }
            }
        }
        static log(type: number, ...params: any[]) {
            switch (type) {
                case logMode.warn:
                    console.warn(...params);
                    break;
                case logMode.error:
                    console.error(...params);
                    break;
                case logMode.success:
                    console.info(...params);
                    break;
                default:
                    console.log(...params);
            }
        }
    }
}
