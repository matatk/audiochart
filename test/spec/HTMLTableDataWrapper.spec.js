'use strict'
/* global loadFixtures dataWrappersTestCore */

describe('HTMLTableDataWrapper', function() {
	jasmine.getFixtures().fixturesPath = 'spec/'
	loadFixtures('HTMLTableDataWrapper.fixtures.html')

	var nonExistantTable = document.getElementById('moo')
	var actualTable = document.getElementById('testOne')

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
