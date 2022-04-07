import {Board} from './board.js';


export function testLoad(U) {
  let board = new Board();
  U.assert(board.serialize() == '');

  board.load('');
  U.assert(board.serialize() == '');

  board.load('P');
  U.assert(board.rows.length == 1);
  U.assert(board.rows[0].length == 1);
  U.assert(board.rows[0][0].piece.constructor.name == 'Pawn');

  board.load('r .\n. N');
  U.assert(board.rows.length == 2);
  U.assert(board.rows[0].length == 2);
  U.assert(board.rows[1].length == 2);
  U.assert(board.rows[0][0].piece.constructor.name == 'Rook');
  U.assert(!board.rows[0][1].piece);
  U.assert(!board.rows[1][0].piece);
  U.assert(board.rows[1][1].piece.constructor.name == 'Knight');
}


export function testReset(U) {
  let board = new Board();
  U.assert(board.rows instanceof Array);
  U.assert(board.rows.length == 0);
  board.reset();
  U.assert(board.rows.length == 8);
}


export function testSerialize(U) {
  let board = new Board();
  U.assert(board.serialize() == '');

  board.reset();
  U.assert(board.serialize() == `\
r n b q k b n r
p p p p p p p p
. . . . . . . .
. . . . . . . .
. . . . . . . .
. . . . . . . .
P P P P P P P P
R N B Q K B N R`);

  board.rows[6][1].piece.moves = 1;
  U.assert(board.serialize() == `\
r  n  b  q  k  b  n  r
p  p  p  p  p  p  p  p
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
P  P1 P  P  P  P  P  P
R  N  B  Q  K  B  N  R`);

  board.rows[0][5].piece.moves = 10;
  U.assert(board.serialize() == `\
r   n   b   q   k   b10 n   r
p   p   p   p   p   p   p   p
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
P   P1  P   P   P   P   P   P
R   N   B   Q   K   B   N   R`);
}
