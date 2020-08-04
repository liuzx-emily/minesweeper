import Cell from './Cell'
import tools from './tools'

class Game {

  constructor(params = {}) {
    this.width = params.width || 9;
    this.height = params.height || 9;
    this.count = params.count || 10;
    this.cells = [];
    for (let row = 0; row <= this.height - 1; row++) {
      for (let col = 0; col <= this.width - 1; col++) {
        const cell = new Cell({ row, col, game: this, isMine: false });
        this.cells.push(cell)
      }
    }
    this.mines = null;  // 点开第一个格子后，再设置雷
    this.openedCount = 0; // 打开了的格子的数量
    this.flaggedCount = 0;  // 标记了的格子的数量
    this.isGameOver = false;
    this.isGameSuccess = false;
    this.gameStartTime = undefined; // 游戏开始时间（翻开第一个格子时）
    this.gameEndTime = undefined; // 游戏成功或者失败时
  }

  // 左键单击：可以打开该方块。如果方块上出现数字，则该数字表示其周围3×3区域中的地雷数；如果无相邻地雷（相当于0），则可以递归地打开与空相邻的方块；如果不幸触雷，则游戏结束。
  clickCell(row, col) {
    if (this.isGameOver || this.isGameSuccess) {
      return;
    }
    let index = row * this.width + col;
    // 这是第一个格子，需要设置雷
    if (!this.mines) {
      this._setMines(index);
      this.gameStartTime = +new Date();
    }
    const cell = this.cells[index];
    if (cell.isOpen || cell.isFlag) {
      return;
    }
    // 打开格子
    this._openCell(cell);
  }

  // 右键单击：在判断为地雷的方块上按下右键，可以标记地雷
  rightClickCell(row, col) {
    if (!this.mines || this.isGameOver || this.isGameSuccess) {
      return;
    }
    let index = row * this.width + col;
    const cell = this.cells[index];
    if (cell.isOpen) {
      return;
    }
    cell.isFlag = !cell.isFlag;
    this.flaggedCount += (cell.isFlag ? 1 : -1);
  }

  // 双击：当双击位置周围已标记雷数等于该位置数字时操作有效，相当于对该数字周围未打开的方块均进行一次左键单击操作。地雷未标记完全时使用双击无效。若数字周围有标错的地雷，则游戏结束，标错的地雷上会显示一个“ ×”
  doubleClickCell(row, col) {
    if (!this.mines || this.isGameOver || this.isGameSuccess) {
      return;
    }
    let index = row * this.width + col;
    const cell = this.cells[index];
    if (!cell.showNearbyMinesCount) {
      return;
    }
    const nearbyCells = this._findNearbyCells(cell);
    const nearbyFlagged = nearbyCells.filter(o => o.isFlag);
    if (cell.nearbyMinesCount === nearbyFlagged.length) {
      const toBeOpenedCells = nearbyCells.filter(o => !o.isFlag && !o.isOpen);
      toBeOpenedCells.forEach(o => {
        this._openCell(o);
      })
    }
  }

  _openCell(cell) {
    // 点开这个格子。如果是雷，游戏结束；不是雷，继续
    cell.isOpen = true;
    this.openedCount++;
    if (cell.isMine) {
      this.isGameOver = true;
      this.gameEndTime = +new Date();
      return
    }
    // 判断是否游戏成功
    if (this.openedCount === this.width * this.height - this.count) {
      this.isGameSuccess = true;
      this.gameEndTime = +new Date();
      return;
    }
    // 计算周围格子的雷的数量
    const nearbyCells = this._findNearbyCells(cell);
    const nearbyMines = nearbyCells.filter(o => o.isMine);
    if (nearbyMines.length === 0) {
      cell.nearbyMinesCount = 0;
      // 如果周围没有雷，则递归地打开与空相邻的方块
      nearbyCells.forEach(nearbyCell => {
        if (!nearbyCell.isOpen) {
          this._openCell(nearbyCell);
        }
      })
    } else {
      // 周围有雷，把周围雷的数量显示出来
      cell.nearbyMinesCount = nearbyMines.length;
      cell.showNearbyMinesCount = true;
    }
  }

  // 找到相邻的cell（最多8个）
  _findNearbyCells(cell) {
    let row = cell.row;
    let col = cell.col;
    let row_col_arr = [[row - 1, col - 1], [row - 1, col], [row - 1, col + 1], [row, col - 1], [row, col + 1], [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],]
      .filter(([row, col]) => row >= 0 && row < this.height && col >= 0 && col < this.width);
    let index_arr = row_col_arr.map(([row, col]) => row * this.width + col);
    let cells = index_arr.map(index => this.cells[index]);
    return cells;
  }

  _setMines(cannotHave) {
    // 随机生成雷
    this.mines = tools.getRandomNumbersInRange(this.count, this.width * this.height, cannotHave)
    this.mines.forEach(index => {
      if (!this.cells[index]) {
        console.log(index);
      }
      this.cells[index].isMine = true;
    })
  }

}
export default Game