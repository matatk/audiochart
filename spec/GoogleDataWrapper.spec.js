'use strict'
/* global dataWrappersTestCore GoogleDataWrapper */

const testOne = [[0, 2], [1, 3], [2, 3], [3, 4]]
const testNeg = [[0, 20], [1, -10], [2, 0], [3, 8], [4, -90]]

class FakeGoogleDataTable {
	constructor(table) {
		this.table = table
	}

	getValue(rowIndex, columnIndex) {
		return this.table[rowIndex][columnIndex]
	}

	getNumberOfColumns() {
		return 2
	}

	getNumberOfRows() {
		return this.table.length
	}

	getColumnLabel(columnIndex) {
		return 'Test'
	}

	getColumnRange(columnIndex) {
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
}

dataWrappersTestCore(
	'GoogleDataWrapper',
	new GoogleDataWrapper(new FakeGoogleDataTable(testOne)),
	new GoogleDataWrapper(new FakeGoogleDataTable(testNeg)))
