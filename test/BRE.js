/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('BRE', t => {
	const [command] = sed('s/|/a/').commands;
	t.deepEqual(command, {
		addr1: undefined,
		addr2: undefined,
		positive: true,
		verb: 's',
		arg: [
			'/', '|', 'a', '', undefined
		],
		delimiter: '/',
		string1: '|',
		re: /\|/g,
		replacement: 'a',
		flags: '',
		nth: 1
	});
});
