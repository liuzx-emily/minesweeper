class Cell {

  constructor(params = {}) {
    this.row = params.row;
    this.col = params.col;
    // this.game = params.game;
    this.isMine = params.isMine;  // 是地雷吗
    this.isOpen = false;  // 翻开了吗
    this.isFlag = false;  // 插旗子了吗
    this.nearbyMinesCount = undefined;  // 周围地雷的数量（打开格子的时候再计算）
    this.showNearbyMinesCount = false;  // 是否显示周围地雷的数量（格子已经打开，并且周围地雷的数量大于0时，才显示）
  }

}
export default Cell