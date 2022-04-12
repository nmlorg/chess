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
    board.load(this.serialize());
    return board;
  }

  *legalmoves(player) {
    for (let row of this.rows)
      for (let square of row)
        if (square.piece?.player == player)
          for (let move of square.piece.legalmoves())
            yield [square.name, move];
  }

  load(str) {
    let pieceTypes = [Bishop, King, Knight, Pawn, Queen, Rook];
    this.rows = [];
    let lines = str.trim().replace(/\r\n/g, '\n').split('\n');
    if (!lines[0])  // ''.split('\n') == ['']
      return;
    this.rows.length = lines.length;
    for (let y = 0; y < lines.length; y++) {
      let row = this.rows[y] = [];
      let line = lines[lines.length - 1 - y].split(/\s+/);
      for (let x = 0; x < line.length; x++) {
        let square = new Square(Position.fromXY(x, y));
        row.push(square);
        let desc = line[x];
        let piece = null;
        for (let pieceType of pieceTypes) {
          let player = pieceType.ascii.indexOf(desc[0]);
          if (player != -1) {
            piece = new pieceType(square, player);
            break;
          }
        }
        if (!piece)
          continue;
        square.piece = piece;
        if (desc.length > 1)
          piece.moves = Number(desc.substr(1));
      }
    }

    let height = this.rows.length;
    let width = this.rows[0].length;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let square = this.rows[y][x];
        if (x > 0)
          square.left = this.rows[y][x - 1];
        if (x < width - 1)
          square.right = this.rows[y][x + 1];
        if (y > 0)
          square.down = this.rows[y - 1][x];
        if (y < height - 1)
          square.up = this.rows[y + 1][x];
      }
    }
  }

  get(position) {
    let [x, y] = Position.toXY(position);
    return this.rows[y][x];
  }

  move(from, to) {
    let fromsquare = this.get(from);
    let tosquare = this.get(to);
    let piece = fromsquare.piece;
    if (piece) {
      piece.moves++;
      piece.square = tosquare;
      tosquare.piece = piece;
      fromsquare.piece = null;
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
      namerows.unshift(namerow);
      for (let square of row) {
        if (!square.piece) {
          namerow.push('.');
          continue;
        }
        let piece = square.piece;
        let name = piece.constructor.ascii[piece.player];
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


export class Position {
  static fromXY(x, y) {
    // See https://github.com/nmlorg/chess/issues/1.
    let letters = String.fromCharCode(97 + x % 26);
    x = Math.floor(x / 26);
    while (x) {
      letters = `${String.fromCharCode(97 + x % 26 - 1)}${letters}`;
      x = Math.floor(x / 26);
    }
    return `${letters}${y + 1}`;
  }

  static toXY(str) {
    let match = str.match(/^([a-z]+)([0-9]+)$/);
    if (!match)
      return [-1, -1];

    let col = 0;
    for (let i = 0; i < match[1].length; i++) {
      col *= 26;
      col += match[1].charCodeAt(i) - 97 + 1;
    }

    let row = Number(match[2]);
    return [col - 1, row - 1];
  }
}


class Square {
  down = null;
  left = null;
  piece = null;
  right = null;
  up = null;

  constructor(name) {
    this.name = name;
  }
}
