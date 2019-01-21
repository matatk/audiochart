'use strict'
/* global dataWrappersTestCore loadFixture HTMLTableDataWrapper */

describe('HTMLTableDataWrapper', () => {
	loadFixture('HTMLTableDataWrapper.fixtures.html')

	const nonExistantTable = document.getElementById('moo')
	const actualTable = document.getElementById('testOne')

	dataWrappersTestCore(
		'HTMLTableDataWrapper',
		new HTMLTableDataWrapper(document.getElementById('testOne')),
		new HTMLTableDataWrapper(document.getElementById('testNeg')),
		new HTMLTableDataWrapper(document.getElementById('testTwo')))

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

	// TODO: test the _labelled table fixtures!
})
