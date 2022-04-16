export function testBasic(U) {
  if (!(U instanceof Object))
    throw new Error('U is not an object');
  if (!(U.assert instanceof Function))
    throw new Error('U.assert is not a function');
}


export function testAssert(U) {
  assert 1 == 1;
  try {
    assert 1 == 2;
    throw new Error("Shouldn't be reachable");
  } catch (exc) {
    if (exc.constructor.name != 'AssertionError')
      throw new Error('Unknown exception:', exc);
  }
}


export function testAssertExpectedToFail(U) {
  let one = 1, val = {two() {return 2}};
  assert one == val.two();
}
