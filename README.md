# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

# Current implementation status

Implemented
 * All POSIX options (`-e`, `-f`, and `-n`)
 * Implicit stdin and input from file arguments
 * All POSIX verbs (`#:=abcDdGgHhilNnpqrstwxy{`)
 * Addresses: numeric, `$`; context address are partially implemented
 * Detection of `#n` at start of script
 * Empty REs in addresses and `s` pattern.

Not Yet Implemented
 * Context addresses that start with a blackslash
 * Handling of Exit Status

# Tests

    npm install # to install urchin
    npm test

