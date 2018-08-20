namespace Game {
    export class GameInfo {
        hello = `
        ------
        注意：请将鼠标移到页面内点击一下，才能使用键盘按键。
      
        符号介绍：
            ${SYMBOL_CHAR.SUBJECT} 你
            ${SYMBOL_CHAR.TARGET} 宝藏，游戏目标
            ${SYMBOL_CHAR.BLANK} 空白区域，可安全移动
            ${SYMBOL_CHAR.OBSTACLE} 障碍物，摸到会死
            ${SYMBOL_CHAR.FOG} 迷雾
            ${SYMBOL_CHAR.BOMB} 炸弹
            ${SYMBOL_CHAR.TORCH} 火把，提升视野
      
        游戏教程：
            方向键/WSAD：移动
            ENTER：开始游戏
            ESC：暂停游戏
            B/空格键：消耗炸弹，炸掉周围方块
        
        按ENTER键继续。
        ------`
        pause = `游戏暂停。请按[ENTER]键继续游戏。`
        gameover = `游戏结束！请按[ENTER]键重新开始游戏。`
        gamecontinue = `恭喜您胜利！请按[ENTER]键进入下一关。`
        killedByObstacle = `您撞到了障碍物。`
    }
    
    export const gameInfo = new GameInfo();
}
