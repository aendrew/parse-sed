# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

Current status:
 * Single script argument
 * `-n` option implemented
 * no file arguments
 * Only a few verbs are implemented:
 * * a, c, D, G, g, H, h, N, p
 * * s is partially implemented
 * numbers and `$` are implemented for addresses; context addresses are partially implemented.

# Tests

    npm install # to install urchin
    npm test

