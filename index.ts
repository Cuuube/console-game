
/**
* 左上角为x0y0
* 右下角为xnyn
*/


/** 两个问题：
 * 1. 随机刷的道具可能在刺儿上
 * 2. 提示语不友好
 * 3. 开始计时只能从游戏运行时算
 */

// 将入口隐藏，ctrl + shift + p开始游戏
// Game.EventRegister.readyToStart();
// 或者直接开始状态，等待玩家玩
var game = new Game.GameController();
game.run();

