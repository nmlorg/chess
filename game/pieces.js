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
    for (let y of ['up', 'down']) {
      for (let x of ['left', 'right']) {
        let square = this.square[y]?.[x];
        while (square && (!square.piece || square.piece.player != this.player)) {
          yield square.name;
          if (square.piece)
            break;
          square = square[y]?.[x];
        }
      }
    }
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
    let forward = this.square[dir];
    if (!forward)
      return;
    if (!forward.piece) {
      yield forward.name;
      if (!this.moves && forward[dir] && !forward[dir].piece)
        yield forward[dir].name;
    }
    for (let x of ['left', 'right'])
      if (forward[x] && forward[x].piece && (forward[x].piece.player != this.player))
        yield forward[x].name;
    // TODO: https://en.wikipedia.org/wiki/Chess#En_passant
    // TODO: https://en.wikipedia.org/wiki/Chess#Promotion
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
    for (let dir of ['up', 'down', 'left', 'right']) {
      let square = this.square[dir];
      while (square && (!square.piece || square.piece.player != this.player)) {
        yield square.name;
        if (square.piece)
          break;
        square = square[dir];
      }
    }
    // TODO: https://en.wikipedia.org/wiki/Chess#Castling
  }
}
