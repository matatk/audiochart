'use strict'
/* global dataWrappersTestCore */

const testOne = [[0, 2], [1, 3], [2, 3], [3, 4]]
const testNeg = [[0, 20], [1, -10], [2, 0], [3, 8], [4, -90]]

const FakeGoogleDataTable = (function() {
	function FakeGoogleDataTable(table) {
		this.table = table
	}

	FakeGoogleDataTable.prototype.getValue = function(rowIndex, columnIndex) {
		return this.table[rowIndex][columnIndex]
	}

	FakeGoogleDataTable.prototype.getNumberOfColumns = function() {
		return 2
	}

	FakeGoogleDataTable.prototype.getNumberOfRows = function() {
		return this.table.length
	}

	FakeGoogleDataTable.prototype.getColumnLabel = function(columnIndex) {
		return 'Test'
	}

	FakeGoogleDataTable.prototype.getColumnRange = function(columnIndex) {
		if (columnIndex === 0) {
			return {
				min: 0,
				max: this.table.length
			}
		}

		let min = this.table[0][columnIndex]
		let max = this.table[0][columnIndex]
		const ref = this.table
		for (let i = 0, len = ref.length; i < len; i++) {
			const row = ref[i]
			const value = row[columnIndex]
			if (min > value) {
				min = value
			}
			if (max < value) {
				max = value
			}
		}
		return {
			min: min,
			max: max
		}
	}

	return FakeGoogleDataTable
})()

dataWrappersTestCore(
	'GoogleDataWrapper',
	new window.GoogleDataWrapper(new FakeGoogleDataTable(testOne)),
	new window.GoogleDataWrapper(new FakeGoogleDataTable(testNeg)))
