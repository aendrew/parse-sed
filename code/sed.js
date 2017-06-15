let Sed;
let a;
let buf;
let commands;
let eachLine;
let ended;
let input;
let lineNumber;
let nesting;
let parse1;
let processing;
let ref;
let script;
let scriptOption;
let sed;
let suppressed;

const posixbre = require('posixbre');
const _ = require('underscore');
const async = require('async');
const fs = require('fs');

const write = {};
const indexOf = [].indexOf;

scriptOption = false;

script = '';

process.argv.shift();

process.argv.shift();

suppressed = false;

while (process.argv.length) {
  a = process.argv[0];
  if (a[0] !== '-') {
    break;
  } else if (a === '--') {
    process.argv.shift();
    break;
  } else if (a === '-e') {
    process.argv.shift();
    script += `${process.argv.shift()}\n`;
    scriptOption = true;
  } else if (a === '-f') {
    process.argv.shift();
    script += fs.readFileSync(process.argv.shift());
    scriptOption = true;
  } else if (a === '-n') {
    suppressed = true;
    process.argv.shift();
  } else if (a[0] === '-') {
    // usage(); // ??
    process.exit(4);
  }
}

if (!scriptOption) {
  script = process.argv.shift();
}

if (/^#n/.test(script)) {
  suppressed = true;
}

if (process.argv.length) {
  input = _.map(process.argv, name => () => fs.createReadStream(name));
} else {
  input = [
    () => process.stdin,
  ];
}

const intify = (s) => {
  const x = Number(s);
  if (!isNaN(x)) {
    return parseInt(x, 10);
  }
  return s;
};

const mkWrite = (path) => {
  if (!write[path]) {
    write[path] = fs.createWriteStream(path);
  }
  return write[path];
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
  let ref;
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
  if (ref = x[0], indexOf.call('\\/', ref) >= 0) {
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
};

nesting = 0;

const parseScript = (s) => {
  let cmd;
  let ref;
  let ref1;
  const label = {};
  const cmds = [];
  while (true) {
    ref = parse1(s), s = ref[0], cmd = ref[1];
    if (s === null) {
      break;
    }
    cmds.push(cmd);
    if (ref1 = cmd.verb, indexOf.call(':}', ref1) >= 0) {
      label[cmd.arg] = cmds.length;
    }
  }
  return [cmds, label];
};

parse1 = (s) => {
  let argre;
  let digits;
  let m;
  let ref;
  let ref1;
  let ref2;
  let ref3;
  let ref4;
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
  if (ref = cmd.verb, indexOf.call('#', ref) >= 0) {
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
  if (ref1 = cmd.verb, indexOf.call('aci', ref1) >= 0) {
    s = s.replace(/^.*?\n/, '');
    argre = /((?:[^\n\\]|\\[\s\S])*)\n?/g;
    m = argre.exec(s);
    cmd.arg = m[1].replace(/\\[\s\S]/g, x => x[1]);
    s = s.slice(argre.lastIndex);
  }
  if (ref2 = cmd.verb, indexOf.call(':btrw', ref2) >= 0) {
    argre = /[^\S\n]*(.*)\n?/g;
    m = argre.exec(s);
    cmd.arg = m[1];
    if (ref3 = cmd.verb, indexOf.call('w', ref3) >= 0) {
      cmd.stream = mkWrite(cmd.arg);
    }
    s = s.slice(argre.lastIndex);
  }
  if (ref4 = cmd.verb, indexOf.call('sy', ref4) >= 0) {
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
      cmd.nth = +(!(indexOf.call(cmd.flags, 'g') >= 0));
    }
    cmd.file = m[5];
    if (cmd.file) {
      cmd.stream = mkWrite(cmd.file);
    }
    s = s.slice(argre.lastIndex);
  }
  return [s, cmd];
};

ref = parseScript(script), commands = ref[0], label = ref[1];

if (/parse/.test(process.env.SED_DEBUG)) {
  console.warn('> commands');
  console.warn(commands);
  console.warn('> labels');
  console.warn(label);
}

Sed = ((() => {
  class Sed {
    constructor() {
      this.currentLine = 0;
      this.pattern = null;
      this.hold = '';
      this.finalLine = false;
      this.indirectTo = this.beginScript;
    }

    addrMatch(addr) {
      if (typeof addr === 'number') {
        return this.currentLine === addr;
      }
      if (addr === '$') {
        return this.finalLine;
      }
      if (addr === 'empty') {
        addr = this.lastAppliedRE;
      }
      if (addr instanceof RegExp) {
        this.apply(addr);
        return addr.test(this.pattern);
      }
    }

    finalBuf() {
      'Process the final line of input (after the \'end\' event\nhas been handled).';

      let lines;
      lines = buf.split('\n');
      lines.pop();
      if (lines.length) {
        this.finalLine = true;
        return eachLine(lines[0], () => {});
      }
    }

    fileEnd() {
      return this.finalBuf();
    }

    beginScript(line, nextLine) {
      let appends;
      let endCycle;
      let evalCommand;
      let script1;
      this.inputLine(line);
      appends = [];
      endCycle = ((_this => () => {
        let append;
        let j;
        let len;
        if (!suppressed && _this.pattern !== null) {
          process.stdout.write(`${_this.pattern}\n`);
        }
        _this.pattern = null;
        for (j = 0, len = appends.length; j < len; j++) {
          append = appends[j];
          process.stdout.write(append());
        }
        if (_this.quitter) {
          process.exit();
        }
        return nextLine();
      }))(this);
      evalCommand = ((_this => (cmd, nextCmd) => {
        let endRange;
        let execute;
        let ref1;
        ref1 = _this.evalAddr(cmd), execute = ref1[0], endRange = ref1[1];
        if (execute === cmd.positive) {
          return _this.evalFunction(cmd, endRange, appends, nextCmd, nextLine);
        }
        return nextCmd();
      }))(this);
      this.cmdIndex = 0;
      script1 = ((_this => (stop) => {
        if (_this.cmdIndex >= commands.length || stop) {
          return endCycle();
        }
        return evalCommand(commands[_this.cmdIndex++], x => setImmediate(script1, x));
      }))(this);
      return script1();
    }

    evalAddr(cmd) {
      let endRange;
      let execute;
      endRange = false;
      if (!cmd.addr1 && !cmd.addr2) {
        execute = true;
        endRange = true;
      }
      if (cmd.addr1 && !cmd.addr2) {
        execute = this.addrMatch(cmd.addr1);
        endRange = true;
      }
      if (cmd.addr1 && cmd.addr2) {
        if (!cmd.flipped) {
          execute = false;
          if (this.addrMatch(cmd.addr1)) {
            execute = true;
            cmd.flipped = true;
            if (typeof cmd.addr2 === 'number') {
              if (cmd.addr2 <= this.currentLine) {
                cmd.flipped = false;
                endRange = true;
              }
            }
          }
        } else {
          execute = true;
          if (this.addrMatch(cmd.addr2)) {
            cmd.flipped = false;
            endRange = true;
          }
        }
      }
      return [execute, endRange];
    }

    evalFunction(cmd, endRange, appends, nextCmd, nextLine) {
      let ref1;
      let x;
      if (cmd.verb === '=') {
        process.stdout.write(`${lineNumber}\n`);
      }
      if (cmd.verb === '{') {
        this.branch(cmd.arg);
      }
      if (cmd.verb === 'a') {
        appends.push(() => `${cmd.arg}\n`);
      }
      if (cmd.verb === 'b') {
        this.branch(cmd.arg);
      }
      if (cmd.verb === 'c') {
        this.pattern = null;
        if (endRange) {
          process.stdout.write(`${cmd.arg}\n`);
        }
        return nextCmd('cycle');
      }
      if (cmd.verb === 'D') {
        if (indexOf.call(this.pattern, '\n') >= 0) {
          this.pattern = this.pattern.replace(/^.*?\n/, '');
        } else {
          this.pattern = null;
        }
        return nextCmd('cycle');
      }
      if (cmd.verb === 'd') {
        this.pattern = null;
        return nextCmd('cycle');
      }
      if (cmd.verb === 'G') {
        this.pattern += `\n${this.hold}`;
      }
      if (cmd.verb === 'g') {
        this.pattern = this.hold;
      }
      if (cmd.verb === 'H') {
        this.hold += `\n${this.pattern}`;
      }
      if (cmd.verb === 'h') {
        this.hold = this.pattern;
      }
      if (cmd.verb === 'i') {
        process.stdout.write(`${cmd.arg}\n`);
      }
      if (cmd.verb === 'l') {
        x = this.pattern.replace(/[\s\S]/g, (s) => {
          switch (s) {
            case '\\':
              return '\\\\';
            case '\x07':
              return '\\a';
            case '\b':
              return '\\b';
            case '\f':
              return '\\f';
            case '\r':
              return '\\r';
            case '\t':
              return '\\t';
            case '\v':
              return '\\v';
            case '\n':
              return '$\n';
            default:
              return s;
          }
        });
        process.stdout.write(`${x}$\n`);
      }
      if (cmd.verb === 'N') {
        this.indirectTo = ((_this => (line) => {
          _this.inputLine(line);
          _this.indirectTo = _this.beginScript;
          return nextCmd();
        }))(this);
        return nextLine();
      }
      if (cmd.verb === 'n') {
        this.indirectTo = ((_this => (line) => {
          _this.inputLine(line);
          _this.indirectTo = _this.beginScript;
          return nextCmd();
        }))(this);
        return nextCmd('cycle');
      }
      if (cmd.verb === 'P') {
        if (indexOf.call(this.pattern, '\n') >= 0) {
          process.stdout.write(this.pattern.slice(0, +this.pattern.indexOf('\n') + 1 || 9e9));
        } else {
          process.stdout.write(`${this.pattern}\n`);
        }
      }
      if (cmd.verb === 'p') {
        process.stdout.write(`${this.pattern}\n`);
      }
      if (cmd.verb === 'q') {
        this.quitter = true;
        return nextCmd('cycle');
      }
      if (cmd.verb === 'r') {
        appends.push(() => fs.readFileSync(cmd.arg));
      }
      if (cmd.verb === 's') {
        this.verbs(cmd);
      }
      if (cmd.verb === 't') {
        if (this.substituted) {
          this.branch(cmd.arg);
        }
        this.substituted = false;
      }
      if (cmd.verb === 'w') {
        cmd.stream.write(`${this.pattern}\n`);
      }
      if (cmd.verb === 'x') {
        ref1 = [this.hold, this.pattern], this.pattern = ref1[0], this.hold = ref1[1];
      }
      if (cmd.verb === 'y') {
        this.pattern = this.pattern.replace(/[\s\S]/g, (x) => {
          let i;
          i = cmd.string1.indexOf(x);
          if (i >= 0) {
            return cmd.replacement[i];
          }
          return x;
        });
      }
      return nextCmd();
    }

    apply(re) {
      return this.lastAppliedRE = re;
    }

    verbs(cmd) {
      let lastIndex;
      let m;
      let matchCount;
      let re;
      let repl;
      let result;
      let substituted;
      re = cmd.re;
      if (re === null) {
        re = this.lastAppliedRE;
      }
      re.lastIndex = 0;
      matchCount = 0;
      substituted = false;
      result = [];
      lastIndex = 0;
      this.apply(re);
      while (true) {
        m = re.exec(this.pattern);
        if (!m) {
          break;
        }
        matchCount += 1;
        if (indexOf.call(cmd.flags, 'g') >= 0 || cmd.nth === matchCount) {
          substituted = this.substituted = true;
          repl = cmd.replacement.replace(/\\.|[^\\]/g, (particle) => {
            let ref1;
            if (particle === '&') {
              return m[0];
            }
            if (particle[0] !== '\\') {
              return particle;
            }
            if (ref1 = particle[1], indexOf.call('&\\', ref1) >= 0) {
              return particle[1];
            }
            if (/[1-9]/.test(particle[1])) {
              return m[particle[1]] || '';
            }
          });
          result = result.concat([this.pattern.slice(lastIndex, m.index), repl]);
          lastIndex = re.lastIndex;
          if (m.index === re.lastIndex) {
            re.lastIndex += 1;
          }
        }
        if (cmd.nth && matchCount >= cmd.nth) {
          break;
        }
      }
      if (substituted) {
        result.push(this.pattern.slice(lastIndex));
        this.pattern = result.join('');
        if (indexOf.call(cmd.flags, 'p') >= 0) {
          process.stdout.write(`${this.pattern}\n`);
        }
        if (indexOf.call(cmd.flags, 'w') >= 0) {
          return cmd.stream.write(`${this.pattern}\n`);
        }
      }
    }

    inputLine(line) {
      'Appends the line to pattern space, and updates\nvarious flags and counters.';

      if (this.pattern === null) {
        this.pattern = line;
      } else {
        this.pattern += `\n${line}`;
      }
      this.currentLine += 1;
      return this.substituted = false;
    }

    branch(label) {
      'Implements b and t commands.';

      let index;
      if (/branch/.test(process.env.SED_DEBUG)) {
        console.warn(`> branch to [[${label}]]`);
      }
      if (!label) {
        return this.cmdIndex = 2e308;
      }
      index = this.label[label];
      if (index != null) {
        return this.cmdIndex = index;
      }
      console.warn(`Branch label [[${label}]] is missing.`);
      return this.cmdIndex = 2e308;
    }
  }

  return Sed;
}))();

sed = new Sed();

sed.label = label;

lineNumber = 0;

eachLine = (line, cb) => {
  lineNumber += 1;
  return sed.indirectTo(line, cb);
};

buf = '';

processing = false;

ended = false;


const newStream = () => {
  const getStream = input.shift();
  let stream;
  ended = false;

  if (getStream) {
    stream = getStream();
    stream.on('data', inputData);
    return stream.on('end', inputEnd);
  }
  return sed.finalBuf();
};

function inputData(data) {
  this.pause();
  processing = true;
  buf += data;
  const lines = buf.split('\n');
  buf = lines.pop();
  if (buf === '' && lines.length) {
    buf = `${lines.pop()}\n`;
  }
  return async.eachSeries(lines, eachLine, ((_this => () => {
    processing = false;
    _this.resume();
    if (ended) {
      return newStream();
    }
  }))(this));
};

const inputEnd = () => {
  ended = true;
  if (!processing) {
    return newStream();
  }
};

newStream();
