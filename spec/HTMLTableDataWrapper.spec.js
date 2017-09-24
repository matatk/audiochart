'use strict'
/* global dataWrappersTestCore */

describe('HTMLTableDataWrapper', function() {
	jasmine.getFixtures().fixturesPath = 'base/spec/'
	loadFixtures('HTMLTableDataWrapper.fixtures.html')

	const nonExistantTable = document.getElementById('moo')
	const actualTable = document.getElementById('testOne')

	dataWrappersTestCore(
		'HTMLTableDataWrapper (data wrapper core)',
		new window.HTMLTableDataWrapper(document.getElementById('testOne')),
		new window.HTMLTableDataWrapper(document.getElementById('testNeg')))

	it('Throws when a null table is given', function() {
		expect(function() {
			new window.HTMLTableDataWrapper(nonExistantTable)
		}).toThrow()
	})

	it("doesn't throw when an actual table is given", function() {
		expect(function() {
			new window.HTMLTableDataWrapper(actualTable)
		}).not.toThrow()
	})
})
