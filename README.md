# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

# Current implementation status

Implemented
 * All POSIX options (`-e`, `-f`, and `-n`)
 * Implicit stdin and input from file arguments
 * The verbs #, :, =, a, b, c, D, d, G, g, H, h, i, N, n, p, q, r, s, t, w, x, {
 * Addresses: numeric, `$`; context address are partially implemented
 * Detection of `#n` at start of script

Not Yet Implemented
 * context addresses that start with a blackslash
 * the verbs l, y

# Tests

    npm install # to install urchin
    npm test

