/**
 * @interface DataWrapper
 *
 * The common interface that the other DataWrappers use.  This is validated
 * by the unit tests.
 *
 * Note: it is not done as a superclass (as {@link PitchMapper} is) because
 *       there's really nothing in common implementation-wise; only the
 *       interface is shared.
 *
 * @private
 */
/**
 * Returns the number of series in the underlying data
 * @function DataWrapper#numSeries
 * @returns {integer} The number of series
 */
/**
 * Get a list of the underlying data series names
 * @function DataWrapper#seriesNames
 * @returns {string[]} An array of the series names
 */
/**
 * What is the minimum value in a given series?
 * @function DataWrapper#seriesMin
 * @param {index} series - The series number
 * @returns {Number} The minimum value in the series
 */
/**
 * What is the maximum value in a given series?
 * @function DataWrapper#seriesMax
 * @param {index} series - The series number
 * @returns {Number} The maximum value in the series
 */
/**
 * Get value of specific datum
 * @function DataWrapper#seriesValue
 * @param {index} series - The series number
 * @param {index} index - The row number
 * @todo rename `index` to `row`?
 * @returns {Number} the datum
 */
/**
 * What is the length of a series?
 * @function DataWrapper#seriesLength
 * @param {index} series - The series
 * @returns {integer} The number of data in the series
 */


/**
 * This interfaces to Google's {@link https://developers.google.com/chart/interactive/docs/reference#DataTable|DataTable} class.
 *
 * @private
 * @implements {DataWrapper}
 * @param {GoogleDataTable} data - The in-memory GoogleDataTable
 */
class GoogleDataWrapper {
	constructor(data) {
		this.data = data
	}

	numSeries() {
		let numberOfDataColumns = 0

		// Check the role of each column
		// Note: the first, domain, column, isn't counted
		for (let i = 1; i < this.data.getNumberOfColumns(); i++) {
			const role = this.data.getColumnRole(i)
			if (role === '' || role === 'data') {  // TODO 'data' used?
				numberOfDataColumns += 1
			}
		}

		return numberOfDataColumns
	}

	seriesNames() {
		const results = []
		for (let i = 0; i < this.data.getNumberOfColumns() - 1; i++) {
			results.push(this.data.getColumnLabel(i))
		}
		return results
	}

	seriesMin(series) {
		return this.data.getColumnRange(series + 1).min
	}

	seriesMax(series) {
		return this.data.getColumnRange(series + 1).max
	}

	seriesValue(series, index) {
		return this.data.getValue(index, series + 1)
	}

	seriesLength(series) {
		return this.data.getNumberOfRows()
	}
}


/**
 * This allows a JSON fragment to be used as a data source.
 *
 * @todo document format
 *
 * @private
 * @implements {DataWrapper}
 * @param {JSON} json - The JSON data, as a string or object
 */
class JSONDataWrapper {
	constructor(json) {
		if (typeof json === 'string') {
			this.object = JSON.parse(json)
		} else if (typeof json === 'object') {
			this.object = json
		} else {
			throw Error('Please provide a JSON string or derived object.')
		}
	}

	numSeries() {
		return this.object.data.length
	}

	seriesNames() {
		const results = []
		for (let i = 0; i < this.object.data.length; i++) {
			results.push(this.object.data[i].series)
		}
		return results
	}

	seriesMin(series) {
		return Math.min.apply(this, this.object.data[series].values)
	}

	seriesMax(series) {
		return Math.max.apply(this, this.object.data[series].values)
	}

	seriesValue(series, index) {
		return this.object.data[series].values[index]
	}

	seriesLength(series) {
		return this.object.data[series].values.length
	}
}


/**
 * Support C3-format data objects
 *
 * @todo document format
 *
 * @private
 * @implements {DataWrapper}
 * @param {Object} data - The C3-format data object
 */
class C3DataWrapper {
	constructor(data) {
		if (typeof data === 'object') {
			this.object = data
		} else {
			throw Error('Please provide a C3-format data object.')
		}
	}

	numSeries() {
		return this.object.columns.length
	}

	seriesNames() {
		const results = []
		for (let i = 0; i < this.object.columns.length; i++) {
			results.push(this.object.columns[i][0])
		}
		return results
	}

	seriesMin(series) {
		return Math.min.apply(this, this.object.columns[series].slice(1))
	}

	seriesMax(series) {
		return Math.max.apply(this, this.object.columns[series].slice(1))
	}

	seriesValue(series, index) {
		return this.object.columns[series][index + 1]
	}

	seriesLength(series) {
		return this.object.columns[series].length - 1
	}
}


/**
 * Allows an HTML table to be used as a data source.
 *
 * @private
 * @implements {DataWrapper}
 * @param {HTMLTableElement} table - The in-DOM table element
 * @todo check it's a table
 */
class HTMLTableDataWrapper {
	constructor(table) {
		this.table = table
		if (!this.table) {
			throw Error('No table given.')
		}
	}

	numSeries() {
		return this.table.getElementsByTagName('tr')[0].children.length
	}

	seriesNames() {
		return Array.from(
			this.table.getElementsByTagName('th'),
			(cell) => cell.textContent)
	}

	_seriesFloats(series) {
		return Array.from(
			this.table.querySelectorAll(`td:nth-child(${series + 1})`),
			(cell) => parseFloat(cell.textContent))
	}

	seriesMin(series) {
		return Math.min.apply(this, this._seriesFloats(series))
	}

	seriesMax(series) {
		return Math.max.apply(this, this._seriesFloats(series))
	}

	seriesValue(series, index) {
		return parseFloat(
			this.table.getElementsByTagName('tr')[index + 1]
				.children[series].textContent)
	}

	seriesLength(series) {
		return this.table.getElementsByTagName('tr').length - 1
	}
}
