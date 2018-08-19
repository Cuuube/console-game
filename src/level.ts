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
    interface ILevel {
        levelName: string;
        width: number,
        heigh: number,
        dataSet: MapObject[][];
        subject: Subject;
    }
    
    class Level implements ILevel {
        // 配置常量
        width = 21;
        height = 21;
        originScene = 3; // 初始设定角色视野
        targetScene = 1; // 宝物视野
    
        // 变量
        // scene: number = 0; // 角色视野变量
        order: number; // 用户指令寄存
        content = '';
        levelName: string = '0' // 关卡数

        dataSet: MapObject[][] = null; // 障碍物点集
        subject: Subject = null;

        constructor(public game: GameController) {
            this.subject = new Subject();
            this.subject.setPosition(1, 0);

            if (!this.dataSet) {
                this.initMapDataSet();
            }
        }
        // get scene(): number {
        //     let sightByProperty: number = 0
        //     this.properties.forEach(property => {
        //         sightByProperty += property.sight
        //     })
    
        //     return this.originSbuildContent + sightByProperty
        // }
    
        // 初始化点集
        initMapDataSet() {
            // 若有x行，y列，期望buildContenthis.dataSet[y][x]来取值：
            for (let y = 0; y < this.width; y++) {
                this.dataSet[y] = [];
                for (let x = 0; x < this.height; x++) {
                    if (Utils.possibility(0.2)) {
                        this.dataSet[y][x] = new ObstacleMO();
                    } else {
                        this.dataSet[y][x] = new BlankMO();
                    }
                }
            }
        }
    
        // // 随机初始位置
        // randomPosition(key: string) {
        //     let self: any = this
    
        //     self[`${key}X`] = Math.floor(Math.random() * self.width);
        //     self[`${key}Y`] = Math.floor(Math.random() * self.height);
    
        //     // 确保初始化的当前位置没有障碍物
        //     while (self.dataSet[self[`${key}Y`]][self[`${key}X`]]) {
        //         self.randomPosition(key)
        //     }
        // }
    
        // createRandomProperty() {
        //     if (this.property) {
        //         return
        //     }
        //     if (Utils.possibility(byLevel[this.level].propertyAppear)) {
        //         let { x, y } = Utils.createRandomPosition(this.width, this.height, this.dataSet)
        //         this.property = {
        //             x, y,
        //             object: Utils.possibility(0.5) ? new Torch() : new Bomb()
        //         }
        //     }
        // }
        reset() {
            // 清空关卡数据
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
    
        render() {
            console.clear();
            this.content = '';
            this.buildHeader();
            this.buildContent();
            // 渲染方法：通过log将字符串输出
            Utils.log(logMode.log, this.content);
        }
        buildHeader() {
            let header = `您现在在第${this.levelName}关
    您现在有${this.subject.props.length}件道具：
    火把${ this.subject.props.filter(property => property.type === 'torch').length || 0}件，
    炸弹${ this.subject.props.filter(property => property.type === 'bomb').length || 0}个。
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
            } else if (this.dataSet[y][x]) {
                this.content += SYMBOL_CHAR.OBSTACLE;
            } else {
                this.content += SYMBOL_CHAR.BLANK;
            }
        }
    
        // 可覆盖，对于用户按键的处理
        handleControll() {
            let keyCode = this.order;
            let { x, y } = this.subject;
            this.order = null;
            // 更改坐标
            switch (keyCode) {
                // 向左上方移动是减小，右下方移动坐标增大
                case KEYCODE.A:
                case KEYCODE.LEFT: // left
                    // 当前坐标大于左边线的坐标，可以移动
                    if (x > 0) {
                        x -= 1;
                    }
                    break;
                case KEYCODE.W:
                case KEYCODE.UP: // top
                    // 当前坐标大于上边线的坐标，可以移动
                    if (y > 0) {
                        y -= 1;
                    }
                    break;
                case KEYCODE.D:
                case KEYCODE.RIGHT: // right
                    // 当前坐标小于右边线的坐标，可以移动
                    if (x < this.width - 1) {
                        x += 1;
                    }
                    break;
                case KEYCODE.S:
                case KEYCODE.DOWN: // down
                    // 当前坐标小于下边线的坐标，可以移动
                    if (y < this.height - 1) {
                        y += 1;
                    }
                    break;
                case KEYCODE.SPACE:
                case KEYCODE.B:
                    let bomb = <Bomb>this.subject.props.find(property => property.type === 'bomb')
                    if (bomb) {
                        this.subject.props = this.subject.props.filter(item => item !== bomb)
                        bomb.destory(x, y, this.dataSet)
                    }
                    break;
    
            }
            // 重新赋值坐标
            this.subject.setPosition(x, y)
            
        }
    
        // 可覆盖，条件判定以及处理
        check() { // TODO
            /**
             * 检测规则：
             * 1. 人撞到障碍物，游戏结束
             * 2. todo...
             */
            let { x, y } = this.subject

            this.dataSet[y][x].onTouch(this.subject, this.game)

            // let gameEndMode = null;
            // let gameoverReason = '';
            // let lMode = logMode.error;

            // if (this.dataSet[y][x]) {
            //     gameEndMode = 'gameover';
            //     lMode = logMode.error;
            //     gameoverReason = gameInfo.killedByObstacle + gameInfo.gameover;
            // }
            // if (x === this.targetX
            //     && y === this.targetY) {
            //     lMode = logMode.success;
            //     if (this.level >= byLevel.length - 1) {
            //         gameEndMode = 'gameclear';
            //     } else {
            //         gameEndMode = 'gamecontinue';
            //         gameoverReason = gameInfo.gamecontinue;
            //     }
    
            // }
            // if (this.property && x === this.property.x && y === this.property.y) {
            //     this.properties.push(this.property.object)
            //     this.property = null
            // }
            // switch (gameEndMode) {
            //     case ('gameover'):
            //         this.gameOver();
            //         Utils.log(lMode, gameoverReason);
            //         break;
            //     case ('gamecontinue'):
            //         this.gameContinue();
            //         Utils.log(lMode, gameoverReason);
            //         break;
            //     case ('gameclear'):
            //         this.gameClear();
            //         break;
            //     default:
            // }
        }
    
        
    }











    // -----------------------------------------------------
    
    enum ObjectType {
        BLANK,
        SUBJECT,
        OBSTACLE,
        TARGET,
        PROPS,
    }

    // 地图元素，包含类型、表现字符、碰撞结果
    class MapObject {
        public type: number = null;
        public symbol: string = null;
        public realOb: boolean = true;
        // subject与地图方块的碰撞结果
        onTouch(subject: Subject, game?: Game) {
            // 默认什么都不发生
        }
    }

    class BlankMO extends MapObject {
        public type: number = ObjectType.BLANK;
        public symbol: string = SYMBOL_CHAR.BLANK;
        public realOb: boolean = false;
    }

    class ObstacleMO extends MapObject {
        public type: number = ObjectType.OBSTACLE;
        public symbol: string = SYMBOL_CHAR.OBSTACLE;
        onTouch(subject: Subject, game?: Game) {
            // 游戏结束 TODO
            game.gameOver()
        }
    }

    class TargetMO extends MapObject {
        public type: number = ObjectType.TARGET;
        public symbol: string = SYMBOL_CHAR.TARGET;
        onTouch(subject: Subject, game?: Game) {
            // 游戏胜利，进入下一关 TODO
            game.gameContinue()
        }
    }

    class PropMO extends MapObject {
        public type: number = ObjectType.TARGET;
        public symbol: string = SYMBOL_CHAR.TARGET;
        constructor(public property: Property) {
            super();
            this.type = this.property.type;
            this.symbol = SYMBOL_CHAR.getPropertySymbol(this.property.type)
        }
        onTouch(subject: Subject, game?: Game) {
            // 添加道具
            subject.props.push(this.property);
            // 删除该地图模块 TODO
        }
    }











    // ---------------------------------------------

    class Subject {
        x: number;
        y: number;
        props: Property[];

        setPosition(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }
}