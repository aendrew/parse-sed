/**
 * @file
 * Label tests
 */

import test from 'ava';
import sed from '../parse-sed';

test(':', t => {
	// : is not very useful without the 'b' verb.
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
