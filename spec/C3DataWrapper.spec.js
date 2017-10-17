'use strict'
/* global dataWrappersTestCore C3DataWrapper */

const c3TestOne = {
	columns: [
		['Test', 2, 3, 3, 4]
	]
}

const c3TestNeg = {
	columns: [
		['Test', 20, -10, 0, 8, -90]
	]
}

dataWrappersTestCore(
	'C3DataWrapper',
	new C3DataWrapper(c3TestOne),
	new C3DataWrapper(c3TestNeg))
