var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game;
(function (Game) {
    var logMode;
    (function (logMode) {
        logMode[logMode["log"] = 0] = "log";
        logMode[logMode["warn"] = 1] = "warn";
        logMode[logMode["error"] = 2] = "error";
        logMode[logMode["success"] = 3] = "success";
    })(logMode = Game.logMode || (Game.logMode = {}));
    var Utils = (function () {
        function Utils() {
        }
        Utils.calcDistance = function (selfX, selfY, targetX, targetY, sceneDistance) {
            var x = Math.abs(targetX - selfX);
            var y = Math.abs(targetY - selfY);
            var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            return distance > sceneDistance;
        };
        Utils.possibility = function (num) {
            if (num === void 0) { num = 0.5; }
            return Math.random() <= num;
        };
        Utils.createRandomPosition = function (dataSet) {
            var ySize = dataSet.length;
            var xSize = dataSet[0].length;
            var x = Math.floor(Math.random() * xSize);
            var y = Math.floor(Math.random() * ySize);
            if (dataSet[y][x].type === Game.ObjectType.BLANK) {
                return { x: x, y: y };
            }
            else {
                return Utils.createRandomPosition(dataSet);
            }
        };
        Utils.findBlankPosition = function (dataSet) {
            var ySize = dataSet.length;
            var xSize = dataSet[0].length;
            var x = Math.floor(Math.random() * xSize);
            var y = Math.floor(Math.random() * ySize);
            if (dataSet[y][x].type === Game.ObjectType.BLANK) {
                return { x: x, y: y };
            }
            else {
                return Utils.createRandomPosition(dataSet);
            }
        };
        Utils.getOne = function (list) {
            var length = list.length;
            return list[Math.floor(Math.random() * length)];
        };
        Utils.mapDateSet = function (dataSet, callback) {
            var width = dataSet.length;
            var height = dataSet[0].length;
            for (var y = 0; y < width; y++) {
                for (var x = 0; x < height; x++) {
                    callback(x, y);
                }
            }
        };
        return Utils;
    }());
    Game.Utils = Utils;
    var Console = (function () {
        function Console() {
        }
        Console.prototype.log = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            (_a = window.console).log.apply(_a, params);
            var _a;
        };
        Console.prototype.error = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            (_a = window.console).error.apply(_a, params);
            var _a;
        };
        Console.prototype.success = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            (_a = window.console).info.apply(_a, params);
            var _a;
        };
        Console.prototype.clear = function () {
            window.console.clear();
        };
        return Console;
    }());
    Game.Console = Console;
    Game.console = new Console();
    var EventRegister = (function () {
        function EventRegister() {
            this.host = null;
            this.host = document.body;
        }
        EventRegister.prototype.on = function (handleName, callBack) {
            this.host.addEventListener(handleName, callBack);
        };
        EventRegister.prototype.off = function (handleName, callBack) {
            this.host.removeEventListener(handleName, callBack);
        };
        EventRegister.readyToStart = function () {
            var startHandler = function (e) {
                if (e.shiftKey && e.ctrlKey && e.keyCode === Game.KEYCODE.P) {
                    var game = new Game.GameController();
                    game.run();
                    document.body.removeEventListener('keydown', startHandler);
                }
            };
            document.body.addEventListener('keydown', startHandler);
        };
        return EventRegister;
    }());
    Game.EventRegister = EventRegister;
    Game.eventRegister = new EventRegister();
})(Game || (Game = {}));
var Game;
(function (Game) {
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
            this.R = 82;
            this.B = 66;
            this.U = 85;
            this.I = 73;
            this.O = 79;
            this.P = 80;
            this.J = 74;
            this.K = 75;
            this.L = 76;
        }
        return KeyCode;
    }());
    var SymbolChar = (function () {
        function SymbolChar() {
            this.BLANK = '·';
            this.SUBJECT = '♀';
            this.OBSTACLE = 'x';
            this.TARGET = '$';
            this.FOG = '-';
            this.BOMB = 'б';
            this.TORCH = 'i';
            this.LEFT_TOP_CORNER = '┌';
            this.RIGHT_TOP_CORNER = '┐';
            this.LEFT_BOTTOM_CORNER = '└';
            this.RIGHT_BOTTOM_CORNER = '┘';
            this.HORIZONTAL = '-';
            this.VERTICAL = '|';
            this.BLOCK = '■';
            this.UNBRELLA = '☂';
            this.ATOM = '⚛';
            this.YINYANG = '☯';
        }
        SymbolChar.prototype.getPropertySymbol = function (propertyType) {
            switch (propertyType) {
                case Game.PropertyType.bomb:
                    return this.BOMB;
                case Game.PropertyType.torch:
                    return this.TORCH;
            }
        };
        return SymbolChar;
    }());
    Game.KEYCODE = new KeyCode();
    Game.SYMBOL_CHAR = new SymbolChar();
})(Game || (Game = {}));
var Game;
(function (Game) {
    var PropertyType;
    (function (PropertyType) {
        PropertyType[PropertyType["bomb"] = 0] = "bomb";
        PropertyType[PropertyType["torch"] = 1] = "torch";
    })(PropertyType = Game.PropertyType || (Game.PropertyType = {}));
    var Property = (function () {
        function Property() {
            this.type = 0;
            this.sight = 0;
        }
        return Property;
    }());
    Game.Property = Property;
    var PropCreator = (function () {
        function PropCreator() {
            this.MAX_PROP_NUMBER = 1;
            this.props = [];
            this.basket = [
                Bomb,
                Torch,
            ];
            this.possibility = 0.1;
        }
        PropCreator.prototype.create = function (possibility) {
            if (possibility === void 0) { possibility = this.possibility; }
            if (Game.Utils.possibility(possibility)) {
                var prop = new (Game.Utils.getOne(this.basket))();
                return prop;
            }
        };
        return PropCreator;
    }());
    Game.PropCreator = PropCreator;
    var Bomb = (function (_super) {
        __extends(Bomb, _super);
        function Bomb(distance) {
            if (distance === void 0) { distance = 2; }
            var _this = _super.call(this) || this;
            _this.type = PropertyType.bomb;
            _this.distance = 2;
            _this.distance = distance;
            return _this;
        }
        Bomb.prototype.destory = function (x, y, dataSet) {
            for (var j = 0; j < dataSet.length; j++) {
                for (var i = 0; i < dataSet[j].length; i++) {
                    if (!Game.Utils.calcDistance(x, y, i, j, this.distance)) {
                        if (dataSet[j][i].type === Game.ObjectType.OBSTACLE) {
                            dataSet[j][i] = new Game.BlankMO();
                        }
                    }
                }
            }
        };
        return Bomb;
    }(Property));
    Game.Bomb = Bomb;
    var Torch = (function (_super) {
        __extends(Torch, _super);
        function Torch(sight) {
            if (sight === void 0) { sight = 2; }
            var _this = _super.call(this) || this;
            _this.type = PropertyType.torch;
            _this.sight = 2;
            _this.sight = sight;
            return _this;
        }
        return Torch;
    }(Property));
    Game.Torch = Torch;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Cheat = (function () {
        function Cheat() {
        }
        Cheat.registerCheat = function (game) {
            window.giveMeSomeBombs = function () {
                if (game.currentLevel) {
                    Game.console.log('世间没有什么事情是一个炸弹解决不了的。如果有，那就两个。');
                    game.currentLevel.subject.props.push(new Game.Bomb(), new Game.Bomb(), new Game.Bomb(), new Game.Bomb());
                }
            };
            window.bigBomb = function () {
                if (game.currentLevel) {
                    Game.console.log('你仿佛听见雷神在你的掌间轰鸣。');
                    game.currentLevel.subject.props.push(new Game.Bomb(20));
                }
            };
            window.letThereBeLight = function () {
                if (game.currentLevel) {
                    Game.console.log('银河汇聚到了你的手中。');
                    game.currentLevel.subject.props.push(new Game.Torch(15));
                }
            };
        };
        return Cheat;
    }());
    Game.Cheat = Cheat;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var GameInfo = (function () {
        function GameInfo() {
            this.hello = "\n        ------\n        \u6CE8\u610F\uFF1A\u8BF7\u5C06\u9F20\u6807\u79FB\u5230\u9875\u9762\u5185\u70B9\u51FB\u4E00\u4E0B\uFF0C\u624D\u80FD\u4F7F\u7528\u952E\u76D8\u6309\u952E\u3002\n      \n        \u7B26\u53F7\u4ECB\u7ECD\uFF1A\n            " + Game.SYMBOL_CHAR.SUBJECT + " \u4F60\n            " + Game.SYMBOL_CHAR.TARGET + " \u5B9D\u85CF\uFF0C\u6E38\u620F\u76EE\u6807\n            " + Game.SYMBOL_CHAR.BLANK + " \u7A7A\u767D\u533A\u57DF\uFF0C\u53EF\u5B89\u5168\u79FB\u52A8\n            " + Game.SYMBOL_CHAR.OBSTACLE + " \u969C\u788D\u7269\uFF0C\u6478\u5230\u4F1A\u6B7B\n            " + Game.SYMBOL_CHAR.FOG + " \u8FF7\u96FE\n            " + Game.SYMBOL_CHAR.BOMB + " \u70B8\u5F39\n            " + Game.SYMBOL_CHAR.TORCH + " \u706B\u628A\uFF0C\u63D0\u5347\u89C6\u91CE\n      \n        \u6E38\u620F\u6559\u7A0B\uFF1A\n            \u65B9\u5411\u952E/WSAD\uFF1A\u79FB\u52A8\n            ENTER\uFF1A\u5F00\u59CB\u6E38\u620F\n            ESC\uFF1A\u6682\u505C\u6E38\u620F\n            B/\u7A7A\u683C\u952E\uFF1A\u6D88\u8017\u70B8\u5F39\uFF0C\u70B8\u6389\u5468\u56F4\u65B9\u5757\n        \n        \u6309ENTER\u952E\u7EE7\u7EED\u3002\n        ------";
            this.pause = "\u6E38\u620F\u6682\u505C\u3002\u8BF7\u6309[ENTER]\u952E\u7EE7\u7EED\u6E38\u620F\u3002";
            this.gameover = "\u6E38\u620F\u7ED3\u675F\uFF01\u8BF7\u6309[ENTER]\u952E\u91CD\u65B0\u5F00\u59CB\u6E38\u620F\u3002";
            this.gamecontinue = "\u606D\u559C\u60A8\u80DC\u5229\uFF01\u8BF7\u6309[ENTER]\u952E\u8FDB\u5165\u4E0B\u4E00\u5173\u3002";
            this.killedByObstacle = "\u60A8\u649E\u5230\u4E86\u969C\u788D\u7269\u3002";
        }
        return GameInfo;
    }());
    Game.GameInfo = GameInfo;
    Game.gameInfo = new GameInfo();
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["BLANK"] = 0] = "BLANK";
        ObjectType[ObjectType["SUBJECT"] = 1] = "SUBJECT";
        ObjectType[ObjectType["OBSTACLE"] = 2] = "OBSTACLE";
        ObjectType[ObjectType["TARGET"] = 3] = "TARGET";
        ObjectType[ObjectType["PROPS"] = 4] = "PROPS";
        ObjectType[ObjectType["BLOCK"] = 5] = "BLOCK";
    })(ObjectType = Game.ObjectType || (Game.ObjectType = {}));
    var MapObject = (function () {
        function MapObject() {
            this.type = null;
            this.symbol = null;
            this.realOb = true;
        }
        MapObject.prototype.touch = function (subject) {
            return Game.GameSignal.none;
        };
        return MapObject;
    }());
    Game.MapObject = MapObject;
    var BlankMO = (function (_super) {
        __extends(BlankMO, _super);
        function BlankMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = ObjectType.BLANK;
            _this.symbol = Game.SYMBOL_CHAR.BLANK;
            _this.realOb = false;
            return _this;
        }
        return BlankMO;
    }(MapObject));
    Game.BlankMO = BlankMO;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Subject = (function () {
        function Subject() {
            this.x = 0;
            this.y = 0;
            this.props = [];
            this.dataSetMeta = [
                { x: 0, y: 0 },
            ];
            this.dataSet = [];
            this.maxX = 0;
            this.maxY = 0;
            this.minX = 0;
            this.minY = 0;
            this.originalVision = 10;
            this.symbol = Game.SYMBOL_CHAR.SUBJECT;
        }
        Subject.prototype.moveTo = function (x, y, dataSet) {
            var height = dataSet.length;
            var width = dataSet[0].length;
            if (x + this.minX < 0
                || y + this.minY < 0
                || x + this.maxX > width - 1
                || y + this.maxY > height - 1) {
                return;
            }
            if (this.cannotMove(x, y, dataSet)) {
                return;
            }
            this.x = x;
            this.y = y;
            this.computed();
        };
        Subject.prototype.inSelf = function (x, y) {
            return this.dataSet.some(function (position) {
                var sameX = position.x === x;
                var sameY = position.y === y;
                return sameX && sameY;
            });
        };
        Subject.prototype.touch = function (map) {
            var _this = this;
            var signal = [];
            this.dataSet.forEach(function (_a) {
                var x = _a.x, y = _a.y;
                signal.push(map[y][x].touch(_this));
            });
            signal = signal.sort();
            return signal.pop();
        };
        Subject.prototype.computed = function () {
            var xSet = this.dataSetMeta
                .map(function (posision) { return posision.x; })
                .sort(function (a, b) { return a < b ? -1 : 1; });
            var ySet = this.dataSetMeta
                .map(function (posision) { return posision.y; })
                .sort(function (a, b) { return a < b ? -1 : 1; });
            this.minX = xSet[0];
            this.minY = ySet[0];
            this.maxX = xSet[xSet.length - 1];
            this.maxY = ySet[ySet.length - 1];
            this.calcDataSet();
        };
        Subject.prototype.calcDataSet = function () {
            var _this = this;
            this.dataSet = this.dataSetMeta.map(function (posision) { return ({
                x: posision.x + _this.x,
                y: posision.y + _this.y,
            }); });
        };
        Subject.prototype.cannotMove = function (x, y, dataSet) {
            return false;
        };
        return Subject;
    }());
    Game.Subject = Subject;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var GameSignal;
    (function (GameSignal) {
        GameSignal[GameSignal["none"] = 0] = "none";
        GameSignal[GameSignal["continue"] = 1] = "continue";
        GameSignal[GameSignal["clear"] = 2] = "clear";
        GameSignal[GameSignal["over"] = 3] = "over";
    })(GameSignal = Game.GameSignal || (Game.GameSignal = {}));
    var Level = (function () {
        function Level(game) {
            var _this = this;
            this.game = game;
            this.width = 21;
            this.height = 21;
            this.delayTime = 500;
            this.content = '';
            this.levelName = '0';
            this.dataSet = null;
            this.subject = null;
            this.subjectPosition = { x: 0, y: 0 };
            this.isPause = false;
            this.onKeyDown = function (event) {
                _this.order = event.keyCode;
            };
            this.init();
        }
        Level.prototype.init = function () {
            this.subject = new Game.Subject();
            this.reset();
        };
        Level.prototype.reset = function () {
            if (!this.dataSet) {
                this.initMapDataSet();
            }
            this.initSubject();
        };
        Level.prototype.initSubject = function () {
            if (!this.subjectPosition) {
                this.subjectPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
            var _a = this.subjectPosition, x = _a.x, y = _a.y;
            this.subject.moveTo(x, y, this.dataSet);
        };
        Level.prototype.initMapDataSet = function () {
            this.dataSet = [];
            for (var y = 0; y < this.width; y++) {
                this.dataSet[y] = [];
                for (var x = 0; x < this.height; x++) {
                    this.mapDataSetHandle(x, y);
                }
            }
        };
        Level.prototype.mapDataSetHandle = function (x, y) {
            this.dataSet[y][x] = new Game.BlankMO();
        };
        Level.prototype.render = function () {
            Game.console.clear();
            this.content = '';
            this.buildHeader();
            this.buildContent();
            Game.console.log(this.content);
        };
        Level.prototype.buildHeader = function () {
            var header = "\n            \u8FD9\u91CC\u5199header\n            ";
            this.content += header;
            this.content += '\n';
        };
        Level.prototype.buildContent = function () {
            for (var i = 0; i < this.width; i++) {
                if (i === 0) {
                    this.content += (Game.SYMBOL_CHAR.LEFT_TOP_CORNER + Game.SYMBOL_CHAR.HORIZONTAL);
                    this.content += (Game.SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                    this.content += (Game.SYMBOL_CHAR.RIGHT_TOP_CORNER);
                    this.content += '\n';
                }
                for (var j = 0; j < this.height; j++) {
                    if (j === 0) {
                        this.content += Game.SYMBOL_CHAR.VERTICAL + ' ';
                    }
                    this.buildMainObject(i, j);
                    this.content += ' ';
                    if (j === this.height - 1) {
                        this.content += Game.SYMBOL_CHAR.VERTICAL + ' ';
                    }
                }
                this.content += '\n';
                if (i === this.width - 1) {
                    this.content += (Game.SYMBOL_CHAR.LEFT_BOTTOM_CORNER + Game.SYMBOL_CHAR.HORIZONTAL);
                    this.content += (Game.SYMBOL_CHAR.HORIZONTAL.repeat(this.width * 2));
                    this.content += (Game.SYMBOL_CHAR.RIGHT_BOTTOM_CORNER);
                    this.content += '\n';
                }
            }
            this.content = this.content.substr(0, this.content.length - 1);
        };
        Level.prototype.buildMainObject = function (y, x) {
            if (this.subject.x === x && this.subject.y === y) {
                this.content += this.subject.symbol;
            }
            else {
                this.content += this.dataSet[y][x].symbol;
            }
        };
        Level.prototype.processStart = function () {
        };
        Level.prototype.handleControll = function () {
            var keyCode = this.order;
            this.order = null;
            var _a = this.subject, x = _a.x, y = _a.y;
            if (this.isPause) {
                if (keyCode === Game.KEYCODE.P) {
                    this.levelPlay();
                }
                return;
            }
            switch (keyCode) {
                case Game.KEYCODE.P:
                    this.levelPause();
                    return;
                case Game.KEYCODE.R:
                    this.levelReplay();
                    return;
            }
            this.mainKeyHandles(keyCode);
        };
        Level.prototype.mainKeyHandles = function (keyCode) {
            var _a = this.subject, x = _a.x, y = _a.y;
            switch (keyCode) {
                case Game.KEYCODE.A:
                case Game.KEYCODE.LEFT:
                    x -= 1;
                    break;
                case Game.KEYCODE.W:
                case Game.KEYCODE.UP:
                    y -= 1;
                    break;
                case Game.KEYCODE.D:
                case Game.KEYCODE.RIGHT:
                    x += 1;
                    break;
                case Game.KEYCODE.S:
                case Game.KEYCODE.DOWN:
                    y += 1;
                    break;
            }
            this.subject.moveTo(x, y, this.dataSet);
        };
        Level.prototype.check = function () {
            if (this.isPause) {
                return;
            }
            return this.mainChecks();
        };
        Level.prototype.mainChecks = function () {
            var _a = this.subject, x = _a.x, y = _a.y;
            return this.subject.touch(this.dataSet);
        };
        Level.prototype.actions = function () {
            if (this.isPause) {
                return;
            }
            this.mainActions();
        };
        Level.prototype.mainActions = function () {
        };
        Level.prototype.levelPause = function () {
            this.isPause = true;
        };
        Level.prototype.levelPlay = function () {
            this.isPause = false;
        };
        Level.prototype.levelReplay = function () {
            this.reset();
        };
        Level.prototype.unbind = function () {
            Game.eventRegister.off('keydown', this.onKeyDown);
        };
        Level.prototype.bind = function () {
            Game.eventRegister.on('keydown', this.onKeyDown);
        };
        return Level;
    }());
    Game.Level = Level;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var GameMode;
    (function (GameMode) {
        GameMode[GameMode["title"] = 0] = "title";
        GameMode[GameMode["level"] = 1] = "level";
    })(GameMode || (GameMode = {}));
    var GameController = (function () {
        function GameController() {
            var _this = this;
            this.delayTime = 500;
            this.stopId = null;
            this.content = '';
            this.levelList = [];
            this.currentLevel = null;
            this.startTime = 0;
            this.deadTimes = 0;
            this.gameMode = GameMode.title;
            this.onKeyDown = function (event) {
                var keyCode = event.keyCode;
                switch (keyCode) {
                    case Game.KEYCODE.ESC:
                        if (_this.gameMode === GameMode.level) {
                            _this.gameEnd();
                        }
                        break;
                    case Game.KEYCODE.ENTER:
                        if (_this.gameMode === GameMode.title) {
                            _this.gameStart();
                        }
                        break;
                }
            };
            this.initLevelList();
        }
        GameController.prototype.initLevelList = function () {
            this.levelList.push(new Game.DngLevel(this), new Game.RsBlLevel(this));
        };
        GameController.prototype.useLevel = function (level) {
            var oldLevel = this.currentLevel;
            oldLevel ? oldLevel.unbind() : void 0;
            level.bind();
            this.currentLevel = level;
        };
        GameController.prototype.go = function () {
            this.currentLevel ? this.currentLevel.processStart() : null;
            this.handleControll();
            this.render();
            this.check();
            this.currentLevel ? this.currentLevel.actions() : null;
        };
        GameController.prototype.handleControll = function () {
            if (this.gameMode === GameMode.level) {
                this.currentLevel.handleControll();
            }
        };
        GameController.prototype.render = function () {
            if (this.gameMode === GameMode.level) {
                this.currentLevel.render();
            }
            else {
                Game.console.clear();
                this.content = '';
                this.buildContent();
                Game.console.log(this.content);
            }
        };
        GameController.prototype.buildContent = function () {
            this.content += Game.gameInfo.hello;
        };
        GameController.prototype.check = function () {
            if (this.gameMode === GameMode.level) {
                var signal = this.currentLevel.check();
                switch (signal) {
                    case Game.GameSignal.over:
                        return this.gameEnd();
                    case Game.GameSignal.clear:
                        return this.gameClear();
                    case Game.GameSignal.continue:
                        return this.gameContinue();
                }
            }
        };
        GameController.prototype.reset = function () {
            this.content = '';
            this.useLevel(this.levelList[0]);
            this.currentLevel.reset();
        };
        Object.defineProperty(GameController.prototype, "delay", {
            get: function () {
                return this.gameMode === GameMode.level ? this.currentLevel.delayTime : this.delayTime;
            },
            enumerable: true,
            configurable: true
        });
        GameController.prototype.gameStart = function () {
            var _this = this;
            this.gameMode = GameMode.level;
            this.currentLevel.bind();
            this.stopId = setInterval(function () {
                _this.go();
            }, this.delay);
        };
        GameController.prototype.gameEnd = function () {
            this.gameMode = GameMode.title;
            this.reset();
            clearInterval(this.stopId);
            this.stopId = null;
            this.currentLevel.unbind();
            this.render();
            Game.console.error('游戏结束！');
        };
        GameController.prototype.gameContinue = function () {
            var _this = this;
            var levelNum = this.levelList.findIndex(function (item) { return item === _this.currentLevel; });
            var nextLevel = this.levelList[levelNum + 1];
            if (nextLevel) {
                this.useLevel(nextLevel);
            }
            else {
                return this.gameClear();
            }
            Game.console.success('恭喜进入下一关！');
        };
        GameController.prototype.gameClear = function () {
            this.reset();
            this.gameMode = GameMode.title;
            clearInterval(this.stopId);
            this.stopId = null;
            this.render();
            Game.console.success('恭喜通关！');
        };
        GameController.prototype.run = function () {
            Game.Cheat.registerCheat(this);
            Game.eventRegister.on('keydown', this.onKeyDown);
            this.startTime = new Date().getTime();
            if (this.levelList.length) {
                this.useLevel(this.levelList[0]);
            }
            this.render();
        };
        return GameController;
    }());
    Game.GameController = GameController;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ObstacleMO = (function (_super) {
        __extends(ObstacleMO, _super);
        function ObstacleMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = Game.ObjectType.OBSTACLE;
            _this.symbol = Game.SYMBOL_CHAR.OBSTACLE;
            return _this;
        }
        ObstacleMO.prototype.touch = function (subject) {
            return Game.GameSignal.over;
        };
        return ObstacleMO;
    }(Game.MapObject));
    Game.ObstacleMO = ObstacleMO;
    var TargetMO = (function (_super) {
        __extends(TargetMO, _super);
        function TargetMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = Game.ObjectType.TARGET;
            _this.symbol = Game.SYMBOL_CHAR.TARGET;
            return _this;
        }
        TargetMO.prototype.touch = function (subject) {
            return Game.GameSignal.continue;
        };
        return TargetMO;
    }(Game.MapObject));
    Game.TargetMO = TargetMO;
    var PropMO = (function (_super) {
        __extends(PropMO, _super);
        function PropMO(property) {
            var _this = _super.call(this) || this;
            _this.property = property;
            _this.type = Game.ObjectType.PROPS;
            _this.symbol = '';
            _this.isProp = true;
            _this.ontouch = function () { };
            _this.type = _this.property.type;
            _this.symbol = Game.SYMBOL_CHAR.getPropertySymbol(_this.property.type);
            return _this;
        }
        PropMO.prototype.touch = function (subject) {
            subject.props.push(this.property);
            this.ontouch();
            return Game.GameSignal.none;
        };
        return PropMO;
    }(Game.MapObject));
    Game.PropMO = PropMO;
    var PropManager = (function () {
        function PropManager(dataSet) {
            this.dataSet = dataSet;
            this.MAX_PROP_NUMBER = 1;
            this.currentPropsNumber = 0;
            this.basket = [
                Game.Bomb,
                Game.Torch,
            ];
            this.possibility = 0.1;
        }
        PropManager.prototype.create = function (possibility) {
            var _this = this;
            if (possibility === void 0) { possibility = this.possibility; }
            if (Game.Utils.possibility(possibility) && (this.MAX_PROP_NUMBER - this.currentPropsNumber > 0)) {
                var property = new (Game.Utils.getOne(this.basket))();
                var propMO = new PropMO(property);
                var _a = Game.Utils.findBlankPosition(this.dataSet), x_1 = _a.x, y_1 = _a.y;
                propMO.ontouch = function () {
                    _this.dataSet[y_1][x_1] = new Game.BlankMO();
                    _this.currentPropsNumber--;
                };
                this.currentPropsNumber++;
                this.dataSet[y_1][x_1] = propMO;
            }
        };
        PropManager.prototype.removeAllProps = function () {
            var _this = this;
            Game.Utils.mapDateSet(this.dataSet, function (x, y) {
                if (_this.dataSet[y][x].isProp) {
                    _this.dataSet[y][x] = new Game.BlankMO();
                }
            });
        };
        return PropManager;
    }());
    Game.PropManager = PropManager;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var DngSubject = (function (_super) {
        __extends(DngSubject, _super);
        function DngSubject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.x = 0;
            _this.y = 0;
            _this.props = [
                new Game.Bomb(),
            ];
            _this.originalVision = 3;
            _this.symbol = Game.SYMBOL_CHAR.SUBJECT;
            return _this;
        }
        DngSubject.prototype.inSelf = function (x, y) {
            return this.dataSet.some(function (position) {
                var sameX = position.x === x;
                var sameY = position.y === y;
                return sameX && sameY;
            });
        };
        DngSubject.prototype.touch = function (map) {
            var _this = this;
            var signal = [];
            this.dataSet.forEach(function (_a) {
                var x = _a.x, y = _a.y;
                signal.push(map[y][x].touch(_this));
            });
            signal = signal.sort();
            return signal.pop();
        };
        DngSubject.prototype.useBomb = function (dataSet) {
            var _a = this, x = _a.x, y = _a.y;
            var bomb = this.props.find(function (property) { return property.type === Game.PropertyType.bomb; });
            if (bomb) {
                this.props = this.props.filter(function (item) { return item !== bomb; });
                bomb.destory(x, y, dataSet);
            }
        };
        Object.defineProperty(DngSubject.prototype, "vision", {
            get: function () {
                var addonVisionByProps = 0;
                this.props.forEach(function (property) {
                    addonVisionByProps += property.sight;
                });
                return this.originalVision + addonVisionByProps;
            },
            enumerable: true,
            configurable: true
        });
        return DngSubject;
    }(Game.Subject));
    Game.DngSubject = DngSubject;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var DngLevel = (function (_super) {
        __extends(DngLevel, _super);
        function DngLevel(game) {
            var _this = _super.call(this, game) || this;
            _this.game = game;
            _this.width = 21;
            _this.height = 21;
            _this.possibility = 0.2;
            _this.content = '';
            _this.levelName = '0';
            _this.dataSet = null;
            _this.subject = null;
            _this.propManager = new Game.PropManager(_this.dataSet);
            _this.subjectPosition = {
                x: Math.floor(_this.width / 2),
                y: Math.floor(_this.height / 2),
            };
            _this.targetPosition = null;
            _this.isPause = false;
            _this.init();
            return _this;
        }
        DngLevel.prototype.init = function () {
            this.reset();
        };
        DngLevel.prototype.reset = function () {
            this.initMapDataSet();
            this.initSubject();
            this.initTarget();
            this.propManager = new Game.PropManager(this.dataSet);
            this.propManager.removeAllProps();
            this.isPause = false;
        };
        DngLevel.prototype.initSubject = function () {
            if (!this.subjectPosition) {
                this.subjectPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
            var _a = this.subjectPosition, x = _a.x, y = _a.y;
            this.subject = new Game.DngSubject();
            this.subject.moveTo(x, y, this.dataSet);
        };
        DngLevel.prototype.initTarget = function () {
            if (!this.targetPosition) {
                this.targetPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
            var _a = this.targetPosition, x = _a.x, y = _a.y;
            this.dataSet[y][x] = new Game.TargetMO();
        };
        DngLevel.prototype.mapDataSetHandle = function (x, y) {
            if (Game.Utils.possibility(this.possibility)) {
                this.dataSet[y][x] = new Game.ObstacleMO();
            }
            else {
                this.dataSet[y][x] = new Game.BlankMO();
            }
        };
        DngLevel.prototype.buildHeader = function () {
            var header = "\n            \u60A8\u73B0\u5728\u5728\u7B2C" + this.levelName + "\u5173\n            \u60A8\u73B0\u5728\u6709" + this.subject.props.length + "\u4EF6\u9053\u5177\uFF1A\n            \u706B\u628A" + (this.subject.props.filter(function (property) { return property.type === Game.PropertyType.torch; }).length || 0) + "\u4EF6\uFF0C\n            \u70B8\u5F39" + (this.subject.props.filter(function (property) { return property.type === Game.PropertyType.bomb; }).length || 0) + "\u4E2A\u3002\n            ------\n            ";
            this.content += header;
            this.content += '\n';
        };
        DngLevel.prototype.buildMainObject = function (y, x) {
            var currentX = this.subject.x;
            var currentY = this.subject.y;
            if (Game.Utils.calcDistance(currentX, currentY, x, y, this.subject.vision)) {
                this.content += Game.SYMBOL_CHAR.FOG;
            }
            else if (this.subject.inSelf(x, y)) {
                if (this.isPause) {
                    this.content += Game.SYMBOL_CHAR.BLOCK;
                }
                else {
                    this.content += this.subject.symbol;
                }
            }
            else {
                this.content += this.dataSet[y][x].symbol;
            }
        };
        DngLevel.prototype.mainKeyHandles = function (keyCode) {
            var _a = this.subject, x = _a.x, y = _a.y;
            switch (keyCode) {
                case Game.KEYCODE.A:
                case Game.KEYCODE.LEFT:
                    x -= 1;
                    break;
                case Game.KEYCODE.W:
                case Game.KEYCODE.UP:
                    y -= 1;
                    break;
                case Game.KEYCODE.D:
                case Game.KEYCODE.RIGHT:
                    x += 1;
                    break;
                case Game.KEYCODE.S:
                case Game.KEYCODE.DOWN:
                    y += 1;
                    break;
                case Game.KEYCODE.SPACE:
                case Game.KEYCODE.B:
                    this.subject.useBomb(this.dataSet);
                    break;
            }
            this.subject.moveTo(x, y, this.dataSet);
        };
        DngLevel.prototype.mainActions = function () {
            this.propManager.create();
        };
        DngLevel.prototype.mainChecks = function () {
            var _a = this.subject, x = _a.x, y = _a.y;
            return this.subject.touch(this.dataSet);
        };
        return DngLevel;
    }(Game.Level));
    Game.DngLevel = DngLevel;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var BlockMO = (function (_super) {
        __extends(BlockMO, _super);
        function BlockMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = Game.ObjectType.BLOCK;
            _this.symbol = Game.SYMBOL_CHAR.BLOCK;
            return _this;
        }
        return BlockMO;
    }(Game.MapObject));
    Game.BlockMO = BlockMO;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var dataSetMetaList = [
        [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: -1 },
        ],
        [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: -1 },
        ],
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ],
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ],
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
        ],
        [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
        ],
    ];
    var BlockSubject = (function (_super) {
        __extends(BlockSubject, _super);
        function BlockSubject() {
            var _this = _super.call(this) || this;
            _this.symbol = Game.SYMBOL_CHAR.BLOCK;
            _this.randomDataSetMeta();
            _this.computed();
            return _this;
        }
        BlockSubject.prototype.randomDataSetMeta = function () {
            this.dataSetMeta = Game.Utils.getOne(dataSetMetaList);
        };
        BlockSubject.prototype.moveTo = function (x, y, dataSet) {
            var height = dataSet.length;
            var width = dataSet[0].length;
            if (x + this.maxX > width - 1 || x + this.minX < 0) {
                x = this.x;
            }
            if (y + this.maxY > height - 1 || y + this.minY < 0) {
                y = this.y;
            }
            if (this.cannotMove(x, y, dataSet)) {
                return;
            }
            this.x = x;
            this.y = y;
            this.computed();
        };
        BlockSubject.prototype.somethingInSelf = function (dataSet) {
            return this.dataSet.some(function (_a) {
                var x = _a.x, y = _a.y;
                return dataSet[y][x].realOb;
            });
        };
        BlockSubject.prototype.rotate = function (dataSet) {
            var _this = this;
            var newDataMeta = this.dataSetMeta.map(function (position) {
                var x = -position.y;
                var y = position.x;
                return { x: x, y: y };
            });
            var validate = newDataMeta.every(function (_a) {
                var x = _a.x, y = _a.y;
                x += _this.x;
                y += _this.y;
                return dataSet[y] && dataSet[y][x] && dataSet[y][x].type !== Game.ObjectType.BLOCK;
            });
            if (validate) {
                this.dataSetMeta = newDataMeta;
                this.computed();
            }
        };
        BlockSubject.prototype.cannotMove = function (x, y, dataSet) {
            if (x === this.x && y === this.y) {
                return true;
            }
            return this.dataSetMeta.some(function (posision) {
                var X = posision.x + x;
                var Y = posision.y + y;
                return dataSet[Y] && dataSet[Y][X] && dataSet[Y][X].type === Game.ObjectType.BLOCK;
            });
        };
        return BlockSubject;
    }(Game.Subject));
    Game.BlockSubject = BlockSubject;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var RsBlLevel = (function (_super) {
        __extends(RsBlLevel, _super);
        function RsBlLevel(game) {
            var _this = _super.call(this, game) || this;
            _this.game = game;
            _this.width = 21;
            _this.height = 21;
            _this.delayTime = 1000;
            _this.content = '';
            _this.levelName = '0';
            _this.dataSet = null;
            _this.subject = null;
            _this.subjectPosition = { x: 10, y: 1 };
            _this.isPause = false;
            _this.onKeyDown = function (event) {
                _this.order = event.keyCode;
                _this.controll();
            };
            _this.init();
            return _this;
        }
        RsBlLevel.prototype.processStart = function () {
            var _a = this.subject, x = _a.x, y = _a.y;
            y += 1;
            this.subject.moveTo(x, y, this.dataSet);
        };
        RsBlLevel.prototype.controll = function () {
            var keyCode = this.order;
            this.order = null;
            var _a = this.subject, x = _a.x, y = _a.y;
            if (this.isPause) {
                if (keyCode === Game.KEYCODE.P) {
                    this.levelPlay();
                }
                return;
            }
            switch (keyCode) {
                case Game.KEYCODE.P:
                    this.levelPause();
                    return;
                case Game.KEYCODE.R:
                    this.levelReplay();
                    return;
            }
            this.mainKeyHandles(keyCode);
            this.render();
            this.check();
        };
        RsBlLevel.prototype.handleControll = function () { };
        RsBlLevel.prototype.init = function () {
            this.reset();
        };
        RsBlLevel.prototype.reset = function () {
            this.initMapDataSet();
            this.initSubject();
            this.isPause = false;
        };
        RsBlLevel.prototype.initSubject = function () {
            if (!this.subjectPosition) {
                this.subjectPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
            var _a = this.subjectPosition, x = _a.x, y = _a.y;
            this.subject = new Game.BlockSubject();
            this.subject.moveTo(x, y, this.dataSet);
        };
        RsBlLevel.prototype.buildHeader = function () {
            var header = "\n            russia block\n            ------\n            ";
            this.content += header;
            this.content += '\n';
        };
        RsBlLevel.prototype.buildMainObject = function (y, x) {
            var currentX = this.subject.x;
            var currentY = this.subject.y;
            if (currentX === x && currentY === y) {
                this.content += Game.SYMBOL_CHAR.YINYANG;
            }
            else if (this.subject.inSelf(x, y)) {
                this.content += this.subject.symbol;
            }
            else {
                this.content += this.dataSet[y][x].symbol;
            }
        };
        RsBlLevel.prototype.mainKeyHandles = function (keyCode) {
            var _a = this.subject, x = _a.x, y = _a.y;
            switch (keyCode) {
                case Game.KEYCODE.A:
                case Game.KEYCODE.LEFT:
                    x -= 1;
                    break;
                case Game.KEYCODE.W:
                case Game.KEYCODE.UP:
                    break;
                case Game.KEYCODE.D:
                case Game.KEYCODE.RIGHT:
                    x += 1;
                    break;
                case Game.KEYCODE.S:
                case Game.KEYCODE.DOWN:
                    y += 1;
                    break;
                case Game.KEYCODE.SPACE:
                    this.subject.rotate(this.dataSet);
                    break;
            }
            this.subject.moveTo(x, y, this.dataSet);
        };
        RsBlLevel.prototype.mainChecks = function () {
            var _this = this;
            var beStone = this.subject.dataSet.some(function (_a) {
                var x = _a.x, y = _a.y;
                if (!_this.dataSet[y + 1]) {
                    return true;
                }
                if (_this.dataSet[y + 1][x].type === Game.ObjectType.BLOCK) {
                    return true;
                }
                if (_this.dataSet[y][x].type === Game.ObjectType.BLOCK) {
                    return true;
                }
                return false;
            });
            if (beStone) {
                var endSignal_1 = false;
                this.subject.dataSet.forEach(function (_a) {
                    var x = _a.x, y = _a.y;
                    _this.dataSet[y][x] = new Game.BlockMO();
                    if (x === _this.subjectPosition.x && y === _this.subjectPosition.y) {
                        endSignal_1 = true;
                    }
                });
                if (endSignal_1) {
                    return Game.GameSignal.over;
                }
                this.initSubject();
            }
            var markRowIndex = [];
            this.dataSet.forEach(function (row, index) {
                var filled = row.every(function (item) {
                    return item.type === Game.ObjectType.BLOCK;
                });
                if (filled) {
                    markRowIndex.push(index);
                }
            });
            if (markRowIndex.length) {
                markRowIndex.forEach(function (index) {
                    _this.dataSet.splice(index, 1);
                });
                var addNumber = this.height - this.dataSet.length;
                while (addNumber > 0) {
                    var row = [];
                    var width = this.width;
                    while (width > 0) {
                        row.push(new Game.BlankMO());
                        width--;
                    }
                    this.dataSet.unshift(row);
                    addNumber--;
                }
            }
            return Game.GameSignal.none;
        };
        RsBlLevel.prototype.mainActions = function () {
        };
        return RsBlLevel;
    }(Game.Level));
    Game.RsBlLevel = RsBlLevel;
})(Game || (Game = {}));
var game = new Game.GameController();
game.run();
//# sourceMappingURL=game.js.map