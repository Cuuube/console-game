/**
 * 目标是将渲染工作委托给Display类
 * 以后方便在各种介质上展示。
 * 现在耦合很严重。。
 */

namespace Game {
    interface IDisplay {
        render(dataSet: DataSet): void;
        reset(): void;
    }

    class Display {
        private content: string = '';

        render(dataSet: DataSet) {

        }

        reset() {
            this.content = '';
        }
    }
}