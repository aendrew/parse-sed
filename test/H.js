/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('H', t => {
	const {commands} = sed('h;H;g');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'h'
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'H'
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'g'
		}
	]);
});
