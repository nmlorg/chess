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

  serialize() {
    let namerows = [];
    let namelen = 0;
    for (let row of this.rows) {
      let namerow = [];
      namerows.push(namerow);
      for (let square of row) {
        if (!square.piece) {
          namerow.push('.');
          continue;
        }
        let piece = square.piece;
        let name;
        if (piece instanceof Knight)
          name = 'N';
        else
          name = piece.constructor.name[0];
        if (!piece.player)
          name = name.toLowerCase();
        if (piece.moves)
          name += piece.moves;
        namerow.push(name);
        if (name.length > namelen)
          namelen = name.length;
      }
    }
    for (let i = 0; i < namerows.length; i++) {
      let namerow = namerows[i];
      for (let j = 0; j < namerow.length - 1; j++)
        namerow[j] = namerow[j].padEnd(namelen, ' ');
      namerows[i] = namerow.join(' ');
    }
    return namerows.join('\n');
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
