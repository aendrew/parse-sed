#!/usr/bin/env coffee

async = require 'async'
optimist = require 'optimist'
argv = optimist.posix().boolean('n').argv

eachLine = (line, cb) ->
  unless argv.n
    process.stdout.write line + '\n'
  cb()
buf = ''
process.stdin.on 'data', (data) ->
  process.stdin.pause()
  buf += data
  lines = buf.split '\n'
  buf = lines.pop()
  async.eachSeries lines, eachLine, () ->
    process.stdin.resume()

