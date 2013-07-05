# sed.js

Unix sed for node.js

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

