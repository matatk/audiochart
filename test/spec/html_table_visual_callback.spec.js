'use strict'

describe('htmlTableVisualCallback', function() {
	jasmine.getFixtures().fixturesPath = 'spec/'

	var htmlTableVisualCallback = null
	var highlightClassName = 'audiochart-playing'
	var table = null

	beforeEach(function() {
		loadFixtures('HTMLTableDataWrapper.fixtures.html')
		table = document.getElementById('testOne')
		htmlTableVisualCallback = window.htmlTableVisualCallbackMaker(table, 'audiochart-playing')
	})

	it('does not add a class before it is called', function() {
		var firstDataCell
		firstDataCell = table.getElementsByTagName('td')[0]
		expect(firstDataCell.className).toBe('')
	})

	it('has added a class after it is called', function() {
		var firstDataCell
		htmlTableVisualCallback(0, 0)
		firstDataCell = table.getElementsByTagName('td')[0]
		expect(firstDataCell.className).toBe(highlightClassName)
	})

	it('has removes the class from one cell and adds it to another', function() {
		var firstDataCell
		var secondDataCell
		htmlTableVisualCallback(0, 0)
		firstDataCell = table.getElementsByTagName('td')[0]
		expect(firstDataCell.className).toBe(highlightClassName)
		htmlTableVisualCallback(0, 1)
		secondDataCell = table.getElementsByTagName('td')[1]
		expect(firstDataCell.className).toBe('')
		expect(secondDataCell.className).toBe(highlightClassName)
	})
})
