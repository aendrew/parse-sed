/**
 * @file
 * Functional tests for parse-sed
 */

import {readFileSync} from 'fs';
import {resolve} from 'path';
import test from 'ava';
import sed from '../parse-sed';

test('add', t => {
	const fixture = readFileSync(resolve(__dirname, '..', 'fixtures/add.txt'), {encoding: 'utf-8'});
	const result = sed(fixture);
	t.truthy(result, 'Can parse a reasonably complex script without throwing'); // @TODO ensure output is correct
});
