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
    var ObstacleMO = (function (_super) {
        __extends(ObstacleMO, _super);
        function ObstacleMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = ObjectType.OBSTACLE;
            _this.symbol = Game.SYMBOL_CHAR.OBSTACLE;
            return _this;
        }
        ObstacleMO.prototype.touch = function (subject) {
            return Game.GameSignal.over;
        };
        return ObstacleMO;
    }(MapObject));
    Game.ObstacleMO = ObstacleMO;
    var TargetMO = (function (_super) {
        __extends(TargetMO, _super);
        function TargetMO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = ObjectType.TARGET;
            _this.symbol = Game.SYMBOL_CHAR.TARGET;
            return _this;
        }
        TargetMO.prototype.touch = function (subject) {
            return Game.GameSignal.continue;
        };
        return TargetMO;
    }(MapObject));
    Game.TargetMO = TargetMO;
    var PropMO = (function (_super) {
        __extends(PropMO, _super);
        function PropMO(property) {
            var _this = _super.call(this) || this;
            _this.property = property;
            _this.type = ObjectType.PROPS;
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
    }(MapObject));
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
                    _this.dataSet[y_1][x_1] = new BlankMO();
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
                    _this.dataSet[y][x] = new BlankMO();
                }
            });
        };
        return PropManager;
    }());
    Game.PropManager = PropManager;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Subject = (function () {
        function Subject() {
            this.x = 0;
            this.y = 0;
            this.props = [];
            this.originalVision = 10;
            this.symbol = Game.SYMBOL_CHAR.SUBJECT;
        }
        Subject.prototype.moveTo = function (x, y, dataSet) {
            var height = dataSet.length;
            var width = dataSet[0].length;
            if (x < 0
                || y < 0
                || x > width - 1
                || y > height - 1) {
                return;
            }
            this.x = x;
            this.y = y;
        };
        Subject.prototype.inSelf = function (x, y) {
            return this.x === x && this.y === y;
        };
        Subject.prototype.useBomb = function (dataSet) {
            var _a = this, x = _a.x, y = _a.y;
            var bomb = this.props.find(function (property) { return property.type === Game.PropertyType.bomb; });
            if (bomb) {
                this.props = this.props.filter(function (item) { return item !== bomb; });
                bomb.destory(x, y, dataSet);
            }
        };
        Object.defineProperty(Subject.prototype, "vision", {
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
        return Subject;
    }());
    Game.Subject = Subject;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var GameSignal;
    (function (GameSignal) {
        GameSignal[GameSignal["none"] = 0] = "none";
        GameSignal[GameSignal["over"] = 1] = "over";
        GameSignal[GameSignal["continue"] = 2] = "continue";
        GameSignal[GameSignal["clear"] = 3] = "clear";
    })(GameSignal = Game.GameSignal || (Game.GameSignal = {}));
    var Level = (function () {
        function Level(game) {
            var _this = this;
            this.game = game;
            this.width = 21;
            this.height = 21;
            this.content = '';
            this.levelName = '0';
            this.dataSet = null;
            this.subject = null;
            this.propManager = new Game.PropManager(this.dataSet);
            this.subjectPosition = null;
            this.targetPosition = null;
            this.onKeyDown = function (event) {
                _this.order = event.keyCode;
            };
            this.subject = new Game.Subject();
            this.reset();
        }
        Level.prototype.reset = function () {
            if (!this.dataSet) {
                this.initMapDataSet();
            }
            this.initSubject();
            this.propManager = new Game.PropManager(this.dataSet);
            this.propManager.removeAllProps();
        };
        Level.prototype.initSubject = function () {
            if (!this.subjectPosition) {
                this.subjectPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
            var _a = this.subjectPosition, x = _a.x, y = _a.y;
            this.subject.moveTo(x, y, this.dataSet);
        };
        Level.prototype.initTarget = function () {
            if (!this.targetPosition) {
                this.targetPosition = Game.Utils.findBlankPosition(this.dataSet);
            }
        };
        Level.prototype.initMapDataSet = function () {
            this.dataSet = [];
            for (var y_2 = 0; y_2 < this.width; y_2++) {
                this.dataSet[y_2] = [];
                for (var x_2 = 0; x_2 < this.height; x_2++) {
                    if (Game.Utils.possibility(0.2)) {
                        this.dataSet[y_2][x_2] = new Game.ObstacleMO();
                    }
                    else {
                        this.dataSet[y_2][x_2] = new Game.BlankMO();
                    }
                }
            }
            this.initTarget();
            var _a = this.targetPosition, x = _a.x, y = _a.y;
            this.dataSet[y][x] = new Game.TargetMO();
        };
        Level.prototype.render = function () {
            Game.console.clear();
            this.content = '';
            this.buildHeader();
            this.buildContent();
            Game.console.log(this.content);
        };
        Level.prototype.buildHeader = function () {
            var header = "\n            \u60A8\u73B0\u5728\u5728\u7B2C" + this.levelName + "\u5173\n            \u60A8\u73B0\u5728\u6709" + this.subject.props.length + "\u4EF6\u9053\u5177\uFF1A\n            \u706B\u628A" + (this.subject.props.filter(function (property) { return property.type === Game.PropertyType.torch; }).length || 0) + "\u4EF6\uFF0C\n            \u70B8\u5F39" + (this.subject.props.filter(function (property) { return property.type === Game.PropertyType.bomb; }).length || 0) + "\u4E2A\u3002\n            ------\n            ";
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
            var currentX = this.subject.x;
            var currentY = this.subject.y;
            if (Game.Utils.calcDistance(currentX, currentY, x, y, this.subject.vision)) {
                this.content += Game.SYMBOL_CHAR.FOG;
            }
            else if (this.subject.inSelf(x, y)) {
                this.content += this.subject.symbol;
            }
            else {
                this.content += this.dataSet[y][x].symbol;
            }
        };
        Level.prototype.handleControll = function () {
            var keyCode = this.order;
            var _a = this.subject, x = _a.x, y = _a.y;
            this.order = null;
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
        Level.prototype.check = function () {
            var _a = this.subject, x = _a.x, y = _a.y;
            return this.dataSet[y][x].touch(this.subject);
        };
        Level.prototype.otherActions = function () {
            this.propManager.create();
        };
        Level.prototype.levelPause = function () {
        };
        Level.prototype.levelPlay = function () {
        };
        Level.prototype.levelReplay = function () {
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
            this.levelList.push(new Game.Level(this));
        };
        GameController.prototype.useLevel = function (level) {
            var oldLevel = this.currentLevel;
            oldLevel ? oldLevel.unbind() : void 0;
            level.bind();
            this.currentLevel = level;
        };
        GameController.prototype.go = function () {
            this.handleControll();
            this.render();
            this.check();
            this.currentLevel ? this.currentLevel.otherActions() : null;
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
        GameController.prototype.gameStart = function () {
            var _this = this;
            this.gameMode = GameMode.level;
            this.stopId = setInterval(function () {
                _this.go();
            }, this.delayTime);
        };
        GameController.prototype.gameEnd = function () {
            this.gameMode = GameMode.title;
            this.reset();
            clearInterval(this.stopId);
            this.stopId = null;
            this.render();
            Game.console.error('游戏结束！');
        };
        GameController.prototype.gameContinue = function () {
            var _this = this;
            var levelNum = this.levelList.findIndex(function (item) { return item === _this.currentLevel; });
            var nextLevel = this.levelList[levelNum + 1];
            if (nextLevel) {
                this.currentLevel = nextLevel;
            }
            else {
                return this.gameClear();
            }
            clearInterval(this.stopId);
            this.stopId = null;
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
var game = new Game.GameController();
game.run();
//# sourceMappingURL=game.js.map