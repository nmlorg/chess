import {Bishop, King, Knight, Pawn, Queen, Rook} from './pieces.js';


export class Board {
  constructor() {
    this.rows = [];
  }

  getsquare(x, y) {
    if ((x >= 0) && (y >= 0) && (y < this.rows.length) && (x < this.rows[y].length))
      return this.rows[y][x];
  }

  copy() {
    let board = new this.constructor();
    for (let row of this.rows)
      board.rows.push(row.map(square => square.copy(board)));
    return board;
  }

  reset() {
    this.rows = [
        ['ro', 'kn', 'bi', 'qu', 'ki', 'bi', 'kn', 'ro'],
        ['pa', 'pa', 'pa', 'pa', 'pa', 'pa', 'pa', 'pa'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['pa', 'pa', 'pa', 'pa', 'pa', 'pa', 'pa', 'pa'],
        ['ro', 'kn', 'bi', 'qu', 'ki', 'bi', 'kn', 'ro'],
    ];
    let pieceNames = {
        ro: Rook,
        kn: Knight,
        bi: Bishop,
        qu: Queen,
        ki: King,
        pa: Pawn,
    };
    for (let y = 0; y < this.rows.length; y++) {
      let row = this.rows[y];
      for (let x = 0; x < row.length; x++) {
        let name = row[x];
        let square = row[x] = new Square(this, x, y);
        if (name in pieceNames)
          square.piece = new pieceNames[name](square, y > 3);
      }
    }
  }
}


class Square {
  constructor(board, x, y) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.piece = null;
  }

  copy(board) {
    let square = new this.constructor(board, this.x, this.y);
    if (this.piece)
      square.piece = this.piece.copy(square);
    return square;
  }

  get up() {
    return this.board.getsquare(this.x, this.y - 1);
  }

  get down() {
    return this.board.getsquare(this.x, this.y + 1);
  }

  get left() {
    return this.board.getsquare(this.x - 1, this.y);
  }

  get right() {
    return this.board.getsquare(this.x + 1, this.y);
  }
}
