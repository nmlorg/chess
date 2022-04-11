export class Game {
  constructor(board) {
    this.board = board;
    this.player = 0;
  }

  move(from, to) {
    this.board.move(from, to);
    this.player = 1 - this.player;
  }
}
