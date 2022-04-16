import * as estree from './estree.js';


class SubstitutedExpression extends estree.Node {
  constructor(name, full, local) {
    super();
    this.name = name;
    this.full = full;
    this.local = local;
  }

  toString() {
    return this.name;
  }
}


export function replacePieces(node, pieces) {
  if (Array.isArray(node))
    return node.map(subnode => replacePieces(subnode, pieces));

  if (!(node instanceof estree.Node) || (node instanceof estree.Literal))
    return node;

  let full = String(node);

  for (let [k, v] of Object.entries(node))
    node[k] = replacePieces(v, pieces);

  let sub = new SubstitutedExpression(`__tmp${pieces.length}`, full, String(node));
  pieces.push(sub);
  return sub;
}
