/**
 * @file
 * Functional tests for parse-sed
 */

import {readFileSync} from 'fs';
import test from 'ava';
import sed from './parse-sed';

test('!', t => {
	const [command1] = sed('2,3!p').commands;
	t.deepEqual(command1, {
		addr1: 2,
		addr2: 3,
		positive: false,
		verb: 'p'
	}, 'Simple case');

	const [command2] = sed('1,/2/!!p').commands;
	t.deepEqual(command2, {
		addr1: 1,
		addr2: /2/,
		positive: false,
		verb: 'p'
	}, 'Multiple ! are acceptable.');
});

test('#', t => {
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

test('$', t => {
	const [command] = sed('$p').commands;
	t.deepEqual(command, {
		addr1: '$',
		addr2: undefined,
		positive: true,
		verb: 'p'
	});
});

test(':', t => {
	const result = sed(':lbl');
	t.deepEqual(result, {
		commands: [
			{
				addr1: undefined,
				addr2: undefined,
				positive: true,
				verb: ':',
				arg: 'lbl'
			}
		],
		label: {
			lbl: 1
		}
	});
});

test('=', t => {
	const [command] = sed('/b/=').commands;
	t.deepEqual(command, {
		addr1: /b/,
		addr2: undefined,
		positive: true,
		verb: '='
	});
});

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

test('a', t => {
	const [command1] = sed(`a\
bar
`).commands; // This statement should not be indented.
	t.deepEqual(command1, {
		addr1: undefined,
		addr2: undefined,
		positive: true,
		verb: 'b',
		arg: 'ar'
	});

	const {commands: commands2} = sed(`a\
bar
a\
baz
`); // This statement should not be indented.
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

test('add', t => {
	const fixture = readFileSync(`${__dirname}/fixtures/add.txt`, {encoding: 'utf-8'});
	const result = sed(fixture);
	t.truthy(result, 'Can parse a reasonably complex script without throwing');
});

test('addr', t => {
	const {commands: commands1} = sed(`2a\
	bar
`);
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
test.todo('b');
test.todo('big');
test.todo('c');
test.todo('context');
test.todo('d');
test.todo('file');
test.todo('g');
test.todo('i');
test.todo('input');
test.todo('l');
test.todo('loop');
test.todo('n');
test.todo('p');
test.todo('q');
test.todo('r');
test.todo('s');
test.todo('simple');
test.todo('squeeze');
test.todo('srepl');
test.todo('t');
test.todo('w');
test.todo('x');
test.todo('y');
test.todo('{');
