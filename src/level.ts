/**
 * 优化结构目的：
 * 将游戏壳子与关卡剥离开。
 * 游戏壳子只负责启动、结束、计分。
 * 关卡负责真正的游戏流程。并且是以插件形式存入游戏壳子当中。Level[]
 * 
 * 关卡中主要模块两个，一个是地图数据集，存放每一个坐标的内容MapObject
 * 一个是玩家控制的主题Subject，包含所有道具、属性等。
 */

namespace Game {
    export type DataSet = MapObject[][];

    export interface CurrentProperty {
        x: number,
        y: number,
        object: Property
    }
    export interface ILevel {
        levelName: string;
        width: number,
        height: number,
        dataSet: DataSet;
        subject: Subject;
    }

    export enum GameSignal { // 按严重性排序
        none,
        continue,
        clear,
        over,
    }
    
    export class Level implements ILevel {
        // 配置常量
        width = 21;
        height = 21;
        possibility = 0.01;
    
        // 变量
        order: number; // 用户指令寄存
        content = '';
        levelName: string = '0' // 关卡数

        dataSet: DataSet = null; // 障碍物点集
        subject: Subject = null;
        propManager = new PropManager(this.dataSet);

        subjectPosition: TPosision = null;
        targetPosition: TPosision = null;
        isPause: boolean = false;

        onKeyDown = (event: KeyboardEvent) => {
            this.order = event.keyCode;
        }

        constructor(public game: GameController) {
            this.subject = new Subject();
            this.reset();
        }

        // 重置分为几种：
        // 只重置为地图刚开始，保留道具
        // 重置地图以及主角属性

        reset() {
            // 清空关卡数据
            if (!this.dataSet) {
                this.initMapDataSet();
            }
            this.initSubject();
            this.propManager = new PropManager(this.dataSet);
            this.propManager.removeAllProps();

            this.isPause = false;
        }

        // 初始化主题角色
        initSubject() {
            if (!this.subjectPosition) {
                this.subjectPosition = Utils.findBlankPosition(this.dataSet);
            }
            let { x, y } = this.subjectPosition;
            
            this.subject.moveTo(x, y, this.dataSet);
        }

        // 初始化目标位置
        initTarget() {
            if (!this.targetPosition) {
                this.targetPosition = Utils.findBlankPosition(this.dataSet);
            }
        }
    
        // 初始化地图
        initMapDataSet() {
            this.dataSet = [];
            // 若有x行，y列，期望buildContenthis.dataSet[y][x]来取值：
            for (let y = 0; y < this.width; y++) {
                this.dataSet[y] = [];
                for (let x = 0; x < this.height; x++) {
                    if (Utils.possibility(this.possibility)) {
                        this.dataSet[y][x] = new ObstacleMO();
                    } else {
                        this.dataSet[y][x] = new BlankMO();
                    }
                }
            }

            // 放一个target
            this.initTarget();
            let { x, y } = this.targetPosition;

            this.dataSet[y][x] = new TargetMO();
        }
        
        // 废弃，由game进行帧控制。此方法不会调用
        // go() {
            // // 主要流程函数
            // // 1. 先执行用户指令，比如移动。全部在数据层次操作
            // this.handleControll();
    
            // // 2. 将数据印在屏幕上。只负责打印，不涉及游戏数据改动
            // this.render();
    
            // // 3. 对着数据集进行合法判定，判断游戏是否胜利或者失败
            // this.check();
    
            // // 4. 做点其他的，比如随机生成一轮道具
            
    
            // // 都没问题则，执行下一轮，循环有gameStart方法控制
        // }
    
        render() {
            console.clear();
            this.content = '';
            this.buildHeader();
            this.buildContent();
            // 渲染方法：通过log将字符串输出
            console.log(this.content);
        }
        buildHeader() {
            let header = `
            您现在在第${this.levelName}关
            您现在有${this.subject.props.length}件道具：
            火把${ this.subject.props.filter(property => property.type === PropertyType.torch).length || 0}件，
            炸弹${ this.subject.props.filter(property => property.type === PropertyType.bomb).length || 0}个。
            ------
            `
            this.content += header;
            this.content += '\n';
        }
    
        buildContent() {
            // console.log(currentX, currentY)
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
            let currentX = this.subject.x;
            let currentY = this.subject.y;

            // 判断是否在点集里
            if (
                // 明亮自身周围
                Utils.calcDistance(
                    currentX,
                    currentY,
                    x,
                    y,
                    this.subject.vision,
                )
            ) {
                this.content += SYMBOL_CHAR.FOG;
            } else if (currentX === x && currentY === y) {
                this.content += SYMBOL_CHAR.YINYANG;
            } else if (this.subject.inSelf(x, y)) {
                if (this.isPause) {
                    this.content += SYMBOL_CHAR.BLOCK;
                } else {
                    this.content += this.subject.symbol;
                }
            } else {
                this.content += this.dataSet[y][x].symbol
            }
        }
    
        // 可覆盖，对于用户按键的处理
        handleControll() {
            let keyCode = this.order;
            
            this.order = null;

            let { x, y } = this.subject;

            if (this.isPause) {
                if (keyCode === KEYCODE.P) {
                    this.levelPlay();
                }
                return;
            }

            // 更改坐标
            switch (keyCode) {
                case KEYCODE.A:
                case KEYCODE.LEFT: // left
                    x -= 1;
                    break;
                case KEYCODE.W:
                case KEYCODE.UP: // top
                    y -= 1;
                    break;
                case KEYCODE.D:
                case KEYCODE.RIGHT: // right
                    x += 1;
                    break;
                case KEYCODE.S:
                case KEYCODE.DOWN: // down
                    y += 1;
                    break;
                case KEYCODE.SPACE:
                case KEYCODE.B: // 炸弹
                    this.subject.useBomb(this.dataSet);
                    break;
                case KEYCODE.P: // 暂停
                    this.levelPause();
                    return;
                case KEYCODE.R: // 重开
                    this.levelReplay();
                    return;
    
            }
            // 重新赋值坐标
            this.subject.moveTo(x, y, this.dataSet);
        }
    
        // 可覆盖，条件判定以及处理
        check(): number {
            if (this.isPause) {
                return;
            }
            /**
             * 检测规则：
             * 1. 人撞到障碍物，游戏结束
             * 2. todo...
             */
            let { x, y } = this.subject;

            // return this.dataSet[y][x].touch(this.subject);
            return this.subject.touch(this.dataSet);
        }

        otherActions() {
            if (this.isPause) {
                return;
            }
            this.propManager.create();
        }

        // 关卡暂停与重新开始
        levelPause() {
            // TODO
            this.isPause = true;
        }

        // 关卡重新激活
        levelPlay() {
            this.isPause = false;
        }

        // 关卡重开
        levelReplay() {
            // TODO
            this.reset();
        }

        unbind() {
            // 解绑所有键盘事件
            eventRegister.off('keydown', this.onKeyDown)
        }

        bind() {
            // 绑定所有键盘事件
            eventRegister.on('keydown', this.onKeyDown)
        }
    
        
    }
}