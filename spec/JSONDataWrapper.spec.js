'use strict'
/* global dataWrappersTestCore JSONDataWrapper */

const jsonTestOne = '{ "data": [ { "series": "Test", "values": [ 2, 3, 3, 4 ] } ] }'
const jsonTestNeg = '{ "data": [ { "series": "Test", "values": [ 20, -10, 0, 8, -90 ] } ] }'
const jsonTestTwo = '{ "data": [ { "series": "Test1", "values": [ 20, -10, 0, 8, -90 ] }, { "series": "Test2", "values": [42, 72, -42, -8, 0 ] } ] }'

dataWrappersTestCore(
	'JSONDataWrapper, starting from string',
	new JSONDataWrapper(jsonTestOne),
	new JSONDataWrapper(jsonTestNeg),
	new JSONDataWrapper(jsonTestTwo))

dataWrappersTestCore(
	'JSONDataWrapper, starting from object',
	new JSONDataWrapper(JSON.parse(jsonTestOne)),
	new JSONDataWrapper(JSON.parse(jsonTestNeg)),
	new JSONDataWrapper(JSON.parse(jsonTestTwo)))

// FIXME test unhappy paths
