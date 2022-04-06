export class ChessBoardElement extends HTMLElement {
  constructor(board) {
    super();
    let table = this.appendChild(document.createElement('table'));
    for (let row of board.rows) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let square of row) {
        let td = tr.appendChild(document.createElement('td'));
        td.appendChild(new ChessSquareElement(this, square));
      }
    }
    this.update();
  }

  getsquare(x, y) {
    let rows = this.querySelectorAll('tr');
    return rows[y].querySelectorAll('chess-square')[x];
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
    this.square = square;
    this.addEventListener('mouseover', e => {
      if (!square.piece)
        return;
      this.classList.add('source');
      for (let target of square.piece.legalmoves())
        board.getsquare(target.x, target.y).classList.add('target');
    });
    this.addEventListener('mouseout', e => {
      if (!square.piece)
        return;
      this.classList.remove('source');
      for (let target of square.piece.legalmoves())
        board.getsquare(target.x, target.y).classList.remove('target');
    });
  }

  update() {
    this.textContent = this.square.piece?.constructor.name;
  }
}

customElements.define('chess-square', ChessSquareElement);
