'use strict'
/* global htmlTableVisualCallbackMaker */

describe('htmlTableVisualCallback', () => {
	jasmine.getFixtures().fixturesPath = 'base/spec/'

	let htmlTableVisualCallback = null
	const highlightClassName = 'audiochart-playing'
	let table = null

	function simpleTests() {
		it('does not add a class before it is called', () => {
			const firstDataCell = table.getElementsByTagName('td')[0]
			expect(firstDataCell.className).toBe('')
		})

		it('has added a class after it is called', () => {
			htmlTableVisualCallback(0, 0)
			const firstDataCell = table.getElementsByTagName('td')[0]
			expect(firstDataCell.className).toBe(highlightClassName)
		})
	}

	describe('looking at the "testOne" table', () => {
		beforeEach(() => {
			loadFixtures('HTMLTableDataWrapper.fixtures.html')
			table = document.getElementById('testOne')
			htmlTableVisualCallback = htmlTableVisualCallbackMaker(table, highlightClassName)
		})

		simpleTests()

		it('removes the class from one cell and adds it to another', () => {
			htmlTableVisualCallback(0, 0)
			const firstDataCell = table.getElementsByTagName('td')[0]
			expect(firstDataCell.className).toBe(highlightClassName)
			htmlTableVisualCallback(0, 1)
			const secondDataCell = table.getElementsByTagName('td')[1]
			expect(firstDataCell.className).toBe('')
			expect(secondDataCell.className).toBe(highlightClassName)
		})
	})

	describe('looking at the "testTwo" table', () => {
		beforeEach(() => {
			loadFixtures('HTMLTableDataWrapper.fixtures.html')
			table = document.getElementById('testTwo')
			htmlTableVisualCallback = htmlTableVisualCallbackMaker(table, highlightClassName)
		})

		simpleTests()

		it('only removes the class from cells in the same column', () => {
			htmlTableVisualCallback(0, 0)
			const columnOneFirst = table
				.getElementsByTagName('tr')[1]
				.getElementsByTagName('td')[0]
			expect(columnOneFirst.className).toBe(highlightClassName)

			htmlTableVisualCallback(1, 0)
			const columnTwoFirst = table
				.getElementsByTagName('tr')[1]
				.getElementsByTagName('td')[1]
			expect(columnOneFirst.className).toBe(highlightClassName)
			expect(columnTwoFirst.className).toBe(highlightClassName)

			htmlTableVisualCallback(0, 1)
			const columnOneSecond = table
				.getElementsByTagName('tr')[2]
				.getElementsByTagName('td')[0]
			expect(columnOneFirst.className).toBe('')
			expect(columnOneSecond.className).toBe(highlightClassName)
			expect(columnTwoFirst.className).toBe(highlightClassName)
		})
	})
})
