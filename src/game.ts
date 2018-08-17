// import { KEYCODE, SYMBOL_CHAR } from './config'
// import { gameInfo } from './info'
// import { Bomb } from './property'

enum logMode {
    log,
    warn,
    error,
    success,
}

class Game {
    // 配置常量
    width = 21;
    height = 21;
    delayTime = 500; // 游戏流程速度，毫秒计
    originX = 4;  // 玩家初始点
    originY = 9;  // 玩家初始点
    originScene = 3; // 初始设定角色视野
    targetScene = 1; // 宝物视野

    // 变量
    scene: number = 0; // 角色视野变量
    currentX: number = 0; // 玩家当前位置
    currentY: number = 0; // 玩家当前位置
    targetX = 0    // 胜利目标当前位置
    targetY = 0    // 胜利目标当前位置
    stopId: number;
    order: number; // 用户指令寄存
    content = '';
    bombList: Bomb[]
    dotSet: boolean[][] = []; // 障碍物点集
    /**
     * 点集，格式如下：
     * [
     *  [true, false, true, false],
     *  [false, false, false, false],
     *  [true, false, false, false],
     *  [true, true, true, false],
     * ]
     */

    onKeyDown = (event: KeyboardEvent) => {
        this.order = event.keyCode;
    }
    constructor() {
        // 变量
        this.scene = this.originScene; // 角色视野变量
        this.currentX = this.originX; // 玩家当前位置
        this.currentY = this.originY; // 玩家当前位置
        this.targetX = 0    // 胜利目标当前位置
        this.targetY = 0    // 胜利目标当前位置
        this.stopId = null;
        this.order = null; // 用户指令寄存
        this.content = '';
        this.bombList = [new Bomb()]
        this.dotSet = []; // 障碍物点集
        /**
         * 点集，格式如下：
         * [
         *  [true, false, true, false],
         *  [false, false, false, false],
         *  [true, false, false, false],
         *  [true, true, true, false],
         * ]
         */

        this.initDotSet();
        this.randomPosition('current');
        this.randomPosition('target');
    }

    // 初始化点集
    initDotSet() {
        // 若有x行，y列，期望通过this.dotSet[y][x]来取值：
        for (let y = 0; y < this.width; y++) {
            this.dotSet[y] = [];
            for (let x = 0; x < this.height; x++) {
                if (this.possibility(0.2)) {
                    this.dotSet[y][x] = true;
                } else {
                    this.dotSet[y][x] = false;
                }
            }
        }
    }

    // 随机初始位置
    randomPosition(key: string) {
        let self: any = this

        self[`${key}X`] = Math.floor(Math.random() * self.width);
        self[`${key}Y`] = Math.floor(Math.random() * self.height);

        // 确保初始化的当前位置没有障碍物
        while (self.dotSet[self[`${key}Y`]][self[`${key}X`]]) {
            self.randomPosition(key)
        }
    }

    // 进行一节游戏
    go() {
        // 主要流程函数
        // 1. 先执行用户指令，比如移动。全部在数据层次操作
        this.handleControll();

        // 2. 将数据印在屏幕上。只负责打印，不涉及游戏数据改动
        this.render();

        // 3. 对着数据集进行合法判定，判断游戏是否胜利或者失败
        this.check();

        // 都没问题则，执行下一轮，循环有gameStart方法控制
    }

    reset() {
        this.content = '';
        this.order = null;
        this.initDotSet();
        this.randomPosition('current'); // 必须在initDotSet后面
        this.randomPosition('target'); // 必须后面
    }

    render() {
        console.clear();
        this.buildContent();
        // 渲染方法：通过log将字符串输出
        this.log(logMode.log, this.content);
    }

    buildContent() {
        this.content = '';
        // console.log(this.currentX, this.currentY)
        for (let i = 0; i < this.width; i++) {
            if (i === 0) {
                // 位于上边线的情况，优先处理
                this.content += (SYMBOL_CHAR.LEFT_TOP_CORNER + SYMBOL_CHAR.HORIZONTAL)
                this.content += (SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                this.content += (SYMBOL_CHAR.RIGHT_TOP_CORNER)
                this.content += '\n';
            }
            for (let j = 0; j < this.height; j++) {
                if (j === 0) {
                    // 位于左边线的情况，优先处理
                    this.content += SYMBOL_CHAR.VERTICAL + ' ';
                }
                this.buildMainObject(i, j)
                this.content += ' ';
                if (j === this.height - 1) {
                    // 位于右边线的情况，最后处理
                    this.content += SYMBOL_CHAR.VERTICAL + ' ';
                }
            }
            this.content += '\n';
            if (i === this.width - 1) {
                // 位于下边线的情况，最后处理
                this.content += (SYMBOL_CHAR.LEFT_BOTTOM_CORNER + SYMBOL_CHAR.HORIZONTAL)
                this.content += (SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                this.content += (SYMBOL_CHAR.RIGHT_BOTTOM_CORNER)
                this.content += '\n';
            }
        }
        this.content = this.content.substr(0, this.content.length - 1);
    }

    // 可覆盖，绘制主要物体
    buildMainObject(y: number, x: number) {
        // 判断是否在点集里
        if (
            // 明亮自身周围
            this.calcDistance(
                this.currentX,
                this.currentY,
                x,
                y,
                this.scene,
            )
            // 明亮宝物周围
            // && this.calcDistance(
            //     this.targetX,
            //     this.targetY,
            //     x,
            //     y,
            //     this.targetScene,
            // )
        ) {
            this.content += SYMBOL_CHAR.FOG;
        } else if (y === this.currentY && x === this.currentX) {
            this.content += SYMBOL_CHAR.SUBJECT;
        } else if (y === this.targetY && x === this.targetX) {
            this.content += SYMBOL_CHAR.TARGET;
        } else if (this.dotSet[y][x]) {
            this.content += SYMBOL_CHAR.OBSTACLE;
        } else {
            this.content += SYMBOL_CHAR.BLANK;
        }
    }

    // 可覆盖，对于用户按键的处理
    handleControll() {
        let keyCode = this.order;
        this.order = null;
        switch (keyCode) {
            // 向左上方移动是减小，右下方移动坐标增大
            case KEYCODE.A:
            case KEYCODE.LEFT: // left
                // 当前坐标大于左边线的坐标，可以移动
                if (this.currentX > 0) {
                    this.currentX -= 1;
                }
                break;
            case KEYCODE.W:
            case KEYCODE.UP: // top
                // 当前坐标大于上边线的坐标，可以移动
                if (this.currentY > 0) {
                    this.currentY -= 1;
                }
                break;
            case KEYCODE.D:
            case KEYCODE.RIGHT: // right
                // 当前坐标小于右边线的坐标，可以移动
                if (this.currentX < this.width - 1) {
                    this.currentX += 1;
                }
                break;
            case KEYCODE.S:
            case KEYCODE.DOWN: // down
                // 当前坐标小于下边线的坐标，可以移动
                if (this.currentY < this.height - 1) {
                    this.currentY += 1;
                }
                break;
            case KEYCODE.SPACE:
            case KEYCODE.B:
                if (this.bombList.length) {
                    let bomb = this.bombList.shift()

                    bomb.destory(this.currentX, this.currentY, this.dotSet)
                }
                break;

        }
    }

    // 可覆盖，条件判定以及处理
    check() {
        /**
         * 检测规则：
         * 1. 人撞到障碍物，游戏结束
         * 2. todo...
         */
        let gameover = false;
        let gameoverReason = '';
        let lMode = logMode.error;

        if (this.dotSet[this.currentY][this.currentX]) {
            gameover = true;
            lMode = logMode.error;
            gameoverReason = gameInfo.killedByObstacle;
        }
        if (this.currentX === this.targetX
            && this.currentY === this.targetY) {
            gameover = true;
            lMode = logMode.success;
            gameoverReason = gameInfo.gameclear;
        }
        if (gameover) {
            this.gameOver();
            this.log(lMode, `${gameoverReason}${gameInfo.gameover}`);
        }
    }

    log(type: number, ...params: any[]) {
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

    // 开始游戏的命令
    gameStart() {
        this.body.addEventListener('keydown', this.onKeyDown);
        this.stopId = setInterval(() => {
            this.go();
        }, this.delayTime);
    }

    // 游戏结束的命令
    gameOver() {
        this.reset()
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null
    }

    // 游戏暂停的命令
    gamePause() {
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null
        console.warn(gameInfo.pause);
    }

    // 游戏启动的命令（入口函数）
    run() {
        // this.gameStart()
        console.clear();
        this.log(logMode.log, gameInfo.hello);
        this.body.addEventListener('keydown', (e) => {
            if (e.keyCode === KEYCODE.ESC && this.stopId) {
                this.gamePause()
            } else if (e.keyCode === KEYCODE.ENTER && !this.stopId) {
                this.gameStart()
            }
        })

    }

    calcDistance(selfX: number, selfY: number, targetX: number, targetY: number, sceneDistance: number) {
        let x = Math.abs(targetX - selfX);
        let y = Math.abs(targetY - selfY);
        let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        return distance > sceneDistance
    }

    possibility(num = 0.5) {
        return Math.random() <= num
    }

    get body() {
        return document.body
    }

    // onEnd() {
    //     this.gameOver()
    //     this.reset();
    // }
}

var game = new Game()
game.run();

/**
* 左上角为x0y0
* 右下角为xnyn
*/