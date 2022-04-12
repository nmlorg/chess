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
    let attacks = {};

    for (let squareElt of this.querySelectorAll('chess-square')) {
      squareElt.classList.remove('black-attacked');
      squareElt.classList.remove('white-attacked');
      squareElt.classList.remove('attacking');
      squareElt.update(attacks);
    }

    for (let [target, attackers] of Object.entries(attacks)) {
      let squareElt = this.getsquare(target);
      squareElt.title = `${squareElt.title}\n\nAttacked from:`;
      for (let attacker of attackers) {
        squareElt.title = `${squareElt.title}\n \u2022 ${attacker}`;
        if (this.getsquare(attacker).square.piece.player)
          squareElt.classList.add('black-attacked');
        else
          squareElt.classList.add('white-attacked');
      }
    }
  }
}

customElements.define('chess-board', ChessBoardElement);


class ChessSquareElement extends HTMLElement {
  constructor(boardElt, square) {
    super();
    this.boardElt = boardElt;
    this.square = square;
    this.classList.add(square.name);
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

  update(attacks) {
    this.title = this.square.name;
    this.moves = [];
    let piece = this.square.piece;
    if (!piece) {
      this.textContent = '';
      return;
    }

    this.textContent = piece.constructor.glyph[piece.player];
    this.title = `${this.title} \u2014 ${piece.constructor.name}`;
    let moves = Array.from(piece.legalmoves());
    if (moves.length) {
      this.classList.add('attacking');
      this.title = `${this.title}\n\nAttacking:`;
      for (let target of moves) {
        this.title = `${this.title}\n \u2022 ${target}`;
        if (!attacks[target])
          attacks[target] = [];
        attacks[target].push(this.square.name);
      }
      if (piece.player == this.boardElt.game.player)
        this.moves = moves;
    }
  }
}

customElements.define('chess-square', ChessSquareElement);
