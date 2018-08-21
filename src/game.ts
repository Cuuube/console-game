namespace Game {
    enum GameMode {
        title,
        level,
    }
    
    /**
     * Game只负责游戏启动与暂停。并且负责控制调用level的render
     */
    export class GameController {
        // 配置常量
        delayTime = 500; // 游戏流程速度，毫秒计
    
        // 变量
        stopId: number = null;
        content = '';
        levelList: Level[] = [];
        currentLevel: Level = null // 当前关卡
        startTime: number = 0; // 玩家开始游戏时间记录
        deadTimes: number = 0; // 玩家死亡记录

        private gameMode: number = GameMode.title; // 游戏模式
       
        onKeyDown = (event: KeyboardEvent) => {
            let keyCode = event.keyCode;

            switch (keyCode) {
                // 停止游戏
                case KEYCODE.ESC:
                    if (this.gameMode === GameMode.level) {
                        this.gameEnd();
                    }
                    break;
                // 游戏开始
                case KEYCODE.ENTER:
                    if (this.gameMode === GameMode.title) {
                        this.gameStart();
                    }
                    break;
            }
        }
        constructor() {
            this.initLevelList();
        }

        initLevelList() {
            this.levelList.push(
                // new Level(this),  // base
                new DngLevel(this),  // 地牢历险
                new RsBlLevel(this), // 俄罗斯方块
            );
        }

        useLevel(level: Level) {
            // 解绑老level事件
            // 绑定新level事件，初始化level
            let oldLevel = this.currentLevel;

            oldLevel ? oldLevel.unbind() : void 0;
            level.bind();
            this.currentLevel = level;
        }

        // 进行一节游戏
        go() {
            // 主要流程函数
            this.currentLevel ? this.currentLevel.processStart() : null;
            // 1. 先执行用户指令，比如移动。全部在数据层次操作
            this.handleControll();
    
            // 2. 将数据印在屏幕上。只负责打印，不涉及游戏数据改动
            this.render();
    
            // 3. 对着数据集进行合法判定，判断游戏是否胜利或者失败
            this.check();
    
            // 4. 做点其他的...
            this.currentLevel ? this.currentLevel.actions() : null;
    
            // 都没问题则，执行下一轮，循环有gameStart方法控制
        }

        // 可覆盖，对于用户按键的处理
        handleControll() {
            if (this.gameMode === GameMode.level) {
                this.currentLevel.handleControll()
            }
        }
    
        render() {
            // 如果还没进入到关卡内，则render游戏框架内容。否则render关卡内容。
            if (this.gameMode === GameMode.level) {
                this.currentLevel.render()
            } else {
                // 区分画面，加入scene参数 TODO
                // 如果是通关界面，显示通关
                // 如果是失败界面，显示失败信息
                console.clear();
                this.content = '';
                this.buildContent();
                // 渲染方法：通过log将字符串输出
                console.log(this.content);
            }
        }
    
        buildContent() {
            // 展示基本的游戏内容和教程
            this.content += gameInfo.hello;
        }
    
    
        check() {
            /**
             * 检测规则：
             * 1. 人撞到障碍物，游戏结束
             * 2. todo...
             */
            if (this.gameMode === GameMode.level) {
                let signal = this.currentLevel.check();
                switch(signal) {
                    case GameSignal.over:
                        return this.gameEnd();
                    case GameSignal.clear:
                        return this.gameClear();
                    case GameSignal.continue:
                        return this.gameContinue();
                }
            }
        }
    
        // 重置全部变量，视为游戏重新开始，关卡到第一关
        reset() {
            this.content = '';
            this.useLevel(this.levelList[0]);
            this.currentLevel.reset();
        }

        get delay() {
            return this.gameMode === GameMode.level ? this.currentLevel.delayTime : this.delayTime
        }
    
        // 游戏进行的命令
        gameStart() {
            this.gameMode = GameMode.level;
            this.currentLevel.bind();
            this.stopId = setInterval(() => {
                this.go();
            }, this.delay);
        }
    
        // 游戏结束的命令
        gameEnd() {
            this.gameMode = GameMode.title;
            this.reset();
            clearInterval(this.stopId);
            this.stopId = null;
            this.currentLevel.unbind();

            this.render();
            console.error('游戏结束！');
        }
    
        // 游戏继续的命令，意为短暂的暂停，进入下一关
        gameContinue() {
            let levelNum = this.levelList.findIndex(item => item === this.currentLevel);
            let nextLevel = this.levelList[levelNum + 1];

            if (nextLevel) {
                this.useLevel(nextLevel);
            } else {
                return this.gameClear();
            }

            console.success('恭喜进入下一关！');
        }
    
        // 游戏通关，结束计时、清空死亡次数、展示通关时间等
        gameClear() {
            this.reset();
            this.gameMode = GameMode.title;
            clearInterval(this.stopId);
            this.stopId = null;

            this.render();
            console.success('恭喜通关！');


            // this.body.removeEventListener('keydown', this.onKeyDown);
            // clearInterval(this.stopId);
            // this.stopId = null;
    
            // let endTime = new Date().getTime();
            // this.log(logMode.success, `恭喜通关！此次通关时间为${(endTime - this.startTime) / 1000}秒！死亡${this.deadTimes}次。`);
    
            // this.startTime = new Date().getTime();
            // this.deadTimes = 0;
        }
    
    
        // 游戏启动的命令（入口函数）
        run() {
            Cheat.registerCheat(this);
            eventRegister.on('keydown', this.onKeyDown);
            this.startTime = new Date().getTime();
            if (this.levelList.length) {
                this.useLevel(this.levelList[0]);
            }
            this.render();
        }
    }
    
}

