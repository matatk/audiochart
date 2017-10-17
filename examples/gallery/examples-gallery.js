'use strict'
google.load('visualization', '1.0', {'packages':['corechart']})
google.setOnLoadCallback(init)  // TODO use standard DOM loaded event?


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
function makeAudiochartOptions() {
	return {
		// Fill in 'type'
		// Fill in 'data' and 'chart'
		//  or 'htmlDocument' and 'htmlTableId'
		'duration':
		parseInt(document.getElementById('opt-duration').value) * 1000,
		'frequencyLow':
		document.getElementById('opt-freq-low').valueAsNumber,
		'frequencyHigh':
		document.getElementById('opt-freq-high').valueAsNumber
	}
}


//
// Generating data for the charts
//

function dataHorizontalLine() {
	const MIN = 0
	const MAX = 1
	const DELTA = 0.1
	const results = []
	let index = 0
	for( let i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, 42]
		index++
	}
	return results
}

function dataGradient() {
	const MIN = 0
	const MAX = 1
	const DELTA = 0.01
	const results = []
	let index = 0
	for( let i = MIN; i <= MAX; i += DELTA ) {
		results[index] = [i, i]
		index++
	}
	return results
}

function dataSine() {
	const MIN = -Math.PI
	const MAX = Math.PI
	const DELTA = 0.01
	const results = []
	let index = 0
	for( let i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, Math.sin(i)]
		index++
	}
	return results
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

	// Resizing; thanks, http://stackoverflow.com/a/23594901
	function resizeChart() {
		chart.draw(data, googleOptions)
	}
	if (document.addEventListener) {
		window.addEventListener('resize', resizeChart)
	} else if (document.attachEvent) {  // TODO can be removed now?
		window.attachEvent('onresize', resizeChart)
	} else {
		window.resize = resizeChart
	}

	// Wire up to AudioChart
	// TODO DRY
	document.getElementById(buttonId).onclick = function() {
		const audiochartOptions = makeAudiochartOptions()
		audiochartOptions['type'] = 'google'
		audiochartOptions['data'] = data
		audiochartOptions['chart'] = chart
		audiochartOptions['chartContainer'] = document.getElementById(chartId)
		const ac = new AudioChart(audiochartOptions)
		ac.playPause()
	}
}


//
// Core C3 drawing code
//

function makeC3Data(func, seriesName) {
	const rawData = func()
	const x = rawData.map((pair) => pair[0])
	const values = rawData.map((pair) => pair[1])

	return {
		x: 'x',
		columns: [
			[seriesName].concat(values),
			['x'].concat(x)
		],
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
	document.getElementById(buttonId).onclick = function() {
		const audiochartOptions = makeAudiochartOptions()
		audiochartOptions['type'] = 'c3'
		audiochartOptions['data'] = data
		audiochartOptions['chart'] = chart
		audiochartOptions['chartContainer'] = document.getElementById(chartId)
		const ac = new AudioChart(audiochartOptions)
		ac.playPause()
	}
}


//
// Graphical chart demo set-up
//

function drawHorizontalLine() {
	const data = new google.visualization.DataTable()
	data.addColumn('number', 'blah')
	data.addColumn('number', 'blah')
	data.addRows(dataHorizontalLine())
	googleLineCore(data, 'chart-google-horizontal-line', 'btn-google-horizontal-line')
}

function drawGradient() {
	const data = new google.visualization.DataTable()
	data.addColumn('number', 'blah')
	data.addColumn('number', 'blah')
	data.addRows(dataGradient())
	googleLineCore(data, 'chart-google-gradient', 'btn-google-gradient')

	c3Core(makeC3Data(dataGradient, 'Gradient'), 'chart-c3-gradient', 'btn-c3-gradient')
}

function drawSine() {
	const data = new google.visualization.DataTable()
	data.addColumn('number', 'Radians')
	data.addColumn('number', 'Sine')
	data.addRows(dataSine())
	googleLineCore(data, 'chart-google-sine', 'btn-google-sine')

	c3Core(makeC3Data(dataSine, 'Sine'), 'chart-c3-sine', 'btn-c3-sine', {
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

function drawSalesAnnotated() {
	const data = new google.visualization.DataTable()
	data.addColumn('string', 'Month') // Implicit domain label col.
	data.addColumn('number', 'Sales') // Implicit series 1 data col.
	data.addColumn({type: 'number', role: 'interval'})
	data.addColumn({type: 'number', role: 'interval'})
	data.addColumn({type: 'string', role: 'annotation'})
	data.addColumn({type: 'string', role: 'annotationText'})
	data.addColumn({type: 'boolean',role: 'certainty'})
	data.addRows([
		['April',1000,  900, 1100,  'A','Stolen data', true],
		['May',  1170, 1000, 1200,  'B','Coffee spill', true],
		['June',  660,  550,  800,  'C','Wumpus attack', true],
		['July', 1030, null, null, null, null, false]
	])
	googleLineCore(data, 'chart-google-sales-annotated', 'btn-google-sales-annotated')
}


//
// JSON Example
//

function initJSON() {  // TODO DRY re HTML
	document.getElementById('btn-json1').onclick = function() {
		const jsonOptions = makeAudiochartOptions()
		jsonOptions['type'] = 'json'
		jsonOptions['data'] = document.getElementById('json1').textContent
		const jsonAC = new AudioChart(jsonOptions)
		jsonAC.playPause()
	}
}


//
// HTML Example
//

function initHTML() {  // TODO DRY re JSON
	document.getElementById('btn-table1').onclick = function() {
		const htmlOptions = makeAudiochartOptions()
		htmlOptions['type'] = 'htmlTable'
		htmlOptions['table'] = document.getElementById('table1')
		htmlOptions['highlightClass'] = 'current-datum'
		const htmlAC = new AudioChart(htmlOptions)
		htmlAC.playPause()
	}
}


//
// Main
//

function init() {
	// Wire up error checking
	function changeHandler(id) {
		document.getElementById(id).addEventListener('change', errorCheck)
	}

	changeHandler('opt-freq-low')
	changeHandler('opt-freq-high')

	// Graphical charts
	drawHorizontalLine()
	drawGradient()
	drawSine()
	drawSalesLineAndBar()
	drawSalesAnnotated()

	initJSON()
	initHTML()
}
