'use strict'
/* global dataWrappersTestCore */

const jsonTestOne = '{ "data": [ { "series": "Test", "values": [ 2, 3, 3, 4 ] } ] }'
const jsonTestNeg = '{ "data": [ { "series": "Test", "values": [ 20, -10, 0, 8, -90 ] } ] }'

dataWrappersTestCore(
	'JSONDataWrapper, starting from string',
	new window.JSONDataWrapper(jsonTestOne),
	new window.JSONDataWrapper(jsonTestNeg))

dataWrappersTestCore(
	'JSONDataWrapper, starting from object',
	new window.JSONDataWrapper(JSON.parse(jsonTestOne)),
	new window.JSONDataWrapper(JSON.parse(jsonTestNeg)))

// FIXME test unhappy paths
