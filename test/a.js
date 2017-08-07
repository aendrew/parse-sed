/**
 * @file
 * I'm honestly not sure what these tests are for.
 */

import test from 'ava';
import sed from '../parse-sed';

test('a', t => {
	const [command1] = sed(`a\nbar\n`).commands; // This statement should not be indented.
	t.deepEqual(command1, {
		addr1: undefined,
		addr2: undefined,
		positive: true,
		verb: 'b',
		arg: 'ar'
	});

	const {commands: commands2} = sed(`a\nbar\na\nbaz\n`); // This statement should not be indented.
	t.deepEqual(commands2, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'b',
			arg: 'ar'
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 'b',
			arg: 'az'
		}
	]);
});
