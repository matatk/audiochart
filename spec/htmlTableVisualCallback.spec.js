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

		it('removes the class from one cell and adds it to another', () => {
			// FIXME this doesn't properly test two-series tables!
			htmlTableVisualCallback(0, 0)
			const firstDataCell = table.getElementsByTagName('td')[0]
			expect(firstDataCell.className).toBe(highlightClassName)
			htmlTableVisualCallback(0, 1)
			const secondDataCell = table.getElementsByTagName('td')[1]
			expect(firstDataCell.className).toBe('')
			expect(secondDataCell.className).toBe(highlightClassName)
		})
	})
})
