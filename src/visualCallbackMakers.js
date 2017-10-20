/**
 * Generates a function that moves the cursor on a Google Chart
 * @private
 * @param {GoogleChart} chart - the in-memory GoogleChart object
 * @returns {VisualCallback} the callback
 */
var googleVisualCallbackMaker = function(chart) {
	return function(series, row) {
		chart.setSelection([
			{
				'row': row,
				'column': series + 1
			}
		])
	}
}


/**
 * Generate a function that can be used to highlight table cells
 * @private
 * @param {HTMLTableElement} table - The in-DOM table element
 * @param {string} className - Name of the CSS highlight class
 * @returns {VisualCallback} The highlighting function
 */
var htmlTableVisualCallbackMaker = function(table, className) {
	return function(series, row) {
		const tds = table.getElementsByTagName('td')
		let cell  // TODO remove
		for (let i = 0; i < tds.length; i++) {
			cell = tds[i]
			cell.classList.remove(className)
		}
		cell = table.getElementsByTagName('td')[row]
		cell.classList.add(className)
	}
}


/**
 * Generates a function that moves the cursor on a C3 Chart
 * @private
 * @param {Object} chart - the in-memory C3 chart object
 * @returns {VisualCallback} the callback
 * @todo define C3 chart type?
 */
var c3VisualCallbackMaker = function(chart) {
	return function(series, row) {
		chart.select(null, [row], true)
	}
}
