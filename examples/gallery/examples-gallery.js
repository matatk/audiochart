'use strict'
google.load('visualization', '1.0', {'packages':['corechart']})
google.setOnLoadCallback(init)


//
// Utility Functions
//

/* Check for errors */
function errorCheck() {
	var freqLowInput = document.getElementById('opt-freq-low')
	var freqHighInput = document.getElementById('opt-freq-high')
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
	var classNames = ['hidden-error-message', 'error-message']
	var currentClass = (toState === 'on') ? classNames[0] : classNames[1]
	var desiredClass = (toState === 'on') ? classNames[1] : classNames[0]
	var errorParas = document.querySelectorAll('p.' + currentClass)
	for (var i = 0; i < errorParas.length; i++ ) {
		errorParas[i].className = desiredClass
	}
}

/* Toggle aria-invalid on controls */
function errorCheckToggleInvalid(toState) {
	var numberInputs = document.querySelectorAll('input[type=number]')
	for (var i = 0; i < numberInputs.length; i++ ) {
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

/* Draw all the charts after the library has been loaded */
function init() {
	// Cheeky: wire up onchange events for the options controls here too
	function changeHandler(id) {
		document.getElementById(id).addEventListener('change', errorCheck)
	}
	changeHandler('opt-freq-low')
	changeHandler('opt-freq-high')

	// Google Charts
	drawLine()
	drawGradient()
	drawSine()
	drawSalesLine()
	drawSalesAnnotated()

	// JSON
	// TODO DRY
	var jsonOptions = makeAudiochartOptions()
	jsonOptions['type'] = 'json'
	jsonOptions['data'] = document.getElementById('json1').textContent
	var jsonAC = new AudioChart(jsonOptions)
	document.getElementById('btn-json1').onclick = function() {
		jsonAC.playPause()
	}

	// HTML Table
	// TODO DRY
	var htmlOptions = makeAudiochartOptions()
	htmlOptions['type'] = 'htmlTable'
	htmlOptions['table'] = document.getElementById('table1')
	htmlOptions['highlightClass'] = 'current-datum'
	var htmlAC = new AudioChart(htmlOptions)
	document.getElementById('btn-table1').onclick = function() {
		htmlAC.playPause()
	}
}

/* Library functions for drawing Google charts and handling events */

function _drawLineChartCore(data, id, btn) {
	_drawCore(google.visualization.LineChart, data, id, btn)
}

function _drawBarChartCore(data, id, btn) {
	_drawCore(google.visualization.BarChart, data, id, btn)
}

function _drawCore(Klass, data, chartId, btn) {
	// Instantiate and draw our chart, passing in some options
	var googleOptions = {
		'title': 'Example',
		'curveType': 'function'
	}
	var chart = new Klass(document.getElementById(chartId))

	resizeChart()  // initial draw

	// Resizing; thanks, http://stackoverflow.com/a/23594901
	function resizeChart() {
		chart.draw(data, googleOptions)
	}
	if (document.addEventListener) {
		window.addEventListener('resize', resizeChart)
	} else if (document.attachEvent) {
		window.attachEvent('onresize', resizeChart)
	} else {
		window.resize = resizeChart
	}

	// Wire up to AudioChart
	var audiochartOptions = makeAudiochartOptions()
	audiochartOptions['type'] = 'google'
	audiochartOptions['data'] = data
	audiochartOptions['chart'] = chart
	audiochartOptions['chartContainer'] = document.getElementById(chartId)
	var ac = new AudioChart(audiochartOptions)

	document.getElementById(btn).onclick = function() {
		ac.playPause()
	}
}


//
// Individual Charts
//

function drawLine() {
	// Create the data table.
	var data = new google.visualization.DataTable()

	var MIN = 0
	var MAX = 1
	var DELTA = 0.1
	var results = []
	var index = 0
	for( var i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, 42]
		index++
	}

	data.addColumn('number', 'blah')
	data.addColumn('number', 'blah')
	data.addRows(results)

	_drawLineChartCore(data, 'chart-line', 'btn-line')
}

function drawGradient() {
	// Create the data table.
	var data = new google.visualization.DataTable()

	var MIN = 0
	var MAX = 1
	var DELTA = 0.01
	var results = []
	var index = 0
	for( var i = MIN; i <= MAX; i += DELTA ) {
		results[index] = [i, i]
		index++
	}

	data.addColumn('number', 'blah')
	data.addColumn('number', 'blah')
	data.addRows(results)

	_drawLineChartCore(data, 'chart-gradient', 'btn-gradient')
}

function drawSine() {
	// Create the data table.
	var data = new google.visualization.DataTable()

	var MIN = -Math.PI
	var MAX = Math.PI
	var DELTA = 0.01
	var results = []
	var index = 0
	for( var i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, Math.sin(i)]
		index++
	}

	data.addColumn('number', 'Radians')
	data.addColumn('number', 'Sine')
	data.addRows(results)

	_drawLineChartCore(data, 'chart-sine', 'btn-sine')
}

function drawSalesLine() {
	// Create the data table.
	var data = new google.visualization.DataTable()
	data.addColumn('string', 'Month') // Implicit domain label col.
	data.addColumn('number', 'Sales') // Implicit series 1 data col.
	data.addRows([
		['April',1000],
		['May',  1170],
		['June',  660],
		['July', 1030]
	])

	_drawLineChartCore(data, 'chart-sales-line', 'btn-sales-line')
	_drawBarChartCore(data, 'chart-sales-bar', 'btn-sales-bar')
}

function drawSalesAnnotated() {
	// Create the data table.
	var data = new google.visualization.DataTable()
	data.addColumn('string', 'Month') // Implicit domain label col.
	data.addColumn('number', 'Sales') // Implicit series 1 data col.
	data.addColumn({type:'number', role:'interval'})
	// interval role col.
	data.addColumn({type:'number', role:'interval'})
	// interval role col.
	data.addColumn({type:'string', role:'annotation'})
	// annotation role col.
	data.addColumn({type:'string', role:'annotationText'})
	// annotationText col.
	data.addColumn({type:'boolean',role:'certainty'})
	// certainty col.
	data.addRows([
		['April',1000,  900, 1100,  'A','Stolen data', true],
		['May',  1170, 1000, 1200,  'B','Coffee spill', true],
		['June',  660,  550,  800,  'C','Wumpus attack', true],
		['July', 1030, null, null, null, null, false]
	])

	_drawLineChartCore(data, 'chart-sales-annotated', 'btn-sales-annotated')
}
