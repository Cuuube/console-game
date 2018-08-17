var KeyCode = (function () {
    function KeyCode() {
        this.UP = 38;
        this.DOWN = 40;
        this.LEFT = 37;
        this.RIGHT = 39;
        this.ENTER = 13;
        this.ESC = 27;
        this.SPACE = 32;
        this.ONE = 49;
        this.TWO = 50;
        this.TRHEE = 51;
        this.FOUR = 52;
        this.FIVE = 53;
        this.SIX = 54;
        this.SEVEN = 55;
        this.EIGHT = 56;
        this.NINE = 57;
        this.ZERO = 48;
        this.W = 87;
        this.A = 65;
        this.S = 83;
        this.D = 68;
        this.B = 66;
        this.U = 85;
        this.I = 73;
        this.O = 79;
        this.J = 74;
        this.K = 75;
        this.L = 76;
    }
    return KeyCode;
}());
var SymbolChar = (function () {
    function SymbolChar() {
        this.BLANK = '·';
        this.SUBJECT = 'i';
        this.OBSTACLE = 'x';
        this.TARGET = '$';
        this.FOG = '-';
        this.LEFT_TOP_CORNER = '┌';
        this.RIGHT_TOP_CORNER = '┐';
        this.LEFT_BOTTOM_CORNER = '└';
        this.RIGHT_BOTTOM_CORNER = '┘';
        this.HORIZONTAL = '-';
        this.VERTICAL = '|';
    }
    return SymbolChar;
}());
var KEYCODE = new KeyCode();
var SYMBOL_CHAR = new SymbolChar();
var Bomb = (function () {
    function Bomb() {
    }
    Bomb.prototype.destory = function (x, y, dotSet) {
        if (dotSet[y - 1]) {
            dotSet[y - 1][x] = false;
        }
        if (dotSet[y]) {
            dotSet[y][x - 1] = false;
            dotSet[y][x] = false;
            dotSet[y][x + 1] = false;
        }
        if (dotSet[y + 1]) {
            dotSet[y + 1][x] = false;
        }
    };
    return Bomb;
}());
var GameInfo = (function () {
    function GameInfo() {
        this.hello = "\n  ------\n  \u6CE8\u610F\uFF1A\u8BF7\u5C06\u9F20\u6807\u79FB\u5230\u9875\u9762\u5185\u70B9\u51FB\u4E00\u4E0B\uFF0C\u624D\u80FD\u4F7F\u7528\u952E\u76D8\u6309\u952E\u3002\n\n  \u7B26\u53F7\u4ECB\u7ECD\uFF1A\n      " + SYMBOL_CHAR.SUBJECT + " \u4F60\n      " + SYMBOL_CHAR.TARGET + " \u5B9D\u85CF\uFF0C\u6E38\u620F\u76EE\u6807\n      " + SYMBOL_CHAR.BLANK + " \u7A7A\u767D\u533A\u57DF\uFF0C\u53EF\u5B89\u5168\u79FB\u52A8\n      " + SYMBOL_CHAR.OBSTACLE + " \u969C\u788D\u7269\uFF0C\u6478\u5230\u4F1A\u6B7B\n      " + SYMBOL_CHAR.FOG + " \u8FF7\u96FE\n\n  \u6E38\u620F\u6559\u7A0B\uFF1A\n      \u65B9\u5411\u952E/WSAD\uFF1A\u79FB\u52A8\n      ENTER\uFF1A\u5F00\u59CB\u6E38\u620F\n      ESC\uFF1A\u6682\u505C\u6E38\u620F\n      B\uFF1A\u70B8\u6389\u5468\u56F4\u65B9\u5757\n  \n  \u6309ENTER\u952E\u7EE7\u7EED\u3002\n  ------";
        this.pause = "\u6E38\u620F\u6682\u505C\u3002\u8BF7\u6309[ENTER]\u952E\u7EE7\u7EED\u6E38\u620F\u3002";
        this.gameover = "\u6E38\u620F\u7ED3\u675F\uFF01\u8BF7\u6309\u201CENTER\u201D\u952E\u91CD\u65B0\u5F00\u59CB\u6E38\u620F\u3002";
        this.gameclear = "\u606D\u559C\u60A8\u80DC\u5229\uFF01";
        this.killedByObstacle = "\u60A8\u649E\u5230\u4E86\u969C\u788D\u7269\u3002";
    }
    return GameInfo;
}());
var gameInfo = new GameInfo();
var logMode;
(function (logMode) {
    logMode[logMode["log"] = 0] = "log";
    logMode[logMode["warn"] = 1] = "warn";
    logMode[logMode["error"] = 2] = "error";
    logMode[logMode["success"] = 3] = "success";
})(logMode || (logMode = {}));
var Game = (function () {
    function Game() {
        var _this = this;
        this.width = 21;
        this.height = 21;
        this.delayTime = 500;
        this.originX = 4;
        this.originY = 9;
        this.originScene = 3;
        this.targetScene = 1;
        this.scene = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.content = '';
        this.dotSet = [];
        this.onKeyDown = function (event) {
            _this.order = event.keyCode;
        };
        this.scene = this.originScene;
        this.currentX = this.originX;
        this.currentY = this.originY;
        this.targetX = 0;
        this.targetY = 0;
        this.stopId = null;
        this.order = null;
        this.content = '';
        this.bombList = [new Bomb()];
        this.dotSet = [];
        this.initDotSet();
        this.randomPosition('current');
        this.randomPosition('target');
    }
    Game.prototype.initDotSet = function () {
        for (var y = 0; y < this.width; y++) {
            this.dotSet[y] = [];
            for (var x = 0; x < this.height; x++) {
                if (this.possibility(0.2)) {
                    this.dotSet[y][x] = true;
                }
                else {
                    this.dotSet[y][x] = false;
                }
            }
        }
    };
    Game.prototype.randomPosition = function (key) {
        var self = this;
        self[key + "X"] = Math.floor(Math.random() * self.width);
        self[key + "Y"] = Math.floor(Math.random() * self.height);
        while (self.dotSet[self[key + "Y"]][self[key + "X"]]) {
            self.randomPosition(key);
        }
    };
    Game.prototype.go = function () {
        this.handleControll();
        this.render();
        this.check();
    };
    Game.prototype.reset = function () {
        this.content = '';
        this.order = null;
        this.initDotSet();
        this.randomPosition('current');
        this.randomPosition('target');
    };
    Game.prototype.render = function () {
        console.clear();
        this.buildContent();
        this.log(logMode.log, this.content);
    };
    Game.prototype.buildContent = function () {
        this.content = '';
        for (var i = 0; i < this.width; i++) {
            if (i === 0) {
                this.content += (SYMBOL_CHAR.LEFT_TOP_CORNER + SYMBOL_CHAR.HORIZONTAL);
                this.content += (SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                this.content += (SYMBOL_CHAR.RIGHT_TOP_CORNER);
                this.content += '\n';
            }
            for (var j = 0; j < this.height; j++) {
                if (j === 0) {
                    this.content += SYMBOL_CHAR.VERTICAL + ' ';
                }
                this.buildMainObject(i, j);
                this.content += ' ';
                if (j === this.height - 1) {
                    this.content += SYMBOL_CHAR.VERTICAL + ' ';
                }
            }
            this.content += '\n';
            if (i === this.width - 1) {
                this.content += (SYMBOL_CHAR.LEFT_BOTTOM_CORNER + SYMBOL_CHAR.HORIZONTAL);
                this.content += (SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                this.content += (SYMBOL_CHAR.RIGHT_BOTTOM_CORNER);
                this.content += '\n';
            }
        }
        this.content = this.content.substr(0, this.content.length - 1);
    };
    Game.prototype.buildMainObject = function (y, x) {
        if (this.calcDistance(this.currentX, this.currentY, x, y, this.scene)) {
            this.content += SYMBOL_CHAR.FOG;
        }
        else if (y === this.currentY && x === this.currentX) {
            this.content += SYMBOL_CHAR.SUBJECT;
        }
        else if (y === this.targetY && x === this.targetX) {
            this.content += SYMBOL_CHAR.TARGET;
        }
        else if (this.dotSet[y][x]) {
            this.content += SYMBOL_CHAR.OBSTACLE;
        }
        else {
            this.content += SYMBOL_CHAR.BLANK;
        }
    };
    Game.prototype.handleControll = function () {
        var keyCode = this.order;
        this.order = null;
        switch (keyCode) {
            case KEYCODE.A:
            case KEYCODE.LEFT:
                if (this.currentX > 0) {
                    this.currentX -= 1;
                }
                break;
            case KEYCODE.W:
            case KEYCODE.UP:
                if (this.currentY > 0) {
                    this.currentY -= 1;
                }
                break;
            case KEYCODE.D:
            case KEYCODE.RIGHT:
                if (this.currentX < this.width - 1) {
                    this.currentX += 1;
                }
                break;
            case KEYCODE.S:
            case KEYCODE.DOWN:
                if (this.currentY < this.height - 1) {
                    this.currentY += 1;
                }
                break;
            case KEYCODE.SPACE:
            case KEYCODE.B:
                if (this.bombList.length) {
                    var bomb = this.bombList.shift();
                    bomb.destory(this.currentX, this.currentY, this.dotSet);
                }
                break;
        }
    };
    Game.prototype.check = function () {
        var gameover = false;
        var gameoverReason = '';
        var lMode = logMode.error;
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
            this.log(lMode, "" + gameoverReason + gameInfo.gameover);
        }
    };
    Game.prototype.log = function (type) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        switch (type) {
            case logMode.warn:
                console.warn.apply(console, params);
                break;
            case logMode.error:
                console.error.apply(console, params);
                break;
            case logMode.success:
                console.info.apply(console, params);
                break;
            default:
                console.log.apply(console, params);
        }
    };
    Game.prototype.gameStart = function () {
        var _this = this;
        this.body.addEventListener('keydown', this.onKeyDown);
        this.stopId = setInterval(function () {
            _this.go();
        }, this.delayTime);
    };
    Game.prototype.gameOver = function () {
        this.reset();
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;
    };
    Game.prototype.gamePause = function () {
        this.body.removeEventListener('keydown', this.onKeyDown);
        clearInterval(this.stopId);
        this.stopId = null;
        console.warn(gameInfo.pause);
    };
    Game.prototype.run = function () {
        var _this = this;
        console.clear();
        this.log(logMode.log, gameInfo.hello);
        this.body.addEventListener('keydown', function (e) {
            if (e.keyCode === KEYCODE.ESC && _this.stopId) {
                _this.gamePause();
            }
            else if (e.keyCode === KEYCODE.ENTER && !_this.stopId) {
                _this.gameStart();
            }
        });
    };
    Game.prototype.calcDistance = function (selfX, selfY, targetX, targetY, sceneDistance) {
        var x = Math.abs(targetX - selfX);
        var y = Math.abs(targetY - selfY);
        var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance > sceneDistance;
    };
    Game.prototype.possibility = function (num) {
        if (num === void 0) { num = 0.5; }
        return Math.random() <= num;
    };
    Object.defineProperty(Game.prototype, "body", {
        get: function () {
            return document.body;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
}());
var game = new Game();
game.run();
//# sourceMappingURL=game.js.map