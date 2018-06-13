'use strict'
const optionsUpdateObjects = []
let skipGoogle = false

try {
	google.load('visualization', '1.0', {'packages':['corechart']})
	google.setOnLoadCallback(init)
} catch(error) {
	handleSupposedGoogleChartToolsAPIError(error)
}


//
// Options UI handling
//

/* Check for errors */
function errorCheck() {
	const freqLowInput = document.getElementById('opt-freq-low')
	const freqHighInput = document.getElementById('opt-freq-high')
	if (freqLowInput.valueAsNumber >= freqHighInput.valueAsNumber) {
		errorCheckToggle('on')
	} else {
		errorCheckToggle('off')
		updateFrequencyOptions(
			freqLowInput.valueAsNumber,
			freqHighInput.valueAsNumber
		)
	}
}

/* Toggle error message visibility and aria-invalid state on controls */
function errorCheckToggle(toState) {
	errorCheckToggleMessages(toState)
	errorCheckToggleInvalid(toState)
}

/* Toggle error message visibility */
function errorCheckToggleMessages(toState) {
	const classNames = ['hidden-error-message', 'error-message']
	const currentClass = (toState === 'on') ? classNames[0] : classNames[1]
	const desiredClass = (toState === 'on') ? classNames[1] : classNames[0]
	const errorParas = document.querySelectorAll('p.' + currentClass)
	for (let i = 0; i < errorParas.length; i++ ) {
		errorParas[i].className = desiredClass
	}
}

/* Toggle aria-invalid on controls */
function errorCheckToggleInvalid(toState) {
	const numberInputs = document.querySelectorAll('input[type=number]')
	for (let i = 0; i < numberInputs.length; i++ ) {
		numberInputs[i].setAttribute('aria-invalid',
			(toState === 'on') ? 'true' : 'false')
	}
}

/* Create a default options structure */
function makePartialOptions() {
	return {
		// Fill in 'type'
		// Fill in 'data' and 'chart'
		//  or 'htmlDocument' and 'htmlTableId'
		'duration': parseInt(document.getElementById('opt-duration').value) * 1000,
		'frequencyLow': document.getElementById('opt-freq-low').valueAsNumber,
		'frequencyHigh': document.getElementById('opt-freq-high').valueAsNumber
	}
}

/* Update all active AudioChart objects' frequency options */
function updateFrequencyOptions(lowFreq, highFreq) {
	const newSettings = {
		frequencyLow: lowFreq,
		frequencyHigh: highFreq
	}

	for (const ac of optionsUpdateObjects) {
		ac.updateOptions(newSettings)
	}
}

/* Update all active AudioChart objects' duration option */
function updateDurationOption(newDuration) {
	for (const ac of optionsUpdateObjects) {
		ac.updateOptions({
			duration: newDuration * 1000
		})
	}
}


//
// Generating data for the charts
//

function dataSimpleAxis(stops) {
	return Array.from({length: stops}, (_, i) => i)
}

function dataHorizontalLine(stops, value) {
	const delta = stops ? (1 / stops) : 0.1
	const y = value ? value : 42
	return _dataCore(0, 1, delta, () => y)
}

function dataGradient() {
	return _dataCore(0, 1, 0.01, x => x)
}

function dataSine() {
	return _dataTrig(Math.sin)
}

function dataCosine() {
	return _dataTrig(Math.cos)
}

function dataTrigAxis() {
	return _dataTrig(x => x)
}

function _dataTrig(callback) {
	return _dataCore(-Math.PI, Math.PI, 0.01, callback)
}

function _dataCore(min, max, delta, callback) {
	const results = []
	let index = 0
	for(let i = min; i <= max; i = i + delta) {
		results[index] = callback(i)
		index++
	}
	return results
}

function zip() {
	// Assumes all arrays are of the same length
	const arrays = [...arguments]
	return arrays[0].map((item, i) => {
		return arrays.map(array => {
			return array[i]
		})
	})
}


//
// Core Google Charts drawing code
//

function googleLineCore(data, id, buttonId) {
	googleCore(google.visualization.LineChart, data, id, buttonId)
}

function googleBarCore(data, id, buttonId) {
	googleCore(google.visualization.BarChart, data, id, buttonId)
}

function googleCore(Klass, data, chartId, buttonId) {
	// Instantiate and draw our chart, passing in some options
	const googleOptions = {
		'title': 'Example',
		'curveType': 'function'
	}
	const chart = new Klass(document.getElementById(chartId))

	resizeChart()  // initial draw

	// Handle resizing when the viewport size changes
	// Ta for initial idea: http://stackoverflow.com/a/23594901
	function resizeChart() {
		chart.draw(data, googleOptions)
	}

	window.addEventListener('resize', resizeChart)

	// Wire up to AudioChart
	// TODO DRY
	const audiochartOptions = makePartialOptions()
	audiochartOptions['type'] = 'google'
	audiochartOptions['data'] = data
	audiochartOptions['chart'] = chart
	audiochartOptions['chartContainer'] = document.getElementById(chartId)
	const ac = new AudioChart(audiochartOptions)

	optionsUpdateObjects.push(ac)  // register for options updates

	document.getElementById(buttonId).onclick = function() {
		ac.playPause()
	}
}


//
// Core C3 drawing code
//

function makeC3Data(seriesNames, seriesValueLists, xValues) {
	const columns = []
	for (let i = 0; i < seriesNames.length; i++) {
		columns.push([seriesNames[i]].concat(seriesValueLists[i]))
	}
	columns.push(['x'].concat(xValues))

	return {
		x: 'x',
		columns: columns,
		selection: {
			enabled: true
		}
	}
}

function c3Core(data, chartId, buttonId, extraChartOptions) {
	const chartOptions = {
		bindto: '#' + chartId,
		data: data,
		// Provide some default formatting for the grids and labels.
		// These may be overidden if extraChartOptions are specifed.
		grid: {
			x: {
				show: true
			}
		},
		axis: {
			x: {
				tick: {
					format: d3.format('.2f')
				}
			}
		}
	}

	if (extraChartOptions) {
		Object.assign(chartOptions, extraChartOptions)
	}

	const chart = c3.generate(chartOptions)

	// Wire up to AudioChart
	// TODO DRY
	const audiochartOptions = makePartialOptions()
	audiochartOptions['type'] = 'c3'
	audiochartOptions['data'] = data
	audiochartOptions['chart'] = chart
	audiochartOptions['chartContainer'] = document.getElementById(chartId)
	const ac = new AudioChart(audiochartOptions)

	optionsUpdateObjects.push(ac)  // register for options updates

	document.getElementById(buttonId).onclick = function() {
		ac.playPause()
	}

	const popupButton = document.getElementById(buttonId + '-options')
	if (popupButton) {
		new OptionsMaker(popupButton, () => alert('ok:-)'))
	}
}


//
// Graphical chart demo set-up
//

function drawHorizontalLine() {
	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('number', 'X')
		data.addColumn('number', 'Line')
		const rows = zip(dataSimpleAxis(10), dataHorizontalLine())
		data.addRows(rows)
		googleLineCore(data, 'chart-google-horizontal-line', 'btn-google-horizontal-line')
	}
}

function drawGradient() {
	const gradient = dataGradient()
	const xValues = dataSimpleAxis(gradient.length)

	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('number', 'X')
		data.addColumn('number', 'Gradient')
		data.addRows(zip(xValues, gradient))
		googleLineCore(data, 'chart-google-gradient', 'btn-google-gradient')
	}

	c3Core(
		makeC3Data(['Gradient'], [gradient], xValues),
		'chart-c3-gradient',
		'btn-c3-gradient')
}

function drawHorizontalLineAndGradient() {
	const line = dataHorizontalLine(100, 0.5)
	const gradient = dataGradient()
	const xValues = dataSimpleAxis(100)

	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('number', 'X')
		data.addColumn('number', 'Line')
		data.addColumn('number', 'Gradient')
		data.addRows(zip(xValues, line, gradient))
		googleLineCore(data, 'chart-google-line-gradient', 'btn-google-line-gradient')
	}

	c3Core(
		makeC3Data(['Line', 'Gradient'], [line, gradient], xValues),
		'chart-c3-line-gradient',
		'btn-c3-line-gradient')
}

function drawSine() {
	const sine = dataSine()
	const xValues = dataTrigAxis()

	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('number', 'Radians')
		data.addColumn('number', 'Sine')
		data.addRows(zip(xValues, sine))
		googleLineCore(data, 'chart-google-sine', 'btn-google-sine')
	}

	c3Core(
		makeC3Data(['Sine'], [sine], xValues),
		'chart-c3-sine',
		'btn-c3-sine', {
			axis: {
				x: {
					tick: {
						count: 20,
						format: d3.format('.2f')
					}
				}
			},
			grid: {
				x: {
					show: true,
					lines: [
						{ value: 0 }
					]
				},
				y: {
					show: true,
					lines: [
						{ value: 0 }
					]
				}
			}
		})
}

function drawSalesLineAndBar() {
	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('string', 'Month') // Implicit domain label col.
		data.addColumn('number', 'Sales') // Implicit series 1 data col.
		data.addRows([
			['April',1000],
			['May',  1170],
			['June',  660],
			['July', 1030]
		])
		googleLineCore(data, 'chart-google-sales-line', 'btn-google-sales-line')
		googleBarCore(data, 'chart-google-sales-bar', 'btn-google-sales-bar')
	}
}

function drawSalesAnnotated() {
	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('string', 'Month') // Implicit domain label col.
		data.addColumn('number', 'Sales') // Implicit series 1 data col.
		data.addColumn({type: 'number',  role: 'interval'})
		data.addColumn({type: 'number',  role: 'interval'})
		data.addColumn({type: 'string',  role: 'annotation'})
		data.addColumn({type: 'string',  role: 'annotationText'})
		data.addColumn({type: 'boolean', role: 'certainty'})
		data.addRows([
			['April',1000,  900, 1100,  'A','Stolen data', true],
			['May',  1170, 1000, 1200,  'B','Coffee spill', true],
			['June',  660,  550,  800,  'C','Wumpus attack', true],
			['July', 1030, null, null, null, null, false]
		])
		googleLineCore(data, 'chart-google-sales-annotated', 'btn-google-sales-annotated')
	}
}

function drawSineAndCosine() {
	const sine = dataSine()
	const cosine = dataCosine()
	const xValues = dataTrigAxis()

	if (!skipGoogle) {
		const data = new google.visualization.DataTable()
		data.addColumn('number', 'Radians')
		data.addColumn('number', 'Sine')
		data.addColumn('number', 'Cosine')
		data.addRows(zip(xValues, sine, cosine))
		googleLineCore(data, 'chart-google-sine-cosine', 'btn-google-sine-cosine')
	}

	c3Core(
		makeC3Data(['Sine', 'Cosine'], [sine, cosine], xValues),
		'chart-c3-sine-cosine',
		'btn-c3-sine-cosine', {
			axis: {
				x: {
					tick: {
						count: 20,
						format: d3.format('.2f')
					}
				}
			},
			grid: {
				x: {
					show: true,
					lines: [
						{ value: 0 }
					]
				},
				y: {
					show: true,
					lines: [
						{ value: 0 }
					]
				}
			}
		})

}


//
// JSON Example
//

function initJSON() {  // TODO DRY re HTML
	const jsonOptions = makePartialOptions()
	jsonOptions['type'] = 'json'
	jsonOptions['data'] = document.getElementById('json1').textContent
	const jsonAC = new AudioChart(jsonOptions)

	optionsUpdateObjects.push(jsonAC)  // register for options updates

	document.getElementById('btn-json1').onclick = function() {
		jsonAC.playPause()
	}
}


//
// HTML Example
//

function initHTML(tableId, buttonId) {  // TODO DRY re JSON
	const htmlOptions = makePartialOptions()
	htmlOptions['type'] = 'htmlTable'
	htmlOptions['table'] = document.getElementById(tableId)
	htmlOptions['highlightClass'] = 'current-datum'
	const htmlAC = new AudioChart(htmlOptions)

	optionsUpdateObjects.push(htmlAC)  // register for options updates

	document.getElementById(buttonId).onclick = function() {
		htmlAC.playPause()
	}
}

function oneSeriesTable() {
	initHTML('table1', 'btn-table1')
}

function twoSeriesTable() {
	initHTML('table2', 'btn-table2')
}


//
// Main and support
//

function handleSupposedGoogleChartToolsAPIError(error) {
	console.log('Encountered the following error calling the Google Chart Tools API:')
	console.log(error)
	console.log('...disabling Google charts.')
	for (const googleChart of document.querySelectorAll('[id^="chart-google-"]')) {
		googleChart.appendChild(
			document.createTextNode('Error loading Google Chart Tools API. '
				+ 'Internet connection may be offline.'))
		googleChart.classList.remove('visual-chart')
		googleChart.classList.add('error-message')
	}
	for (const button of document.querySelectorAll('[id^="btn-google-"]')) {
		button.remove()
	}
	skipGoogle = true
	init()
}

function init() {
	// Wire up options error checking
	function frequencyChangeHandler(id) {
		document.getElementById(id).addEventListener('change', errorCheck)
	}

	frequencyChangeHandler('opt-freq-low')
	frequencyChangeHandler('opt-freq-high')

	document.getElementById('opt-duration').addEventListener('change', function() {  // TODO => ?
		updateDurationOption(this.value)
	})

	// Draw charts
	drawHorizontalLine()
	drawGradient()
	drawSine()
	drawSalesLineAndBar()
	drawSalesAnnotated()
	drawHorizontalLineAndGradient()
	drawSineAndCosine()

	// Prepare non-graphical charts
	initJSON()
	oneSeriesTable()
	twoSeriesTable()
}
