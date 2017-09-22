// This uses the Google Charts API along with AudioChart.
//
// You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/examples/hello/) to experience the actual chart (this is just the code that makes it tick).
//
// Note that you can also use AudioChart with JSON and HTML tables (there are [examples](http://matatk.agrip.org.uk/audiochart/examples/gallery/) to demonstrate this).
//
// More details on working with Google Charts can be found in the [Google Charts documentation](https://developers.google.com/chart/).
'use strict'
google.load('visualization', '1.0', {'packages':['corechart']})
google.setOnLoadCallback(drawChart)

function drawChart() {
	// ## Google Charts Bits

	// Create a new data table
	const data = new google.visualization.DataTable()

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
	const chartOptions = {
		'title': 'Evil Project Efficacy',
		'curveType': 'function'
	}

	// Initialise (but do not yet actually draw) the chart
	const chart = new google.visualization.LineChart(
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
	const ac = new AudioChart({
		'type': 'google',      // (see the docs)
		'data': data,          // the GoogleDataTable
		'chart': chart,        // the Google Chart object
		'duration': 5000,      // milliseconds
		'frequencyLow': 200,   // Hz
		'frequencyHigh': 600,  // Hz
		'chartContainer': document.getElementById('chart')  // HTMLElement e.g. HTMLDivElement
	})

	// Attach the `.playPause()` function to the `click` event handler of
	// the `<button>` element on the HTML page.
	document.getElementById('play').onclick = function() {
		ac.playPause()
	}
}
