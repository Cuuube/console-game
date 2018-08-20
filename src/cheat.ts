namespace Game {
    export class Cheat {
        static registerCheat(game: GameController) {
            (window as any).giveMeSomeBombs = () => {
                if (game.currentLevel) {
                    console.log('世间没有什么事情是一个炸弹解决不了的。如果有，那就两个。');
                    game.currentLevel.subject.props.push(new Bomb(), new Bomb(), new Bomb(), new Bomb());
                }
                
            }
            
            (window as any).bigBomb = () => {
                if (game.currentLevel) {
                    console.log('你仿佛听见雷神在你的掌间轰鸣。');
                    game.currentLevel.subject.props.push(new Bomb(20));
                }
            }
            
            (window as any).letThereBeLight = () => {
                if (game.currentLevel) {
                    console.log('银河汇聚到了你的手中。');
                    game.currentLevel.subject.props.push(new Torch(15));
                }
            }
        }
    }
    
}