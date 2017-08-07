/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('2,3!p', t => {
	const [command1] = sed('2,3!p').commands;
	t.deepEqual(command1, {
		addr1: 2,
		addr2: 3,
		positive: false,
		verb: 'p'
	}, 'Simple case');
});

test('1,/2/!!p', t => {
	const [command2] = sed('1,/2/!!p').commands;
	t.deepEqual(command2, {
		addr1: 1,
		addr2: /2/,
		positive: false,
		verb: 'p'
	}, 'Multiple ! are acceptable.');
});
