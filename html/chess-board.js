export class ChessBoardElement extends HTMLElement {
  constructor(game) {
    super();
    this.game = game;
    let table = this.appendChild(document.createElement('table'));
    for (let row of game.board.rows) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let square of row) {
        let td = tr.appendChild(document.createElement('td'));
        td.appendChild(new ChessSquareElement(this, square));
      }
    }
    this.update();
  }

  getsquare(name) {
    return this.querySelector(`chess-square.${name}`);
  }

  update() {
    for (let square of this.querySelectorAll('chess-square'))
      square.update();
  }
}

customElements.define('chess-board', ChessBoardElement);


class ChessSquareElement extends HTMLElement {
  constructor(board, square) {
    super();
    this.board = board;
    this.square = square;
    this.classList.add(square.name);
    this.addEventListener('mouseover', e => {
      if (!this.moves.length)
        return;
      this.classList.add('source');
      for (let target of this.moves)
        board.getsquare(target).classList.add('target');
    });
    this.addEventListener('mouseout', e => {
      if (!this.moves.length)
        return;
      this.classList.remove('source');
      for (let target of this.moves)
        board.getsquare(target).classList.remove('target');
    });
  }

  update() {
    let piece = this.square.piece;
    this.textContent = piece?.constructor.name;
    if (piece?.player != this.board.game.player)
      this.moves = [];
    else
      this.moves = Array.from(piece.legalmoves());
  }
}

customElements.define('chess-square', ChessSquareElement);
