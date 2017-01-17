'use strict'
/* global dataWrappersTestCore */

var testOne = '{ "data": [ { "series": "Test", "values": [ 2, 3, 3, 4 ] } ] }'
var testNeg = '{ "data": [ { "series": "Test", "values": [ 20, -10, 0, 8, -90 ] } ] }'

dataWrappersTestCore(
		'JSONDataWrapper, starting from string',
		new window.JSONDataWrapper(testOne),
		new window.JSONDataWrapper(testNeg))

dataWrappersTestCore(
		'JSONDataWrapper, starting from object',
		new window.JSONDataWrapper(JSON.parse(testOne)),
		new window.JSONDataWrapper(JSON.parse(testNeg)))

// FIXME test unhappy paths
