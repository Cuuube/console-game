/**
 * gamebase 0.1.0版本，只提供简单的躲障碍的玩法，以及开始、暂停、结束、重开、胜利。
 */
class KeyCode {
    constructor () {
        this.UP = 38;
        this.DOWN = 40;
        this.LEFT = 37;
        this.RIGHT = 39;
        this.ENTER = 13;
        this.ESC = 27;
    }
}

class SymbolChar {
    constructor () {
        this.BLANK = '·'  // 空白画布字符
        this.MAIN = 'i'   // 玩家控制实体的字符
        this.OBSTACLE = 'x' // 障碍物符号
        this.TARGET = '$'

        this.LEFT_TOP_CORNER = '┌'   // 画布制表符
        this.RIGHT_TOP_CORNER = '┐'   // 画布制表符
        this.LEFT_BOTTOM_CORNER = '└'   // 画布制表符
        this.RIGHT_BOTTOM_CORNER = '┘'   // 画布制表符
        this.HORIZONTAL = '-'   // 画布制表符
        this.VERTICAL = '|'   // 画布制表符

    }
}

const KEYCODE = new KeyCode();
const symbolChar = new SymbolChar();
const logMode = {
    log: 0,
    warn: 1,
    error: 2,
    success: 3,
}

class Game {
    constructor () {
        // 配置常量
        this.width = 21;
        this.height = 21;
        this.delayTime = 500; // 游戏流程速度，毫秒计
        this.originX = 4;  // 玩家初始点
        this.originY = 9;  // 玩家初始点

        // 变量
        this.currentX = this.originX; // 玩家当前位置
        this.currentY = this.originY; // 玩家当前位置
        this.targetX = 0    // 胜利目标当前位置
        this.targetY = 0    // 胜利目标当前位置
        this.stopId = null;
        this.order = null; // 用户指令寄存
        this.content = '';
        this.dotSet = []; // x
        /**
         * 点集，格式如下：
         * [
         *  [true, false, true, false],
         *  [false, false, false, false],
         *  [true, false, false, false],
         *  [true, true, true, false],
         * ]
         */

        this.onKeyDown = (event) => {
            this.order = event.keyCode;
        }

        this.initDotSet();
        this.randomCurrentPosition();
        this.randomTargetPosition();
    }

    // 初始化点集
    initDotSet() {
        // 若有x行，y列，期望通过this.dotSet[y][x]来取值：
        for (let y = 0; y < this.width; y ++) {
            this.dotSet[y] = [];
            for (let x = 0; x < this.height; x ++) {
                if (Math.random() > 0.8) {
                    this.dotSet[y][x] = true;
                } else {
                    this.dotSet[y][x] = false;
                }
            }
        }
    }

    // 随机玩家初始位置
    randomCurrentPosition() {
        this.currentX = Math.floor(Math.random() * this.width);
        this.currentY = Math.floor(Math.random() * this.height);

        // 确保初始化的当前位置没有障碍物
        this.dotSet[this.currentY][this.currentX] = false;
    }

    // 随机宝藏初始位置
    randomTargetPosition() {
        this.targetX = Math.floor(Math.random() * this.width);
        this.targetY = Math.floor(Math.random() * this.height);

        if (this.targetX === this.currentX
            && this.targetY === this.currentY) {
            this.randomTargetPosition()
        }

        // 确保初始化的当前位置没有障碍物
        this.dotSet[this.targetY][this.targetX] = false;
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
        this.randomCurrentPosition() // 必须在initDotSet后面
        this.randomTargetPosition() // 必须后面
        // this.currentX = this.originX;
        // this.currentY = this.originY;
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
        for (let i = 0; i < this.width; i++ ) {
            if (i === 0) {
                // 位于上边线的情况，优先处理
                this.content += (symbolChar.LEFT_TOP_CORNER + symbolChar.HORIZONTAL)
                this.content += (symbolChar.HORIZONTAL.repeat(this.width * 2));
                this.content += (symbolChar.RIGHT_TOP_CORNER)
                this.content += '\n';
            }
            for (let j = 0; j < this.height; j++ ) {
                if (j === 0) {
                    // 位于左边线的情况，优先处理
                    this.content += symbolChar.VERTICAL + ' ';
                }
                this.buildMainObject(i, j)
                this.content += ' ';
                if (j === this.height - 1) {
                    // 位于右边线的情况，最后处理
                    this.content += symbolChar.VERTICAL + ' ';
                }
            }
            this.content += '\n';
            if (i === this.width - 1) {
                // 位于下边线的情况，最后处理
                this.content += (symbolChar.LEFT_BOTTOM_CORNER + symbolChar.HORIZONTAL)
                this.content += (symbolChar.HORIZONTAL.repeat(this.width * 2));
                this.content += (symbolChar.RIGHT_BOTTOM_CORNER)
                this.content += '\n';
            }
        }
        this.content = this.content.substr(0, this.content.length - 1);
    }

    // 可覆盖，绘制主要物体
    buildMainObject(y, x) {
        // 判断是否在点集里
        if (y === this.currentY && x === this.currentX) {
            this.content += symbolChar.MAIN;
        } else if (y === this.targetY && x === this.targetX) {
            this.content += symbolChar.TARGET;
        } else if (this.dotSet[y][x]) {
            this.content += symbolChar.OBSTACLE;
        } else {
            this.content += symbolChar.BLANK;
        }
    }

    // 可覆盖，对于用户按键的处理
    handleControll() {
        let keyCode = this.order;
        this.order = null;
        switch (keyCode) {
            // 向左上方移动是减小，右下方移动坐标增大
            case KEYCODE.LEFT: // left
                // 当前坐标大于左边线的坐标，可以移动
                if (this.currentX > 0) {
                    this.currentX -= 1;
                }
                break;
            case KEYCODE.UP: // top
                // 当前坐标大于上边线的坐标，可以移动
                if (this.currentY > 0) {
                    this.currentY -= 1;
                }
                break;
            case KEYCODE.RIGHT: // right
                // 当前坐标小于右边线的坐标，可以移动
                if (this.currentX < this.width - 1) {
                    this.currentX += 1;
                }
                break;
            case KEYCODE.DOWN: // down
                // 当前坐标小于下边线的坐标，可以移动
                if (this.currentY < this.height - 1) {
                    this.currentY += 1;
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
            gameoverReason = '您撞到了障碍物。';
        }
        if (this.currentX === this.targetX
            && this.currentY === this.targetY) {
            gameover = true;
            lMode = logMode.success;
            gameoverReason = '恭喜您胜利！';
        }
        if (gameover) {
            this.gameOver();
            this.log(lMode, `${gameoverReason}游戏结束！请按“ENTER”键重新开始游戏。`);
        }
    }

    log(type, ...params) {
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
        document.getElementsByTagName('body')[0].addEventListener('keydown', this.onKeyDown);
        this.stopId = setInterval(() => {
            this.go();
        }, this.delayTime);
    }

    // 游戏结束的命令
    gameOver() {
        this.reset()
        document.getElementsByTagName('body')[0].removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null
    }

    // 游戏暂停的命令
    gamePause() {
        document.getElementsByTagName('body')[0].removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null
        console.warn('游戏暂停。请按“ENTER”键继续游戏。');
    }

    // 游戏启动的命令（入口函数）
    run() {
        this.gameStart()
        document.getElementsByTagName('body')[0].addEventListener('keydown', (e) => {
            if (e.keyCode === KEYCODE.ESC && this.stopId) {
                this.gamePause()
            } else if (e.keyCode === KEYCODE.ENTER && !this.stopId) {
                this.gameStart()
            }
        })
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