#!/usr/bin/env coffee

_= require 'underscore'
async = require 'async'
optimist = require 'optimist'
argv = optimist.posix().boolean('n').argv

script = ''
if not argv.e and not argv.f
  script = argv._.shift()

# If *s* (a string) has the form of a number, coerce it to
# an integer and return it; otherwise, return *s* unchanged.
intify = (s) ->
  x = Number(s)
  if not isNaN(x)
    return 0|x
  return s

parseScript = (s) ->
  cmds = []
  while true
    [s, cmd] = parse1 s
    if s is null
      break
    cmds.push cmd
  return cmds
# Parse the next command from string *s* returning a pair
# *s*, *cmd*
parse1 = (s) ->
  # The REs for addrs are not very right.
  re = ///
    (?:
      (\d+|\$|/(?:[^\\]|\\.)*/)        # Addr1
      (?:, (\d+|\$|/(?:[^\\]|\\.)*/))? # Optional Addr2
    )?
    (\s*!)?                         # Optional !
    (a\\)                           # Command
  ///
  m = re.exec s
  if not m
    return [null, null]
  cmd = {}
  cmd.addr1 = intify m[1]
  cmd.addr2 = intify m[2]
  cmd.positive = not m[3]
  cmd.verb = m[4][0]
  if 'a' == cmd.verb
    # Delete through newline.
    s = s.replace /^.*?\n/, ''
    argre = /((?:[^\n\\]|\\[\s\S])*)\n?/g
    m = argre.exec s
    cmd.arg = m[1].replace /\\[\s\S]/g, (x) -> x[1]
    s = s[argre.lastIndex..]
  return [s, cmd]

commands = parseScript script

currentLine = 0
eachLine = (line, cb) ->
  currentLine += 1
  # List of delayed functions to call to append stuff after the
  # cycle output (typically 'a' and 'r' verbs).
  appends = []

  addrMatch = (addr) ->
    if typeof addr is 'number'
      return currentLine == addr

  _.each commands, (cmd) ->
    # 0 address.
    if not cmd.addr1 and not cmd.addr2
      execute = true
    # One address.
    if cmd.addr1 and not cmd.addr2
      execute = addrMatch cmd.addr1
    # Two address.
    if cmd.addr1 and cmd.addr2
      if not cmd.flipped
        execute = false
        if addrMatch cmd.addr1
          execute = true
          cmd.flipped = true
      else
        execute = true
        if addrMatch cmd.addr2
          cmd.flipped = false
    if execute
      if 'a' == cmd.verb
        appends.push -> cmd.arg
  unless argv.n
    process.stdout.write line + '\n'
  for append in appends
    process.stdout.write append() + '\n'
  cb()
buf = ''
process.stdin.on 'data', (data) ->
  process.stdin.pause()
  buf += data
  lines = buf.split '\n'
  buf = lines.pop()
  async.eachSeries lines, eachLine, () ->
    process.stdin.resume()

