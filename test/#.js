/**
 * @file
 * Functional tests for parse-sed
 */

import test from 'ava';
import sed from '../parse-sed';

test('s/2/two/;#s/1/one/', t => {
	const {commands: commands1} = sed('s/2/two/;#s/1/one/');
	t.deepEqual(commands1, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '2', 'two', '', undefined
			],
			delimiter: '/',
			string1: '2',
			re: /2/g,
			replacement: 'two',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: '#'
		}
	], 'Comments are allowed');
});

test('#n\n2p', t => {
	const {commands: commands2} = sed('#n\n2p');
	t.deepEqual(commands2, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: '#'
		}, {
			addr1: 2,
			addr2: undefined,
			positive: true,
			verb: 'p'
		}
	], 'An initial comment of #n is equivalent to -n');
});
