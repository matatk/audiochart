'use strict'
google.load('visualization', '1.0', {'packages':['corechart']})
google.setOnLoadCallback(drawChart)

function drawChart() {
	// Create a new data table
	var data = new google.visualization.DataTable()

	// Populate the table
	data.addColumn('string', 'Top Secret Evil Project')
	data.addColumn('number', 'Watermelons')
	data.addRows([
		['Alpha',    293],
		['Beta',     329],
		['Gamma',    261],
		['Delta',    130],
		['Epsilon',  196],
		['Zeta',     196],
	])

	// Google Chart options
	var chartOptions = {
		'title': 'Evil Project Efficacy',
		'curveType': 'function'
	}

	// Initialise (but do not yet actually draw) the chart
	var chart = new google.visualization.LineChart(
		document.getElementById('chart'))

	// Trigger an initial draw
	resizeChart()

	// Handle resizing when the viewport size changes ([thanks asgallant of StackOverflow](http://stackoverflow.com/a/23594901))
	function resizeChart() {
		chart.draw(data, chartOptions)
	}

	if (document.addEventListener) {
		window.addEventListener('resize', resizeChart)
	} else if (document.attachEvent) {
		window.attachEvent('onresize', resizeChart)
	} else {
		window.resize = resizeChart
	}

	// ## AudioChart Stuff

	// Create a new `AudioChart` object
	var ac = new AudioChart({
		'type': 'google',      // (see the docs)
		'data': data,          // the GoogleDataTable
		'chart': chart,        // the Google Chart object
		'duration': 5000,      // milliseconds
		'frequencyLow': 200,   // Hz
		'frequencyHigh': 600,  // Hz
		'chartContainer': document.getElementById('chart-container')  // HTMLElement e.g. HTMLDivElement
	})

	// Attach the `.playPause()` function to the `click` event handler of
	// the `<button>` element on the HTML page.
	document.getElementById('play').onclick = function() {
		ac.playPause()
	}
}
