namespace Game {
    export class RsBlLevel extends Level {
        // 配置常量
        width = 21;
        height = 21;
        delayTime = 1000;

    
        // 变量
        order: number; // 用户指令寄存
        content = '';
        levelName: string = '0' // 关卡数

        dataSet: DataSet = null; // 地图点集
        subject: BlockSubject = null;

        subjectPosition: TPosision = { x: 10, y: 1 };
        isPause: boolean = false;

        // --- 将每次渲染接受一次按键改为按键和渲染脱离
        processStart() {
            // 流程开始,y自增一
            let { x, y } = this.subject;

            y += 1;
            this.subject.moveTo(x, y, this.dataSet);
        }
        onKeyDown = (event: KeyboardEvent) => {
            this.order = event.keyCode;
            this.controll();
        }
        controll() {
            let keyCode = this.order;
            this.order = null;

            let { x, y } = this.subject;

            if (this.isPause) {
                if (keyCode === KEYCODE.P) {
                    this.levelPlay();
                }
                return;
            }
            switch (keyCode) {
                case KEYCODE.P: // 暂停
                    this.levelPause();
                    return;
                case KEYCODE.R: // 重开
                    this.levelReplay();
                    return;
            }

            this.mainKeyHandles(keyCode);
            this.render();
            this.check();
        }
        handleControll() {}
        // --------

        constructor(public game: GameController) {
            super(game);
            this.init();
        }

        init() {
            this.reset();
        }

        // 重置分为几种：
        // 只重置为地图刚开始，保留道具
        // 重置地图以及主角属性

        reset() {
            // 清空关卡数据
            this.initMapDataSet();
            this.initSubject();

            this.isPause = false;
        }

        // 初始化主题角色
        initSubject() {
            if (!this.subjectPosition) {
                this.subjectPosition = Utils.findBlankPosition(this.dataSet);
            }
            let { x, y } = this.subjectPosition;

            this.subject = new BlockSubject();
            this.subject.moveTo(x, y, this.dataSet);
        }
    
        // // 初始化地图handle
        // mapDataSetHandle(x: number, y: number) {
        //     this.dataSet[y][x] = new BlankMO();
        // }
        
        buildHeader() {
            let header = `
            russia block
            ------
            `
            this.content += header;
            this.content += '\n';
        }
    
    
        // 可覆盖，绘制主要物体
        buildMainObject(y: number, x: number) {
            let currentX = this.subject.x;
            let currentY = this.subject.y;

            // 判断是否在点集里
            if (currentX === x && currentY === y) {
                this.content += SYMBOL_CHAR.YINYANG;
            } else if (this.subject.inSelf(x, y)) {
                this.content += this.subject.symbol;
            } else {
                this.content += this.dataSet[y][x].symbol
            }
        }
    
        mainKeyHandles(keyCode: number) {
            let { x, y } = this.subject;

            // 更改坐标
            switch (keyCode) {
                case KEYCODE.A:
                case KEYCODE.LEFT: // left
                    x -= 1;
                    break;
                case KEYCODE.W:
                case KEYCODE.UP: // top
                    // 上键的情况，什么都不做
                    // y -= 1;
                    break;
                case KEYCODE.D:
                case KEYCODE.RIGHT: // right
                    x += 1;
                    break;
                case KEYCODE.S:
                case KEYCODE.DOWN: // down
                    // 向下的情况
                    y += 1;
                    break;
                case KEYCODE.SPACE: // 旋转
                    this.subject.rotate(this.dataSet);
                    break;
            }
            // 重新赋值坐标
            this.subject.moveTo(x, y, this.dataSet);
        }

        mainChecks() {
            // 如果一个方块到了底边或者其他方块上，则冻结此方块到地图，然后重新生成subject

            let beStone =  this.subject.dataSet.some(({ x, y }) => {
                // 到底边，石化
                if (!this.dataSet[y + 1]) {
                    return true;
                }
                // 底边有东西，石化
                if (this.dataSet[y + 1][x].type === ObjectType.BLOCK) {
                    return true;
                }
                // 自身有重合，石化
                if (this.dataSet[y][x].type === ObjectType.BLOCK) {
                    return true;
                }
                return false;
            });
            if (beStone) {
                let endSignal = false;
                this.subject.dataSet.forEach(({x, y}) => {
                    this.dataSet[y][x] = new BlockMO();
                    if (x === this.subjectPosition.x && y === this.subjectPosition.y) {
                        endSignal = true;
                    }
                })
                if (endSignal) {
                    return GameSignal.over;
                }
                this.initSubject();
            }
            // 削行检测：如果某一列全部石化，则去掉那一列
            let markRowIndex: number[] = [];

            this.dataSet.forEach((row, index) => {
                let filled = row.every((item) => {
                    return item.type === ObjectType.BLOCK;
                })

                if (filled) {
                    markRowIndex.push(index);
                }
            })
            if (markRowIndex.length) {
                // 去掉空行，行往后叠
                markRowIndex.forEach(index => {
                    this.dataSet.splice(index, 1);
                })

                let addNumber = this.height - this.dataSet.length;

                while (addNumber > 0) {
                    let row: TargetMO[] = [];
                    let width = this.width;
                    while (width > 0) {
                        row.push(new BlankMO());
                        width--;
                    }

                    this.dataSet.unshift(row);
                    addNumber--;
                }
            }
            
            return GameSignal.none;
        }

        mainActions() {
            
        }
    }
}