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
    ([ac]\\|[DGgHhNPp])             # Command
  ///g
  m = re.exec s
  if not m
    return [null, null]
  cmd = {}
  cmd.addr1 = intify m[1]
  cmd.addr2 = intify m[2]
  cmd.positive = not m[3]
  cmd.verb = m[4][0]
  s = s[re.lastIndex..]
  # Commands that take 'a\' style arguments.
  if cmd.verb in 'ac'
    # Delete through newline.
    s = s.replace /^.*?\n/, ''
    argre = /((?:[^\n\\]|\\[\s\S])*)\n?/g
    m = argre.exec s
    cmd.arg = m[1].replace /\\[\s\S]/g, (x) -> x[1]
    s = s[argre.lastIndex..]
  return [s, cmd]

commands = parseScript script

# *indirectTo* is used (in eachLine) to determine what to do
# (what continuation to call) when each line is read from input.
# (Normally this is beginScript which starts a cycle of script
# execution, but functions like 'N' can change that).
indirectTo = null
currentLine = 0
pattern = null
hold = ''
beginScript = (line, nextLine) ->
  if pattern is null
    pattern = line
  else
    pattern += '\n' + line
  currentLine += 1
  # List of delayed functions to call to append stuff after the
  # cycle output (typically 'a' and 'r' verbs).
  appends = []

  addrMatch = (addr) ->
    if typeof addr is 'number'
      return currentLine == addr

  async.eachSeries commands, (cmd, nextCmd) ->
    endRange = false
    # 0 address.
    if not cmd.addr1 and not cmd.addr2
      execute = true
      endRange = true
    # One address.
    if cmd.addr1 and not cmd.addr2
      execute = addrMatch cmd.addr1
      endRange = true
    # Two address.
    if cmd.addr1 and cmd.addr2
      if not cmd.flipped
        execute = false
        if addrMatch cmd.addr1
          execute = true
          cmd.flipped = true
          # There is a bit of a special case for numeric 2nd addrs
          if typeof cmd.addr2 == 'number'
            if cmd.addr2 <= currentLine
              cmd.flipped = false
              endRange = true
      else
        execute = true
        if addrMatch cmd.addr2
          cmd.flipped = false
          endRange = true
    if execute
      if 'a' == cmd.verb
        appends.push -> (cmd.arg + '\n')
      if 'c' == cmd.verb
        pattern = null
        if endRange
          process.stdout.write cmd.arg + '\n'
        nextCmd 'cycle'
      if 'D' == cmd.verb
        if '\n' in pattern
          pattern = pattern.replace /^.*?\n/, ''
        else
          pattern = null
        nextCmd 'cycle'
      if 'G' == cmd.verb
        pattern += '\n' + hold
      if 'g' == cmd.verb
        pattern = hold
      if 'H' == cmd.verb
        hold += '\n' + pattern
      if 'h' == cmd.verb
        hold = pattern
      if 'N' == cmd.verb
        indirectTo = (line) ->
          pattern += '\n' + line
          currentLine += 1
          indirectTo = beginScript
          nextCmd()
        return nextLine()
      if 'P' == cmd.verb
        if '\n' in pattern
          process.stdout.write pattern[..pattern.indexOf '\n']
        else
          process.stdout.write pattern + '\n'
      if 'p' == cmd.verb
        process.stdout.write pattern + '\n'
    nextCmd()
  , () ->
    # Pattern space may have been deleted (EG 'c' function).
    if not argv.n and pattern isnt null
      process.stdout.write pattern + '\n'
    pattern = null
    for append in appends
      process.stdout.write append()
    nextLine()

indirectTo = beginScript
eachLine = (line, cb) ->
  return indirectTo line, cb

buf = ''
process.stdin.on 'data', (data) ->
  process.stdin.pause()
  buf += data
  lines = buf.split '\n'
  buf = lines.pop()
  async.eachSeries lines, eachLine, () ->
    process.stdin.resume()

