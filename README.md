# sed.js

Unix sed for node.js

Intended to be POSIX compliant (but not yet).

Current status:
 * Single script argument
 * ```-n``` option implemented
 * no file arguments
 * Only a few verbs are implemented:
 * * a, c, D, G, g, H, h, N, p
 * Only numeric addresses are allowed

# Tests

    npm test

