import {Board, Position} from './board.js';


export function test_Board_copy(U) {
  let board1 = new Board();
  let board2 = board1.copy();
  assert board1.serialize() == '';
  assert board2.serialize() == '';

  // Verify Board.rows is independent.
  board1.load('r .\n. N');
  assert board1.serialize() == 'r .\n. N';
  assert board2.serialize() == '';

  board2 = board1.copy();
  assert board1.serialize() == 'r .\n. N';
  assert board2.serialize() == 'r .\n. N';

  // Verify the Piece is independent.
  board1.get('a2').piece.moves = 1;
  assert board1.serialize() == 'r1 .\n.  N';
  assert board2.serialize() == 'r .\n. N';

  // Verify the Square is independent.
  board1.get('a2').piece = null;
  assert board1.serialize() == '. .\n. N';
  assert board2.serialize() == 'r .\n. N';
}


export function test_Board_legalmoves(U) {
  let board = new Board();
  let moves = Array.from(board.legalmoves(0), move => move.join('-')).sort();
  assert moves.join(',') == '';

  board.reset();
  moves = Array.from(board.legalmoves(0), move => move.join('-')).sort();
  assert moves.join(',') == `\
a2-a3,a2-a4,\
b1-a3,b1-c3,\
b2-b3,b2-b4,\
c2-c3,c2-c4,\
d2-d3,d2-d4,\
e2-e3,e2-e4,\
f2-f3,f2-f4,\
g1-f3,g1-h3,\
g2-g3,g2-g4,\
h2-h3,h2-h4`;
}


export function test_Board_load(U) {
  let board = new Board();
  assert board.serialize() == '';

  board.load('');
  assert board.serialize() == '';

  board.load('P');
  assert board.get('a1').piece.constructor.name == 'Pawn';

  board.load('r .\n. N');
  let a1 = board.get('a1');
  let a2 = board.get('a2');
  let b1 = board.get('b1');
  let b2 = board.get('b2');
  assert a1.piece == null;
  assert a1.down == null;
  assert a1.left == null;
  assert a1.right == b1;
  assert a1.up == a2;

  assert a2.piece.constructor.name == 'Rook';
  assert a2.piece.square == a2;
  assert a2.down == a1;
  assert a2.left == null;
  assert a2.right == b2;
  assert a2.up == null;

  assert b1.piece.constructor.name == 'Knight';
  assert b1.piece.square == b1;
  assert b1.down == null;
  assert b1.left == a1;
  assert b1.right == null;
  assert b1.up == b2;

  assert b2.piece == null;
  assert b2.down == b1;
  assert b2.left == a2;
  assert b2.right == null;
  assert b2.up == null;
}


export function test_Board_move(U) {
  let board = new Board();
  board.load('B .\nr P');
  assert board.serialize() == 'B .\nr P';

  board.move('a1', 'a2');
  assert board.serialize() == 'r1 .\n.  P';

  board.move('b1', 'a2');
  assert board.serialize() == 'P1 .\n.  .';
}


export function test_Board_reset(U) {
  let board = new Board();
  assert board.rows instanceof Array;
  assert board.rows.length == 0;
  board.reset();
  assert board.rows.length == 8;
  assert board.rows[0].length == 8;
}


export function test_Board_serialize(U) {
  let board = new Board();
  assert board.serialize() == '';

  board.reset();
  assert board.serialize() == `\
r n b q k b n r
p p p p p p p p
. . . . . . . .
. . . . . . . .
. . . . . . . .
. . . . . . . .
P P P P P P P P
R N B Q K B N R`;

  board.get('b2').piece.moves = 1;
  assert board.serialize() == `\
r  n  b  q  k  b  n  r
p  p  p  p  p  p  p  p
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
P  P1 P  P  P  P  P  P
R  N  B  Q  K  B  N  R`;

  board.get('f8').piece.moves = 10;
  assert board.serialize() == `\
r   n   b   q   k   b10 n   r
p   p   p   p   p   p   p   p
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
P   P1  P   P   P   P   P   P
R   N   B   Q   K   B   N   R`;
}


export function test_Position_fromXY(U) {
  assert Position.fromXY(0, 0) == 'a1';
  assert Position.fromXY(1, 1) == 'b2';
  assert Position.fromXY(25, 25) == 'z26';
  assert Position.fromXY(26, 26) == 'aa27';
  assert Position.fromXY(27, 27) == 'ab28';
  assert Position.fromXY(60, 60) == 'bi61';
  assert Position.fromXY(999, 999) == 'all1000';
}


export function test_Position_toXY(U) {
  assert Position.toXY('a1').join(',') == '0,0';
  assert Position.toXY('b2').join(',') == '1,1';
  assert Position.toXY('z26').join(',') == '25,25';
  assert Position.toXY('aa27').join(',') == '26,26';
  assert Position.toXY('ab28').join(',') == '27,27';
  assert Position.toXY('bi61').join(',') == '60,60';
  assert Position.toXY('all1000').join(',') == '999,999';
  assert Position.toXY('a').join(',') == '-1,-1';
  assert Position.toXY('A1').join(',') == '-1,-1';
}
