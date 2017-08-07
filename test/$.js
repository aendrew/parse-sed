/**
 * @file
 * Tests for the $ token
 */

import test from 'ava';
import sed from '../parse-sed';

test('$p', t => {
	const [command] = sed('$p').commands;
	t.deepEqual(command, {
		addr1: '$',
		addr2: undefined,
		positive: true,
		verb: 'p'
	});
});
