class KeyCode {
  UP: number = 38;
  DOWN: number = 40;
  LEFT: number = 37;
  RIGHT: number = 39;
  ENTER: number = 13;
  ESC: number = 27;
  SPACE: number = 32;

  ONE: number = 49;
  TWO: number = 50;
  TRHEE: number = 51;
  FOUR: number = 52;
  FIVE: number = 53;
  SIX: number = 54;
  SEVEN: number = 55;
  EIGHT: number = 56;
  NINE: number = 57;
  ZERO: number = 48;

  W: number = 87;
  A: number = 65;
  S: number = 83;
  D: number = 68;

  B: number = 66;

  U: number = 85;
  I: number = 73;
  O: number = 79;
  J: number = 74;
  K: number = 75;
  L: number = 76;
}

class SymbolChar {
  BLANK: string = '·'  // 空白画布字符
  SUBJECT: string = '♀'   // 玩家控制实体的字符
  OBSTACLE: string = 'x' // 障碍物符号
  TARGET: string = '$'
  FOG: string = '-'
  BOMB: string = 'б'
  TORCH: string = 'i'

  LEFT_TOP_CORNER: string = '┌'   // 画布制表符
  RIGHT_TOP_CORNER: string = '┐'   // 画布制表符
  LEFT_BOTTOM_CORNER: string = '└'   // 画布制表符
  RIGHT_BOTTOM_CORNER: string = '┘'   // 画布制表符
  HORIZONTAL: string = '-'   // 画布制表符
  VERTICAL: string = '|'   // 画布制表符

  getPropertySymbol(string: string) {
    return (this as any)[string.toUpperCase()]
  }
}

const KEYCODE = new KeyCode();
const SYMBOL_CHAR = new SymbolChar();