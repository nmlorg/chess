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
      let line = lines[y].split(/\s+/);
      for (let x = 0; x < line.length; x++) {
        let square = new Square(this, x, y);
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
  }

  move(from, to) {
    let [fromx, fromy] = lettersToNums_(from);
    let [tox, toy] = lettersToNums_(to);
    let frompiece = this.rows[this.rows.length - fromy - 1][fromx].piece;
    frompiece.moves++;
    this.rows[this.rows.length - toy - 1][tox].piece = frompiece;
    this.rows[this.rows.length - fromy - 1][fromx].piece = null;
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


export function lettersToNums_(letters) {
  let match = letters.match(/^([a-z]+)([0-9]+)$/);
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
