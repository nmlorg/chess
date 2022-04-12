export class ChessBoardElement extends HTMLElement {
  constructor(game) {
    super();
    this.game = game;
    let table = this.appendChild(document.createElement('table'));
    for (let y = game.board.rows.length - 1; y >= 0; y--) {
      let row = game.board.rows[y];
      let tr = table.appendChild(document.createElement('tr'));
      for (let square of row) {
        let td = tr.appendChild(document.createElement('td'));
        td.appendChild(new ChessSquareElement(this, square));
      }
    }
    this.activeElt = null;
    this.update();
  }

  getsquare(name) {
    return this.querySelector(`chess-square.${name}`);
  }

  update() {
    for (let squareElt of this.querySelectorAll('chess-square'))
      squareElt.update();
  }
}

customElements.define('chess-board', ChessBoardElement);


class ChessSquareElement extends HTMLElement {
  constructor(boardElt, square) {
    super();
    this.boardElt = boardElt;
    this.square = square;
    this.classList.add(square.name);
    this.addEventListener('mouseover', e => {
      if (!this.moves.length)
        return;
      this.classList.add('source');
      for (let target of this.moves)
        boardElt.getsquare(target).classList.add('target');
    });
    this.addEventListener('mouseout', e => {
      if (!this.moves.length)
        return;
      this.classList.remove('source');
      for (let target of this.moves)
        boardElt.getsquare(target).classList.remove('target');
    });
    this.addEventListener('click', e => {
      if (!this.boardElt.activeElt) {
        if (this.moves.length) {
          this.boardElt.activeElt = this;
          this.classList.add('selected');
        }
        return;
      }

      for (let target of this.boardElt.activeElt.moves) {
        if (target == this.square.name) {
          this.boardElt.game.move(this.boardElt.activeElt.square.name, this.square.name);
          this.boardElt.activeElt.classList.remove('selected');
          this.boardElt.activeElt = null;
          this.boardElt.update();
          return;
        }
      }
    });
  }

  update() {
    let piece = this.square.piece;
    this.textContent = piece?.constructor.name;
    if (piece?.player != this.boardElt.game.player)
      this.moves = [];
    else
      this.moves = Array.from(piece.legalmoves());
  }
}

customElements.define('chess-square', ChessSquareElement);
