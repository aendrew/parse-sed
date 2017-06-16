# sed.js [![CircleCI](https://circleci.com/gh/aendrew/parse-sed.svg?style=svg)](https://circleci.com/gh/aendrew/parse-sed)[![codecov](https://codecov.io/gh/aendrew/parse-sed/branch/master/graph/badge.svg)](https://codecov.io/gh/aendrew/parse-sed)

ES6 module fork of [drj11/sed.js](https://github.com/drj11)

This is intended to open up sed.js' API to be more useful as part of NodeJS scripts.

Intended to be POSIX compliant.

Any incorrect behaviour for a POSIX compliant script will be
considered a bug. Please report it at
https://github.com/aendrew/parse-sed/issues

# Current implementation status

Implemented
 * All POSIX verbs (`#:=abcDdGgHhilNnpqrstwxy{`)
 * All (POSIX) addresses: numeric, `$`, context
 * Detection of `#n` at start of script
 * Empty REs in addresses and `s` pattern

