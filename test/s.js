/**
 * @file
 * s flag
 */

import test from 'ava';
import sed from '../parse-sed';

test('s/2/two/\ns/1$/,/', t => {
	const {commands} = sed('s/2/two/\ns/1$/,/');
	t.deepEqual(commands, [
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
			verb: 's',
			arg: [
				'/', '1$', ',', '', undefined
			],
			delimiter: '/',
			string1: '1$',
			re: /1$/g,
			replacement: ',',
			flags: '',
			nth: 1
		}
	]);
});

test('s/o//g\ns/z*/x/g\ns/x/a/p', t => {
	const {commands} = sed('s/o//g\ns/z*/x/g\ns/x/a/p');

	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			arg: [
				'/', 'o', '', 'g', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: 'o',
			re: /o/g,
			replacement: '',
			flags: 'g',
			nth: 0
		}, {
			addr1: undefined,
			addr2: undefined,
			arg: [
				'/', 'z*', 'x', 'g', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: 'z*',
			re: /z*/g,
			replacement: 'x',
			flags: 'g',
			nth: 0
		}, {
			addr1: undefined,
			addr2: undefined,
			arg: [
				'/', 'x', 'a', 'p', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: 'x',
			re: /x/g,
			replacement: 'a',
			flags: 'p',
			nth: 1
		}
	], 'g and p flag.');
});

test('1s/1/x1/;s//z&/;2s/3/w/', t => {
	const {commands} = sed('1s/1/x1/;s//z&/;2s/3/w/');
	t.deepEqual(commands, [
		{
			addr1: 1,
			addr2: undefined,
			arg: [
				'/', '1', 'x1', '', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: '1',
			re: /1/g,
			replacement: 'x1',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			arg: [
				'/', '', 'z&', '', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: '',
			re: null,
			replacement: 'z&',
			flags: '',
			nth: 1
		}, {
			addr1: 2,
			addr2: undefined,
			arg: [
				'/', '3', 'w', '', undefined
			],
			positive: true,
			verb: 's',
			delimiter: '/',
			string1: '3',
			re: /3/g,
			replacement: 'w',
			flags: '',
			nth: 1
		}
	], 'Empty pattern uses last pattern.');
});

test('s/a/A/2047', t => {
	const {commands} = sed('s/a/A/2047');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', 'a', 'A', '2047', undefined
			],
			delimiter: '/',
			string1: 'a',
			re: /a/g,
			replacement: 'A',
			flags: '2047',
			nth: 2047
		}
	], 'The command s/a/A/2047 should be able to substitute the 2047th occurrence of a on a line.');
});

test('s/2/&&/\ns/2/3/2p\ns/./&&/pg', t => {
	const {commands} = sed('s/2/&&/\ns/2/3/2p\ns/./&&/pg');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '2', '&&', '', undefined
			],
			delimiter: '/',
			string1: '2',
			re: /2/g,
			replacement: '&&',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '2', '3', '2p', undefined
			],
			delimiter: '/',
			string1: '2',
			re: /2/g,
			replacement: '3',
			flags: '2p',
			nth: 2
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '.', '&&', 'pg', undefined
			],
			delimiter: '/',
			string1: '.',
			re: /./g,
			replacement: '&&',
			flags: 'pg',
			nth: 0
		}
	], 'combination of flags');
});

test('s 1 a\ns;a;b;\ns&b&c&\ns,c,d,', t => {
	const {commands} = sed('s 1 a\ns;a;b;\ns&b&c&\ns,c,d,');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				';', 'a', 'b', '', undefined
			],
			delimiter: ';',
			string1: 'a',
			re: /a/g,
			replacement: 'b',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'&', 'b', 'c', '', undefined
			],
			delimiter: '&',
			string1: 'b',
			re: /b/g,
			replacement: 'c',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				',', 'c', 'd', '', undefined
			],
			delimiter: ',',
			string1: 'c',
			re: /c/g,
			replacement: 'd',
			flags: '',
			nth: 1
		}
	], 'should work with any separator');
});

test('s/1/2/;s/2/3/', t => {
	const {commands} = sed('s/1/2/;s/2/3/');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '1', '2', '', undefined
			],
			delimiter: '/',
			string1: '1',
			re: /1/g,
			replacement: '2',
			flags: '',
			nth: 1
		}, {
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '2', '3', '', undefined
			],
			delimiter: '/',
			string1: '2',
			re: /2/g,
			replacement: '3',
			flags: '',
			nth: 1
		}
	], 'should allow multiple commands on one line');
});

test('s/[12]/-&/w .out/s', t => {
	const {commands} = sed('s/[12]/-&/w .out/s');
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '[12]', '-&', 'w', '.out/s'
			],
			delimiter: '/',
			string1: '[12]',
			re: /[12]/g,
			replacement: '-&',
			flags: 'w',
			nth: 1
		}
	], 'allow "w" flag');
});

test(`s/[12]/&\
foo/`, t => {
	const {commands} = sed(`s/[12]/&\
foo/`);
	t.deepEqual(commands, [
		{
			addr1: undefined,
			addr2: undefined,
			positive: true,
			verb: 's',
			arg: [
				'/', '[12]', '&foo', '', undefined
			],
			delimiter: '/',
			string1: '[12]',
			re: /[12]/g,
			replacement: '&foo',
			flags: '',
			nth: 1
		}
	], 'embedded newline');
});
