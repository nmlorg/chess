class Piece {
  constructor(square, player) {
    this.square = square;
    this.player = player;
    this.moves = 0;
  }

  copy(square) {
    let piece = new this.constructor(square, this.player);
    piece.moves = this.moves;
    return piece;
  }
}


export class Bishop extends Piece {
  *legalmoves() {
  }
}


export class King extends Piece {
  *legalmoves() {
  }
}


export class Knight extends Piece {
  *legalmoves() {
    for (let y of ['up', 'down']) {
      for (let x of ['left', 'right']) {
        let square = this.square[y]?.[y]?.[x];
        if (square && (square.piece?.player != this.player))
          yield square;
        square = this.square[y]?.[x]?.[x];
        if (square && (square.piece?.player != this.player))
          yield square;
      }
    }
  }
}


export class Pawn extends Piece {
  *legalmoves() {
    let dir = this.player ? 'up' : 'down';
    if (this.square[dir] && !this.square[dir].piece) {
      yield this.square[dir];
      if (!this.moves && this.square[dir][dir] && !this.square[dir][dir].piece)
        yield this.square[dir][dir];
    }
  }
}


export class Queen extends Piece {
  *legalmoves() {
  }
}


export class Rook extends Piece {
  *legalmoves() {
  }
}
