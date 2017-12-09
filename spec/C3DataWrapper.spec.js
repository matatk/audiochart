'use strict'
/* global dataWrappersTestCore C3DataWrapper */

const c3TestOne = {
	columns: [
		['Test', 2, 3, 3, 4]
	]
}

const c3TestNeg = {
	columns: [
		['Test', 20, -10, 0, 8, -90],
	]
}

const c3TestTwo = {
	columns: [
		['Test1', 20, -10, 0, 8, -90],
		['Test2', 42, 72, -42, -8, 0]
	]
}

dataWrappersTestCore(
	'C3DataWrapper',
	new C3DataWrapper(c3TestOne),
	new C3DataWrapper(c3TestNeg),
	new C3DataWrapper(c3TestTwo))
