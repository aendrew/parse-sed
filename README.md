# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

# Current implementation status

Implemented
 * `-e` and `-n` options
 * The verbs :, #, a, b, c, D, d, G, g, H, h, i, N, n, p, q, t, x
 * The verb s is mostly implemented (w flag is not)
 * Addresses: numeric, `$`, context address are partially implemented

Not Yet Implemented
 * file arguments
 * `-f` option
 * the w flag from the s verb
 * context addresses that start with a blackslash
 * the verbs {, l, r, w, y, =

# Tests

    npm install # to install urchin
    npm test

