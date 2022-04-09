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

  load(str) {
    let pieceNames = {
        r: Rook,
        n: Knight,
        b: Bishop,
        q: Queen,
        k: King,
        p: Pawn,
    };

    this.rows = [];
    let lines = str.trim().replace(/\r\n/g, '\n').split('\n');
    if (!lines[0])  // ''.split('\n') == ['']
      return;
    this.rows.length = lines.length;
    for (let y = 0; y < lines.length; y++) {
      let row = this.rows[y] = [];
      let line = lines[y].split(/\s+/);
      for (let x = 0; x < line.length; x++) {
        let square = new Square(this, x, y);
        row.push(square);
        let desc = line[x];
        if (desc == '.')
          continue;
        let namelower = desc[0].toLowerCase();
        let piece = new pieceNames[namelower](square, namelower != desc[0]);
        square.piece = piece;
        if (desc.length > 1)
          piece.moves = Number(desc.substr(1));
      }
    }
  }

  reset() {
    this.load(`\
r n b q k b n r
p p p p p p p p
. . . . . . . .
. . . . . . . .
. . . . . . . .
. . . . . . . .
P P P P P P P P
R N B Q K B N R`);
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


export function numToLetters_(num) {
  // See https://github.com/nmlorg/chess/issues/1.
  let letters = String.fromCharCode(97 + num % 26);
  num = Math.floor(num / 26);
  while (num) {
    letters = `${String.fromCharCode(97 + num % 26 - 1)}${letters}`;
    num = Math.floor(num / 26);
  }
  return letters;
}


class Square {
  constructor(board, x, y) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.name = `${numToLetters_(x)}${board.rows.length - y}`;
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
