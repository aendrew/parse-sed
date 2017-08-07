/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('addr', t => {
	const {commands: commands1} = sed(`2a\nbar\n`);
	t.deepEqual(commands1, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'b',
			arg: 'ar'
		}
	], 'Single numeric address');
});
