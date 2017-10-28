'use strict' /* global dataWrappersTestCore HTMLTableDataWrapper */

describe('HTMLTableDataWrapper', () => {
	jasmine.getFixtures().fixturesPath = 'base/spec/'
	loadFixtures('HTMLTableDataWrapper.fixtures.html')

	const nonExistantTable = document.getElementById('moo')
	const actualTable = document.getElementById('testOne')

	dataWrappersTestCore(
		'HTMLTableDataWrapper (data wrapper core)',
		new HTMLTableDataWrapper(document.getElementById('testOne')),
		new HTMLTableDataWrapper(document.getElementById('testNeg')))

	it('Throws when a null table is given', () => {
		expect(() => {
			new HTMLTableDataWrapper(nonExistantTable)
		}).toThrow()
	})

	it("doesn't throw when an actual table is given", () => {
		expect(() => {
			new HTMLTableDataWrapper(actualTable)
		}).not.toThrow()
	})
})
