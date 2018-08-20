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
  Utils.createRandomPosition = function (xSize, ySize, dotSet) {
      var x = Math.floor(Math.random() * xSize);
      var y = Math.floor(Math.random() * ySize);
      if (dotSet[y][x]) {
          return Utils.createRandomPosition(xSize, ySize, dotSet);
      }
      else {
          return { x: x, y: y };
      }
  };
  return Utils;
}());
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
  SymbolChar.prototype.getPropertySymbol = function (string) {
      return this[string.toUpperCase()];
  };
  return SymbolChar;
}());
var KEYCODE = new KeyCode();
var SYMBOL_CHAR = new SymbolChar();
var Property = (function () {
  function Property() {
      this.type = '';
      this.sight = 0;
  }
  return Property;
}());
var Bomb = (function (_super) {
  __extends(Bomb, _super);
  function Bomb(distance) {
      if (distance === void 0) { distance = 2; }
      var _this = _super.call(this) || this;
      _this.type = 'bomb';
      _this.distance = 2;
      _this.distance = distance;
      return _this;
  }
  Bomb.prototype.destory = function (x, y, dotSet) {
      for (var j = 0; j < dotSet.length; j++) {
          for (var i = 0; i < dotSet[j].length; i++) {
              if (!Utils.calcDistance(x, y, i, j, this.distance)) {
                  dotSet[j][i] = false;
              }
          }
      }
  };
  return Bomb;
}(Property));
var Torch = (function (_super) {
  __extends(Torch, _super);
  function Torch(sight) {
      if (sight === void 0) { sight = 2; }
      var _this = _super.call(this) || this;
      _this.type = 'torch';
      _this.sight = 2;
      _this.sight = sight;
      return _this;
  }
  return Torch;
}(Property));
var GameInfo = (function () {
  function GameInfo() {
      this.hello = "\n  ------\n  \u6CE8\u610F\uFF1A\u8BF7\u5C06\u9F20\u6807\u79FB\u5230\u9875\u9762\u5185\u70B9\u51FB\u4E00\u4E0B\uFF0C\u624D\u80FD\u4F7F\u7528\u952E\u76D8\u6309\u952E\u3002\n\n  \u7B26\u53F7\u4ECB\u7ECD\uFF1A\n      " + SYMBOL_CHAR.SUBJECT + " \u4F60\n      " + SYMBOL_CHAR.TARGET + " \u5B9D\u85CF\uFF0C\u6E38\u620F\u76EE\u6807\n      " + SYMBOL_CHAR.BLANK + " \u7A7A\u767D\u533A\u57DF\uFF0C\u53EF\u5B89\u5168\u79FB\u52A8\n      " + SYMBOL_CHAR.OBSTACLE + " \u969C\u788D\u7269\uFF0C\u6478\u5230\u4F1A\u6B7B\n      " + SYMBOL_CHAR.FOG + " \u8FF7\u96FE\n      " + SYMBOL_CHAR.BOMB + " \u70B8\u5F39\n      " + SYMBOL_CHAR.TORCH + " \u706B\u628A\uFF0C\u63D0\u5347\u89C6\u91CE\n\n  \u6E38\u620F\u6559\u7A0B\uFF1A\n      \u65B9\u5411\u952E/WSAD\uFF1A\u79FB\u52A8\n      ENTER\uFF1A\u5F00\u59CB\u6E38\u620F\n      ESC\uFF1A\u6682\u505C\u6E38\u620F\n      B/\u7A7A\u683C\u952E\uFF1A\u6D88\u8017\u70B8\u5F39\uFF0C\u70B8\u6389\u5468\u56F4\u65B9\u5757\n  \n  \u6309ENTER\u952E\u7EE7\u7EED\u3002\n  ------";
      this.pause = "\u6E38\u620F\u6682\u505C\u3002\u8BF7\u6309[ENTER]\u952E\u7EE7\u7EED\u6E38\u620F\u3002";
      this.gameover = "\u6E38\u620F\u7ED3\u675F\uFF01\u8BF7\u6309[ENTER]\u952E\u91CD\u65B0\u5F00\u59CB\u6E38\u620F\u3002";
      this.gamecontinue = "\u606D\u559C\u60A8\u80DC\u5229\uFF01\u8BF7\u6309[ENTER]\u952E\u8FDB\u5165\u4E0B\u4E00\u5173\u3002";
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
var byLevel = [
  { propertyAppear: 0.1, obstacle: 0.2 },
  { propertyAppear: 0.05, obstacle: 0.25 },
  { propertyAppear: 0.02, obstacle: 0.3 },
  { propertyAppear: 0.01, obstacle: 0.4 },
];
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
      this.currentX = 0;
      this.currentY = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.properties = [];
      this.property = null;
      this.content = '';
      this.dotSet = [];
      this.level = 0;
      this.startTime = 0;
      this.deadTimes = 0;
      this.onKeyDown = function (event) {
          _this.order = event.keyCode;
      };
      this.currentX = this.originX;
      this.currentY = this.originY;
      this.targetX = 0;
      this.targetY = 0;
      this.stopId = null;
      this.order = null;
      this.content = '';
      this.dotSet = [];
      this.initDotSet();
      this.randomPosition('current');
      this.randomPosition('target');
  }
  Object.defineProperty(Game.prototype, "bombList", {
      get: function () {
          return this.properties.filter(function (item) { return item.type === 'bomb'; });
      },
      enumerable: true,
      configurable: true
  });
  Object.defineProperty(Game.prototype, "scene", {
      get: function () {
          var sightByProperty = 0;
          this.properties.forEach(function (property) {
              sightByProperty += property.sight;
          });
          return this.originScene + sightByProperty;
      },
      enumerable: true,
      configurable: true
  });
  Game.prototype.initDotSet = function () {
      for (var y = 0; y < this.width; y++) {
          this.dotSet[y] = [];
          for (var x = 0; x < this.height; x++) {
              if (Utils.possibility(byLevel[this.level].obstacle)) {
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
  Game.prototype.createRandomProperty = function () {
      if (this.property) {
          return;
      }
      if (Utils.possibility(byLevel[this.level].propertyAppear)) {
          var _a = Utils.createRandomPosition(this.width, this.height, this.dotSet), x = _a.x, y = _a.y;
          this.property = {
              x: x, y: y,
              object: Utils.possibility(0.5) ? new Torch() : new Bomb()
          };
      }
  };
  Game.prototype.go = function () {
      this.handleControll();
      this.render();
      this.check();
      this.createRandomProperty();
  };
  Game.prototype.reset = function (clearAll) {
      if (clearAll === void 0) { clearAll = false; }
      this.content = '';
      this.order = null;
      this.initDotSet();
      this.randomPosition('current');
      this.randomPosition('target');
      if (clearAll) {
          this.properties = [];
          this.property = null;
          this.level = 0;
      }
  };
  Game.prototype.render = function () {
      console.clear();
      this.content = '';
      this.buildHeader();
      this.buildContent();
      this.log(logMode.log, this.content);
  };
  Game.prototype.buildHeader = function () {
      var header = "\u60A8\u73B0\u5728\u5728\u7B2C" + (this.level + 1) + "\u5173\n\u60A8\u73B0\u5728\u6709" + this.properties.length + "\u4EF6\u9053\u5177\uFF1A\n\u706B\u628A" + (this.properties.filter(function (property) { return property.type === 'torch'; }).length || 0) + "\u4EF6\uFF0C\n\u70B8\u5F39" + (this.properties.filter(function (property) { return property.type === 'bomb'; }).length || 0) + "\u4E2A\u3002\n------\n";
      this.content += header;
  };
  Game.prototype.buildContent = function () {
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
      if (Utils.calcDistance(this.currentX, this.currentY, x, y, this.scene)) {
          this.content += SYMBOL_CHAR.FOG;
      }
      else if (y === this.currentY && x === this.currentX) {
          this.content += SYMBOL_CHAR.SUBJECT;
      }
      else if (y === this.targetY && x === this.targetX) {
          this.content += SYMBOL_CHAR.TARGET;
      }
      else if (this.property
          && y === this.property.y
          && x === this.property.x) {
          this.content += SYMBOL_CHAR.getPropertySymbol(this.property.object.type);
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
              var bomb_1 = this.properties.find(function (property) { return property.type === 'bomb'; });
              if (bomb_1) {
                  this.properties = this.properties.filter(function (item) { return item !== bomb_1; });
                  bomb_1.destory(this.currentX, this.currentY, this.dotSet);
              }
              break;
      }
  };
  Game.prototype.check = function () {
      var gameEndMode = null;
      var gameoverReason = '';
      var lMode = logMode.error;
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
          }
          else {
              gameEndMode = 'gamecontinue';
              gameoverReason = gameInfo.gamecontinue;
          }
      }
      if (this.property && this.currentX === this.property.x && this.currentY === this.property.y) {
          this.properties.push(this.property.object);
          this.property = null;
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
      this.reset(true);
      this.body.removeEventListener('keydown', this.onKeyDown);
      clearInterval(this.stopId);
      this.stopId = null;
      this.deadTimes += 1;
  };
  Game.prototype.gameContinue = function () {
      this.reset();
      this.level += 1;
      this.body.removeEventListener('keydown', this.onKeyDown);
      clearInterval(this.stopId);
      this.stopId = null;
  };
  Game.prototype.gameClear = function () {
      this.reset(true);
      this.body.removeEventListener('keydown', this.onKeyDown);
      clearInterval(this.stopId);
      this.stopId = null;
      var endTime = new Date().getTime();
      this.log(logMode.success, "\u606D\u559C\u901A\u5173\uFF01\u6B64\u6B21\u901A\u5173\u65F6\u95F4\u4E3A" + (endTime - this.startTime) / 1000 + "\u79D2\uFF01\u6B7B\u4EA1" + this.deadTimes + "\u6B21\u3002");
      this.startTime = new Date().getTime();
      this.deadTimes = 0;
  };
  Game.prototype.gamePause = function () {
      this.body.removeEventListener('keydown', this.onKeyDown);
      clearInterval(this.stopId);
      this.stopId = null;
      console.warn(gameInfo.pause);
  };
  Game.prototype.run = function () {
      var _this = this;
      this.startTime = new Date().getTime();
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
  Object.defineProperty(Game.prototype, "body", {
      get: function () {
          return document.body;
      },
      enumerable: true,
      configurable: true
  });
  return Game;
}());
window.giveMeSomeBombs = function () {
  console.log('世间没有什么事情是一个炸弹解决不了的。如果有，那就两个。');
  game.properties.push(new Bomb(), new Bomb(), new Bomb(), new Bomb());
};
window.bigBomb = function () {
  console.log('你仿佛听见雷神在你的掌间轰鸣。');
  game.properties.push(new Bomb(20));
};
window.letThereBeLight = function () {
  console.log('银河汇聚到了你的手中。');
  game.properties.push(new Torch(15));
};
var game = new Game();
game.run();
//# sourceMappingURL=game.js.map