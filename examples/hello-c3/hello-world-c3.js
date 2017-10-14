// This uses C3 along with AudioChart.
//
// You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/examples/hello-c3/) to experience the actual chart (this is just the code that makes it tick).
//
// Note that you can also use AudioChart with Google Chart Tools, HTML tables and raw JSON data (there are [examples](http://matatk.agrip.org.uk/audiochart/examples/gallery/) to demonstrate this).
//
// More details on working with C3 Charts can be found on the [C3 site](http://c3js.org/).
/* global c3 */
'use strict'

function drawChart() {
	// ## C3 Bits

	// We define the data behind the chart using a separate variable, so that
	// AudioChart can make use of it too
	const data = {
		columns: [
			['demo', 293, 329, 261, 130, 196, 196]
		]
	}

	// Render the C3 chart
	const chart = c3.generate({
		bindto: '#chart',
		data: data
	})

	// ## AudioChart Stuff

	// Create a new `AudioChart` object
	const ac = new AudioChart({
		'type': 'c3',          // (see the docs)
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

drawChart()
