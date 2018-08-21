namespace Game {
    export class DngLevel extends Level {
        // 配置常量
        width = 21;
        height = 21;
        possibility = 0.2;
    
        // 变量
        order: number; // 用户指令寄存
        content = '';
        levelName: string = '0' // 关卡数

        dataSet: DataSet = null; // 地图点集
        subject: DngSubject = null;
        propManager = new PropManager(this.dataSet);

        subjectPosition: TPosision = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2),
        };
        targetPosition: TPosision = null;
        isPause: boolean = false;

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
            // 放一个target
            this.initTarget();

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

            this.subject = new DngSubject();
            this.subject.moveTo(x, y, this.dataSet);
        }

        // 初始化目标位置
        initTarget() {
            if (!this.targetPosition) {
                this.targetPosition = Utils.findBlankPosition(this.dataSet);
            }
            let { x, y } = this.targetPosition;

            this.dataSet[y][x] = new TargetMO();
        }
    
        // 初始化地图handle
        mapDataSetHandle(x: number, y: number) {
            if (Utils.possibility(this.possibility)) {
                this.dataSet[y][x] = new ObstacleMO();
            } else {
                this.dataSet[y][x] = new BlankMO();
            }
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
            }
            // 重新赋值坐标
            this.subject.moveTo(x, y, this.dataSet);
        }
    

        mainActions() {
            
            this.propManager.create();
        }

        mainChecks() {
            let { x, y } = this.subject;

            return this.subject.touch(this.dataSet);
        }
    }
}