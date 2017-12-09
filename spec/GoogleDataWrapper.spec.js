'use strict'
/* global dataWrappersTestCore GoogleDataWrapper */

const testOne = [
	['', 'Test'],
	[ 0,      2],
	[ 1,      3],
	[ 2,      3],
	[ 3,      4]]

const testNeg = [
	['', 'Test'],
	[ 0,     20],
	[ 1,    -10],
	[ 2,      0],
	[ 3,      8],
	[ 4,    -90]]

const testTwo = [
	['', 'Test1', 'Test2'],
	[ 0,      20,      42],
	[ 1,     -10,      72],
	[ 2,       0,     -42],
	[ 3,       8,      -8],
	[ 4,     -90,       0]]

class FakeGoogleDataTable {
	constructor(table) {
		this.table = table
	}

	getValue(rowIndex, columnIndex) {
		return this.table[rowIndex + 1][columnIndex]
	}

	getNumberOfColumns() {
		return this.table[0].length
	}

	getNumberOfRows() {
		return this.table.length - 1
	}

	getColumnLabel(columnIndex) {
		return this.table[0][columnIndex + 1]
	}

	getColumnRange(columnIndex) {
		if (columnIndex === 0) {
			return {
				min: 0,
				max: this.table.length
			}
		}

		let min = this.table[1][columnIndex]
		let max = this.table[1][columnIndex]

		for (let i = 1; i < this.table.length; i++) {
			const row = this.table[i]
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
	new GoogleDataWrapper(new FakeGoogleDataTable(testNeg)),
	new GoogleDataWrapper(new FakeGoogleDataTable(testTwo)))
