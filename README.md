# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

Current status:
 * Single script argument
 * `-n` option implemented
 * no file arguments
 * Only some verbs are implemented:
   * :, #, a, b, c, D, d, G, g, H, h, N, p, q, t, x
   * s is mostly implemented (the w flag isn't)
 * numbers and `$` are implemented for addresses; context addresses are partially implemented.

# Tests

    npm install # to install urchin
    npm test

