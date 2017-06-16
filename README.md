# sed.js [![CircleCI](https://circleci.com/gh/aendrew/parse-sed.svg?style=svg)](https://circleci.com/gh/aendrew/parse-sed)[![codecov](https://codecov.io/gh/aendrew/parse-sed/branch/master/graph/badge.svg)](https://codecov.io/gh/aendrew/parse-sed)

ES6 module fork of [drj11/sed.js](https://github.com/drj11)

This is intended to open up sed.js' API to be more useful as part of NodeJS scripts.

Intended to be POSIX compliant.

Any incorrect behaviour for a POSIX compliant script will be
considered a bug. Please report it at
https://github.com/drj11/sed.js/issues

# Source Code

github: https://github.com/drj11/sed.js
git: https://github.com/drj11/sed.js.git
tar: https://github.com/drj11/sed.js/archive/sed.js-0.0.0.tar.gz

# Current implementation status

Implemented
 * All POSIX options (`-e`, `-f`, and `-n`)
 * Implicit stdin and input from file arguments
 * All POSIX verbs (`#:=abcDdGgHhilNnpqrstwxy{`)
 * All (POSIX) addresses: numeric, `$`, context
 * Detection of `#n` at start of script
 * Empty REs in addresses and `s` pattern
 * Correct Exit Status

# Tests

    npm install # to install urchin
    npm test
