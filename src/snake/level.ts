namespace Game {
    export class SnakeLevel extends Level {
        // 配置常量
        width = 21;
        height = 21;
    
        // 变量
        order: number = KEYCODE.UP; // 用户指令寄存
        content = '';
        levelName: string = '0' // 关卡数

        dataSet: DataSet = null; // 地图点集
        subject: SnakeSubject = null;

        subjectPosition: TPosision = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2),
        };
        targetPosition: TPosision = null;
        isPause: boolean = false;

        constructor(public game: GameController) {
            super(game);
            this.reset();
        }

        // 重置分为几种：
        // 只重置为地图刚开始，保留道具
        // 重置地图以及主角属性

        public reset() {
            // 清空关卡数据
            this.initMapDataSet();
            this.initSubject();
            // 放一个target
            this.initTarget();

            this.isPause = false;
        }

        // 初始化主题角色
        protected initSubject() {
            
            let { x, y } = this.subjectPosition;

            this.subject = new SnakeSubject();
            // this.subject.moveTo(x, y, this.dataSet);
        }

        // 初始化目标位置
        protected initTarget() {
            if (!this.targetPosition) {
                this.targetPosition = Utils.findBlankPosition(this.dataSet);
            }
            let { x, y } = this.targetPosition;

            this.dataSet[y][x] = new TargetMO();
        }
    
        // // 初始化地图handle
        // initMapObject(x: number, y: number) {
        //     this.dataSet[y][x] = new BlankMO();
        // }
        
        protected buildHeader() {
            let header = `
            贪吃蛇
            按键：${this.order}
            ${this.subject.x}, ${this.subject.y}
            ------
            `
            this.content += header;
            this.content += '\n';
        }
    
    
        // 可覆盖，绘制主要物体
        protected buildMainObject(y: number, x: number) {
            let currentX = this.subject.x;
            let currentY = this.subject.y;

            // 判断是否在点集里
            if (x === currentX && y === currentY) {
                this.content += SYMBOL_CHAR.YINYANG;
            } else if (this.subject.inSelf(x, y)) {
                this.content += SYMBOL_CHAR.BLOCK;
            } else {
                this.content += this.dataSet[y][x].symbol
            }
        }

        public onKeyDown = (event: KeyboardEvent) => {
            let keyCode = event.keyCode;
            let { x, y } = this.subject;

            switch (keyCode) {
                case KEYCODE.A:
                case KEYCODE.LEFT: // left
                    if (this.subject.inSelf(x - 1, y)) {
                        return;
                    }
                case KEYCODE.W:
                case KEYCODE.UP: // top
                    if (this.subject.inSelf(x, y - 1)) {
                        return;
                    }
                case KEYCODE.D:
                case KEYCODE.RIGHT: // right
                    if (this.subject.inSelf(x + 1, y)) {
                        return;
                    }
                case KEYCODE.S:
                case KEYCODE.DOWN: // down
                    if (this.subject.inSelf(x, y + 1)) {
                        return;
                    }
            }
            this.order = keyCode;
        }
    
        public handleControll() {
            let keyCode = this.order;
            let { x, y } = this.subject;

            // 更改坐标
            switch (keyCode) {
                case KEYCODE.A:
                case KEYCODE.LEFT: // left
                    this.subject.moveTo(x - 1, y, this.dataSet);
                    break;
                case KEYCODE.W:
                case KEYCODE.UP: // top
                    this.subject.moveTo(x, y - 1, this.dataSet);
                    break;
                case KEYCODE.D:
                case KEYCODE.RIGHT: // right
                    this.subject.moveTo(x + 1, y, this.dataSet);
                    this.order = KEYCODE.RIGHT;
                    break;
                case KEYCODE.S:
                case KEYCODE.DOWN: // down
                    this.subject.moveTo(x, y + 1, this.dataSet);
                    break;
            }

        }
    

        mainActions() {
        }

        mainChecks() {
            (window as any).sub = this.subject;
            (window as any).lev = this;
            let { x, y } = this.subject;

            return this.subject.touch(this.dataSet);
        }
    }
}