// import { KEYCODE, SYMBOL_CHAR } from './config'
// import { gameInfo } from './info'
// import { Bomb } from './property'

enum logMode {
    log,
    warn,
    error,
    success,
}

interface CurrentProperty {
    x: number,
    y: number,
    object: Property
}

let byLevel = [
    { propertyAppear: 0.1, obstacle: 0.2 },
    { propertyAppear: 0.05, obstacle: 0.25 },
    { propertyAppear: 0.02, obstacle: 0.3 },
    { propertyAppear: 0.01, obstacle: 0.4 },
]

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
    // scene: number = 0; // 角色视野变量
    currentX: number = 0; // 玩家当前位置
    currentY: number = 0; // 玩家当前位置
    targetX = 0    // 胜利目标当前位置
    targetY = 0    // 胜利目标当前位置
    properties: Property[] = [] // 用户所持道具栏
    property: CurrentProperty = null; // 当前屏幕出现的道具
    stopId: number;
    order: number; // 用户指令寄存
    content = '';
    dotSet: boolean[][] = []; // 障碍物点集
    level: number = 0 // 关卡数
    startTime: number = 0 // 玩家开始游戏时间
    deadTimes: number = 0 // 玩家死亡次数
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
        // this.scene = this.originScene; // 角色视野变量
        this.currentX = this.originX; // 玩家当前位置
        this.currentY = this.originY; // 玩家当前位置
        this.targetX = 0    // 胜利目标当前位置
        this.targetY = 0    // 胜利目标当前位置
        this.stopId = null;
        this.order = null; // 用户指令寄存
        this.content = '';
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

    get bombList() {
        return this.properties.filter(item => item.type === 'bomb')
    }

    get scene(): number {
        let sightByProperty: number = 0
        this.properties.forEach(property => {
            sightByProperty += property.sight
        })

        return this.originScene + sightByProperty
    }

    // 初始化点集
    initDotSet() {
        // 若有x行，y列，期望通过this.dotSet[y][x]来取值：
        for (let y = 0; y < this.width; y++) {
            this.dotSet[y] = [];
            for (let x = 0; x < this.height; x++) {
                if (Utils.possibility(byLevel[this.level].obstacle)) {
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

    createRandomProperty() {
        if (this.property) {
            return
        }
        if (Utils.possibility(byLevel[this.level].propertyAppear)) {
            let { x, y } = Utils.createRandomPosition(this.width, this.height, this.dotSet)
            this.property = {
                x, y,
                object: Utils.possibility(0.5) ? new Torch() : new Bomb()
            }
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

        // 4. 做点其他的，比如随机生成一轮道具
        this.createRandomProperty()

        // 都没问题则，执行下一轮，循环有gameStart方法控制
    }

    reset(clearAll = false) {
        this.content = '';
        this.order = null;
        this.initDotSet();
        this.randomPosition('current'); // 必须在initDotSet后面
        this.randomPosition('target'); // 必须后面

        if (clearAll) {
            // 重置道具相关
            this.properties = []
            this.property = null
            this.level = 0
        }
    }

    render() {
        console.clear();
        this.content = '';
        this.buildHeader();
        this.buildContent();
        // 渲染方法：通过log将字符串输出
        this.log(logMode.log, this.content);
    }
    buildHeader() {
        let header = `您现在在第${this.level + 1}关
您现在有${this.properties.length}件道具：
火把${ this.properties.filter(property => property.type === 'torch').length || 0}件，
炸弹${ this.properties.filter(property => property.type === 'bomb').length || 0}个。
------
`
        this.content += header;
    }

    buildContent() {
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
            Utils.calcDistance(
                this.currentX,
                this.currentY,
                x,
                y,
                this.scene,
            )
            // 明亮宝物周围
            // && Utils.calcDistance(
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
        } else if (this.property
            && y === this.property.y
            && x === this.property.x) {
            this.content += SYMBOL_CHAR.getPropertySymbol(this.property.object.type);
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
                let bomb = <Bomb>this.properties.find(property => property.type === 'bomb')
                if (bomb) {
                    this.properties = this.properties.filter(item => item !== bomb)
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
        let gameEndMode = null;
        let gameoverReason = '';
        let lMode = logMode.error;

        if (this.dotSet[this.currentY][this.currentX]) {
            gameEndMode = 'gameover';
            lMode = logMode.error;
            gameoverReason = gameInfo.killedByObstacle + gameInfo.gameover;
        }
        if (this.currentX === this.targetX
            && this.currentY === this.targetY) {
            lMode = logMode.success;
            if (this.level >= byLevel.length - 1) {
                gameEndMode = 'gameclear';
            } else {
                gameEndMode = 'gamecontinue';
                gameoverReason = gameInfo.gamecontinue;
            }

        }
        if (this.property && this.currentX === this.property.x && this.currentY === this.property.y) {
            this.properties.push(this.property.object)
            this.property = null
        }
        switch (gameEndMode) {
            case ('gameover'):
                this.gameOver();
                this.log(lMode, gameoverReason);
                break;
            case ('gamecontinue'):
                this.gameContinue();
                this.log(lMode, gameoverReason);
                break;
            case ('gameclear'):
                this.gameClear();
                break;
            default:
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

    // 重开游戏的命令
    gameStart() {
        this.body.addEventListener('keydown', this.onKeyDown);
        this.stopId = setInterval(() => {
            this.go();
        }, this.delayTime);
    }

    // 游戏结束的命令
    gameOver() {
        this.reset(true);
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;

        this.deadTimes += 1;
    }

    // 游戏继续的命令，意为短暂的暂停，进入下一关
    gameContinue() {
        this.reset()
        this.level += 1;
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;
    }

    // 游戏通关，结束计时、清空死亡次数、展示通关时间等
    gameClear() {
        this.reset(true)
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;

        let endTime = new Date().getTime();
        this.log(logMode.success, `恭喜通关！此次通关时间为${(endTime - this.startTime) / 1000}秒！死亡${this.deadTimes}次。`);

        this.startTime = new Date().getTime();
        this.deadTimes = 0;
    }

    // 游戏暂停的命令
    gamePause() {
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;
        console.warn(gameInfo.pause);
    }

    // 游戏启动的命令（入口函数）
    run() {
        this.startTime = new Date().getTime();

        console.clear();
        this.log(logMode.log, gameInfo.hello);
        this.body.addEventListener('keydown', (e) => {
            if (e.keyCode === KEYCODE.ESC && this.stopId) {
                this.gamePause();
            } else if (e.keyCode === KEYCODE.ENTER && !this.stopId) {
                this.gameStart();
            }
        })

    }

    get body() {
        return document.body;
    }

    // onEnd() {
    //     this.gameOver()
    //     this.reset();
    // }
}

(window as any).giveMeSomeBombs = () => {
    console.log('世间没有什么事情是一个炸弹解决不了的。如果有，那就两个。');
    game.properties.push(new Bomb(), new Bomb(), new Bomb(), new Bomb());
}

(window as any).bigBomb = () => {
    console.log('你仿佛听见雷神在你的掌间轰鸣。');
    game.properties.push(new Bomb(20));
}

(window as any).letThereBeLight = () => {
    console.log('银河汇聚到了你的手中。');
    game.properties.push(new Torch(15));
}


var game = new Game();
game.run();

/**
* 左上角为x0y0
* 右下角为xnyn
*/


/** 两个问题：
 * 1. 随机刷的道具可能在刺儿上
 * 2. 提示语不友好
 * 3. 开始计时只能从游戏运行时算
 */