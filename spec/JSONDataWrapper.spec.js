'use strict'
/* global dataWrappersTestCore JSONDataWrapper */

const jsonTestOne = '{ "data": [ { "series": "Test", "values": [ 2, 3, 3, 4 ] } ] }'
const jsonTestNeg = '{ "data": [ { "series": "Test", "values": [ 20, -10, 0, 8, -90 ] } ] }'

dataWrappersTestCore(
	'JSONDataWrapper, starting from string',
	new JSONDataWrapper(jsonTestOne),
	new JSONDataWrapper(jsonTestNeg))

dataWrappersTestCore(
	'JSONDataWrapper, starting from object',
	new JSONDataWrapper(JSON.parse(jsonTestOne)),
	new JSONDataWrapper(JSON.parse(jsonTestNeg)))

// FIXME test unhappy paths
