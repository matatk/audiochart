AudioChart
===========

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

AudioChart uses the Web Audio API, which has [increasing support amongst browsers](http://caniuse.com/audio-api), but is not yet supported by Internet Explorer.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a chart.

What sort of charts does it work with?

 * Google Charts line and bar charts.

Some [example charts infused with AudioChart](http://matatk.agrip.org.uk/audiochart/example-google-charts.html) are available.

"Hello, World" Tutorial
------------------------

You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/hello-world.html).

### Google Charts Bits

More instructions on this can be found in the [Google Charts documentation](https://developers.google.com/chart/).

 1. Load Google Charts API.

	```html
	<script src="https://www.google.com/jsapi"></script>
	```

 2. Have an element in your document that will contain the chart.

	```html
	<div id="chart"></div>
	```

 3. Instantiate Google Charts API and hook it up to a function to draw the chart when the page has loaded.

	```js
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(draw_chart);

	function draw_chart() {
		. . .
	}
	```

	The rest of the JS code in this section goes inside `draw_chart()`.

 4. Create a Google Charts API `DataTable` and populate it with some data.

	```js
	var data = new google.visualization.DataTable();

	data.addColumn('string', 'Top Secret Evil Project');
	data.addColumn('number', 'Watermelons');
	data.addRows([
		['Alpha',   293],
		['Beta',    329],
		['Gamma',   261],
		['Delta',   130],
		['Epsilon', 196],
		['Zeta',    196],
	]);
	```

	Note that there are other ways to add data to `DataTable` objects; the [AudioChart examples](http://matatk.agrip.org.uk/audiochart/example-google-charts.html) include a sine wave, generated by code, and the [DataTable documentation](https://developers.google.com/chart/interactive/docs/reference#DataTable) gives other approaches.

 6. Prepare chart options and create a Google Charts API chart.

	```js
	var chart_options = {
		'title': 'Evil Project Efficacy',
		'width': 800,
		'height': 450,
		'curveType': 'function'
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart'));
	chart.draw(data, chart_options);
	```

### AudioChart Bits

 1. Load AudioChart.

	```html
	<script src="https://raw.github.com/matatk/audiochart/gh-pages/build/audiochart-min.js"></script>
	```

 2. Have an element in your document to trigger audio playback.

	```html
	<button id="play">Play</button>
	```

 3. Wire up the button to AudioChart (and the data table object above).

    **Note:** the ability to specify options such as playback duration is coming soon.

	```js
	document.getElementById('play').onclick = function() {
		new AudioChart(data);
	}
	```

Components
-----------

The following objects are present in AudioChart ([JS code](https://github.com/matatk/audiochart/blob/gh-pages/build/audiochart.js), [CoffeeScript code](https://github.com/matatk/audiochart/blob/gh-pages/audiochart.coffee)).

 * A `DataWrapper` interface wraps third-party chart library data sources.
    - `GoogleDataWrapper`
 * A `PitchMapper` maps from data values to pitches.
    - `FrequencyPitchMapper` does basic interpolation.
    - `NotePitchMapper` does basic interpolation, then "rounds" this to the nearest musical note (not yet implemented).
 * The `WebAudioSounder` wraps the Web Audio API.
 * The `Player` brings together wrapped data source, mapper and sounder).
 * The `AudioChart` object provides the public-facing interface.

Development
------------

AudioChart is developed in [CoffeeScript](http://coffeescript.org), which is translated into JS as part of the build process.  You do not need to know CoffeeScript to use AudioChart, as a built JS version is present in this repository.

A Makefile is provided to automate the translation and run tests.  Unit tests can be run in-browser or directly (on the CoffeeScript code) by jasmine-node.  Development dependencies therefore are: make, [coffee-script](https://www.npmjs.org/package/coffee-script) and, optionally, [jasmine-node](https://www.npmjs.org/package/jasmine-node).

The `pre-commit` hook can be used to ensure only code that passes tests is committed.  You can make a symlink from the `.git/hooks/` directory to it and it'll be run before you are asked for a commit message.

Future Work
------------

 * Static/Periodic features such as grid/timing beats.
 * Play speed and direction.
 * Mouse hover "audition" mode.
 * HTML tables and JSON as data source (won't render the chart).
 * Rendering a visual highlight element for chart APIs that don't provide this.
 * Multiple plots/data series per chart.
 * Instruments as different sound types.
