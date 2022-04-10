export class Game {
  constructor(board) {
    this.board = board;
    this.player = true;
  }

  move(from, to) {
    this.board.move(from, to);
    this.player = !this.player;
  }
}
