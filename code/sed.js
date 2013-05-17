#!/usr/bin/env coffee

async = require 'async'

eachLine = (line, cb) ->
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

