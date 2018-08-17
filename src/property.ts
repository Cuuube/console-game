class Bomb {
  destory(x: number, y: number, dotSet: boolean[][]) {
      if (dotSet[y - 1]) {
          dotSet[y - 1][x] = false
      }
      if (dotSet[y]) {
          dotSet[y][x - 1] = false
          dotSet[y][x] = false
          dotSet[y][x + 1] = false
      }
      if (dotSet[y + 1]) {
          dotSet[y + 1][x] = false
      }
  }
}