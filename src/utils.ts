namespace Game {
    export type TPosision = {
        x: number,
        y: number
    }
    export enum logMode {
        log,
        warn,
        error,
        success,
    }
    
    export class Utils {
        static calcDistance(selfX: number, selfY: number, targetX: number, targetY: number, sceneDistance: number) {
            let x = Math.abs(targetX - selfX);
            let y = Math.abs(targetY - selfY);
            let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            return distance > sceneDistance
        }
    
        static possibility(num = 0.5) {
            return Math.random() <= num
        }
    
        static createRandomPosition(dataSet: DataSet): TPosision {
            let ySize = dataSet.length
            let xSize = dataSet[0].length
            let x = Math.floor(Math.random() * xSize);
            let y = Math.floor(Math.random() * ySize);
    
            // 确保初始化的当前位置没有障碍物
            if (dataSet[y][x].type === ObjectType.BLANK) {
                return { x, y }
            } else {
                return Utils.createRandomPosition(dataSet)
            }
        }

        static findBlankPosition(dataSet: DataSet): TPosision {
            // TODO 算法可以优化
            // TODO 没位置的情况会死循环
            let ySize = dataSet.length
            let xSize = dataSet[0].length
            let x = Math.floor(Math.random() * xSize);
            let y = Math.floor(Math.random() * ySize);
    
            // 确保初始化的当前位置没有障碍物
            if (dataSet[y][x].type === ObjectType.BLANK) {
                return { x, y }
            } else {
                return Utils.createRandomPosition(dataSet)
            }
        }

        static getOne(list: any[]) {
            let length = list.length;

            return list[Math.floor(Math.random() * length)]
        }

        static mapDateSet(dataSet: DataSet, callback: (x: number, y: number) => any) {
            let width = dataSet.length;
            let height = dataSet[0].length;

            for (let y = 0; y < width; y++) {
                for (let x = 0; x < height; x++) {
                    callback(x, y)
                }
            }
        }
        // static log(type: number, ...params: any[]) {
        //     switch (type) {
        //         case logMode.warn:
        //             console.warn(...params);
        //             break;
        //         case logMode.error:
        //             console.error(...params);
        //             break;
        //         case logMode.success:
        //             console.info(...params);
        //             break;
        //         default:
        //             console.log(...params);
        //     }
        // }
    }

    export class Console {
        log(...params: any[]) {
            window.console.log(...params);
        }

        error(...params: any[]) {
            window.console.error(...params);
        }

        success(...params: any[]) {
            window.console.info(...params);
        }

        clear() {
            window.console.clear();
        }
    }
    export const console = new Console();

    export class EventRegister {
        host: any = null;
        constructor() {
            this.host = document.body;
            // TODO 若浏览器环境，把事件注册到body中
            // 若bash环境，把事件注册到。。。中
        }

        on(handleName: string, callBack: Function) {
            this.host.addEventListener(handleName, callBack);
        }

        off(handleName: string, callBack: Function) {
            this.host.removeEventListener(handleName, callBack);
        }
    }
    export const eventRegister = new EventRegister();





}
