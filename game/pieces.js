class Piece {
  constructor(square, player) {
    this.square = square;
    this.player = player;
    this.moves = 0;
  }
}


export class Bishop extends Piece {
  static ascii = ['B', 'b'];
  static glyph = ['\u2657', '\u265d'];

  *legalmoves() {
  }
}


export class King extends Piece {
  static ascii = ['K', 'k'];
  static glyph = ['\u2654', '\u265a'];

  *legalmoves() {
  }
}


export class Knight extends Piece {
  static ascii = ['N', 'n'];
  static glyph = ['\u2658', '\u265e'];

  *legalmoves() {
    for (let y of ['up', 'down']) {
      for (let x of ['left', 'right']) {
        let square = this.square[y]?.[y]?.[x];
        if (square && (square.piece?.player != this.player))
          yield square.name;
        square = this.square[y]?.[x]?.[x];
        if (square && (square.piece?.player != this.player))
          yield square.name;
      }
    }
  }
}


export class Pawn extends Piece {
  static ascii = ['P', 'p'];
  static glyph = ['\u2659', '\u265f'];

  *legalmoves() {
    let dir = this.player ? 'down' : 'up';
    if (this.square[dir] && !this.square[dir].piece) {
      yield this.square[dir].name;
      if (!this.moves && this.square[dir][dir] && !this.square[dir][dir].piece)
        yield this.square[dir][dir].name;
    }
  }
}


export class Queen extends Piece {
  static ascii = ['Q', 'q'];
  static glyph = ['\u2655', '\u265b'];

  *legalmoves() {
  }
}


export class Rook extends Piece {
  static ascii = ['R', 'r'];
  static glyph = ['\u2656', '\u265c'];

  *legalmoves() {
  }
}
