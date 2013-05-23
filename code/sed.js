#!/usr/bin/env coffee

async = require 'async'
optimist = require 'optimist'
argv = optimist.posix().boolean('n').argv

script = ''
if not argv.e and not argv.f
  script = argv._.shift()

parseScript = (s) ->
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
    return []
  cmd = {}
  cmd.addr1 = m[1]
  cmd.addr2 = m[2]
  cmd.positive = not m[3]
  cmd.verb = m[4][0]
  if 'a' == cmd.verb
    # Delete through newline.
    s = s.replace /^.*?\n/, ''
    argre = /((?:[^\n\\]|\\[\s\S])*)\n?/g
    m = argre.exec s
    cmd.arg = m[1].replace /\\[\s\S]/g, (x) -> x[1]
  return [cmd]

commands = parseScript script

eachLine = (line, cb) ->
  # List of delayed functions to call to append stuff after the
  # cycle output (typically 'a' and 'r' verbs).
  appends = []
  for cmd in commands
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

