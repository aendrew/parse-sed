const posixbre = require('posixbre');

const intify = (s) => {
  const x = Number(s);
  if (!isNaN(x)) {
    return parseInt(x, 10);
  }
  return s;
};

const unEscape1 = (x) => {
  if (x[0] === '\\') {
    return x[1];
  }
  return x;
};

const unEscape = s => s.replace(/[^\\]|\\[\s\S]/g, unEscape1);

const trueNewline = s => s.replace(/[^\\]|\\\n/g, unEscape1);

const asAddr = (s) => {
  let delim;
  let re;
  let x;
  if (s === '$') {
    return s;
  }
  if (s === undefined) {
    return x;
  }
  x = intify(s);
  if (typeof x === 'number') {
    return x;
  }
  const ref = x[0];
  if (Array.prototype.indexOf.call('\\/', ref) >= 0) {
    if (x[0] === '/') {
      re = x.slice(1, -1);
    } else {
      delim = x.slice(0, 2);
      x = x.slice(2, -1);
      re = x.replace(/[^\\]|\\./g, (c) => {
        if (c === delim) {
          return c[1];
        }
        return c;
      });
    }
    if (re === '') {
      return 'empty';
    }
    return RegExp(posixbre.asRegExp(re));
  }

  return undefined;
};

module.exports = (script) => {
  let nesting = 0;

  const parse1 = (_s) => {
    let s = _s;
    let argre;
    let digits;
    let m;
    const re = /(?:(\d+|\$|(?:\\|(?=\/))(.)(?:(?!\2)(?:[^\\\n]|\\.))*\2)(?:,(\d+|\$|(?:\\|(?=\/))(.)(?:(?!\4)(?:[^\\\n]|\\.))*\4))?)?(\s*!+)?([aci]\\|[bDdGgHhlNnPpqrstwxy#:=}{])/g;
    m = re.exec(s);
    if (!m) {
      return [null, null];
    }
    const cmd = {};
    const addr1 = asAddr(m[1]);
    const addr2 = asAddr(m[3]);
    if (addr1 != null) {
      cmd.addr1 = addr1;
    }
    if (addr2 != null) {
      cmd.addr2 = addr2;
    }
    cmd.positive = !m[5];
    cmd.verb = m[6][0];
    s = s.slice(re.lastIndex);
    const ref = cmd.verb;
    if (Array.prototype.indexOf.call('#', ref) >= 0) {
      s = s.replace(/^.*?(\n|$)/, '');
    }
    if (cmd.verb === '{') {
      cmd.arg = `\n${nesting}`;
      cmd.positive = !cmd.positive;
      nesting += 1;
    }
    if (cmd.verb === '}') {
      nesting -= 1;
      cmd.arg = `\n${nesting}`;
    }
    const ref1 = cmd.verb;
    if (Array.prototype.indexOf.call('aci', ref1) >= 0) {
      s = s.replace(/^.*?\n/, '');
      argre = /((?:[^\n\\]|\\[\s\S])*)\n?/g;
      m = argre.exec(s);
      cmd.arg = m[1].replace(/\\[\s\S]/g, x => x[1]);
      s = s.slice(argre.lastIndex);
    }
    const ref2 = cmd.verb;
    if (Array.prototype.indexOf.call(':btrw', ref2) >= 0) {
      argre = /[^\S\n]*(.*)\n?/g;
      m = argre.exec(s);
      cmd.arg = m[1];
      const ref3 = cmd.verb;
      if (Array.prototype.indexOf.call('w', ref3) >= 0) {
        // cmd.stream = mkWrite(cmd.arg);
        console.warn(`ref3 is ${ref}`);
      }
      s = s.slice(argre.lastIndex);
    }
    const ref4 = cmd.verb;
    if (Array.prototype.indexOf.call('sy', ref4) >= 0) {
      argre = /([^\\\n])((?:(?!\1)[^\\\n]|\\.)*)\1((?:(?!\1)[^\\\n]|\\[\s\S])*)\1([\dgnpw]*)(?:[^\S\n]+(.+))?/g;
      m = argre.exec(s);
      cmd.arg = m.slice(1, 6);
      cmd.delimiter = m[1];
      cmd.string1 = unEscape(m[2]);
      cmd.re = RegExp(posixbre.asRegExp(m[2]), 'g');
      if (m[2] === '') {
        cmd.re = null;
      }
      cmd.replacement = m[3];
      cmd.replacement = trueNewline(cmd.replacement);
      if (cmd.verb === 'y') {
        cmd.replacement = unEscape(cmd.replacement);
      }
      cmd.flags = m[4];
      digits = cmd.flags.match(/\d+/);
      if (digits) {
        cmd.nth = +digits;
      } else {
        cmd.nth = +(!(Array.prototype.indexOf.call(cmd.flags, 'g') >= 0));
      }

      s = s.slice(argre.lastIndex);
    }
    return [s, cmd];
  };

  const parseScript = (_s) => {
    let s = _s;
    let cmd;
    let ref;
    let ref1;
    const label = {};
    const cmds = [];
    for (;;) {
      ref = parse1(s);
      s = ref[0];
      cmd = ref[1];
      if (s === null) {
        break;
      }
      cmds.push(cmd);
      ref1 = cmd.verb;
      if (Array.prototype.indexOf.call(':}', ref1) >= 0) {
        label[cmd.arg] = cmds.length;
      }
    }
    return [cmds, label];
  };


  const ref = parseScript(script);
  const [commands, label] = ref;
  return {
    commands,
    label,
  };
};
