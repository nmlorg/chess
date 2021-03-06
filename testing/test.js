import {fixAssert} from './assert.js';


class AssertionError extends Error {}


let utils = {

AssertionError,

assert(assertion, msg) {
  if (assertion)
    return;
  let message = 'Assertion failed';
  if (msg)
    message = `${message}: ${msg}`;
  throw new AssertionError(message);
},

format(obj) {
  let str, typeofobj = typeof obj;
  if ((typeofobj == 'string') || (typeofobj == 'number') || (typeofobj == 'boolean'))
    str = JSON.stringify(obj);
  else {
    try {
      str = String(obj);
    } catch {  // Modules.
      str = Object.prototype.toString.call(obj);
    }
    if (str == '[object Object]') {
      str = '{' + Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ') + '}';
      if ((typeofobj == 'object') && (obj.constructor.name != 'Object'))
        str = `${obj.constructor.name}(${str})`;
    }
    str = str.replace(/\n\s*/g, ' ');
  }
  if (str.length > 120)
    str = str.substr(0, 119) + '\u22ef';
  return str;
},

};


export async function runTests(pre, testfilename) {
  let content = await fetch(testfilename).then(response => response.text());
  let base = new URL(testfilename, document.baseURI).href;
  content = `\n${content}`.replaceAll(
      /(\nimport .*')([^']*)(';)/g,
      (match, first, path, last) => `${first}${new URL(path, base).href}${last}`).substr(1);
  content = content.replaceAll(/ assert (.*?);\n/gs, (match, expr) => ` {${fixAssert(expr)}}\n`);
  let blob = new Blob([content], {type: 'text/javascript'});
  let bloburl = URL.createObjectURL(blob);
  let testfile = await import(bloburl);
  URL.revokeObjectURL(bloburl);
  for (let [funcname, func] of Object.entries(testfile)) {
    if (funcname.match(/^test/) && (func instanceof Function)) {
      pre.append(`${testfilename}:${funcname}`);
      try {
        func(utils);
        pre.append(' PASS\n');
      } catch (exc) {
        pre.append(' FAIL\n');
        pre.append(`${exc.stack.replace(bloburl, base)}\n`);
      }
    }
  }
}
