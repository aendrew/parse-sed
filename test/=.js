/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('=', t => {
	const [command] = sed('/b/=').commands;
	t.deepEqual(command, {
		addr1: /b/,
		addr2: undefined,
		positive: true,
		verb: '='
	});
});
