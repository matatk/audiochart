'use strict'
/* global loadFixtures dataWrappersTestCore */

describe('HTMLTableDataWrapper', function() {
	jasmine.getFixtures().fixturesPath = 'spec/'
	loadFixtures('HTMLTableDataWrapper.fixtures.html')

	dataWrappersTestCore(
		'HTMLTableDataWrapper (data wrapper core)',
		new window.HTMLTableDataWrapper(document.getElementById('testOne')),
		new window.HTMLTableDataWrapper(document.getElementById('testNeg')))

	it('Throws when a null table is given', function() {
		expect(function() {
			new window.HTMLTableDataWrapper(document.getElementById('moo'))
		}).toThrow()
	})
})
