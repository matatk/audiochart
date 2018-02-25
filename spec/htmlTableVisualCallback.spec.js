'use strict'
/* global htmlTableVisualCallbackMaker */

describe('htmlTableVisualCallback', () => {
	jasmine.getFixtures().fixturesPath = 'base/spec/'

	let htmlTableVisualCallback = null
	const highlightClassName = 'audiochart-playing'
	let table = null

	function simpleTests() {
		it('does not add a class before it is called', () => {
			const firstRow = table.getElementsByTagName('tr')[1]
			expect(firstRow.className).toBe('')
		})

		it('has added a class after it is called', () => {
			htmlTableVisualCallback(0)
			const firstRow = table.getElementsByTagName('tr')[1]
			expect(firstRow.className).toBe(highlightClassName)
		})

		it('removes the class from one row and adds it to another', () => {
			htmlTableVisualCallback(0)
			const firstRow = table.getElementsByTagName('tr')[1]
			expect(firstRow.className).toBe(highlightClassName)

			htmlTableVisualCallback(1)
			const secondRow = table.getElementsByTagName('tr')[2]
			expect(firstRow.className).toBe('')
			expect(secondRow.className).toBe(highlightClassName)
		})
	}

	describe('looking at the "testOne" table', () => {
		beforeEach(() => {
			loadFixtures('HTMLTableDataWrapper.fixtures.html')
			table = document.getElementById('testOne')
			htmlTableVisualCallback = htmlTableVisualCallbackMaker(table, highlightClassName)
		})

		simpleTests()
	})

	describe('looking at the "testTwo" table', () => {
		beforeEach(() => {
			loadFixtures('HTMLTableDataWrapper.fixtures.html')
			table = document.getElementById('testTwo')
			htmlTableVisualCallback = htmlTableVisualCallbackMaker(table, highlightClassName)
		})

		simpleTests()
	})
})
