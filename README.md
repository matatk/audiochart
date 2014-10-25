AudioChart
===========

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

AudioChart uses the Web Audio API, which has [increasing support amongst browsers](http://caniuse.com/audio-api), but is not yet supported by Internet Explorer.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a Google Chart, JSON fragment or HTML table.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * JSON (the format is detailed in the examples gallery).
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/example-charts.html) covers using AudioChart with Google Charts, JSON and HTML tables.

"Hello, World" Tutorial (using Google Charts)
----------------------------------------------

You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/hello-world.html).

You can also use AudioChart with JSON and HTML tables (there are examples to demonstrate this), and other chart types may be supported in future.

### Google Charts Bits

More details on this can be found in the [Google Charts documentation](https://developers.google.com/chart/).

 1. Load Google Charts API.

	```html
	<script src="https://www.google.com/jsapi"></script>
	```

 2. Have an element in your document that will contain the chart.

	```html
	<div id="chart"></div>
	```

 3. Instantiate Google Charts API and hook it up to a function to draw the chart when the page has loaded.

	```javascript
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(draw_chart);

	function draw_chart() {
		. . .
	}
	```

	The rest of the JS code in this section goes inside `draw_chart()`.

 4. Create a Google Charts API `DataTable` and populate it with some data.

	```javascript
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

	Note that there are other ways to add data to `DataTable` objects; the [AudioChart examples](http://matatk.agrip.org.uk/audiochart/example-charts.html) include a sine wave, generated by code, and the [DataTable documentation](https://developers.google.com/chart/interactive/docs/reference#DataTable) gives other approaches.

 6. Prepare chart options and create a Google Charts API chart.

	```javascript
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
	<script src="https://raw.githubusercontent.com/matatk/audiochart/gh-pages/build/audiochart-min.js"></script>
	```

 2. Have an element in your document to trigger audio playback.

	```html
	<button id="play">Play</button>
	```

 3. Wire up the button, data table and chart to AudioChart.  The `chart` is passed in so that AudioChart can visually highlight the chart data points during playback (this is optional).

	```javascript
	document.getElementById('play').onclick = function() {
		new AudioChart({
			'type': 'google',      // (see the docs)
			'data': data,          // the GoogleDataTable
			'chart': chart,        // the Google Chart object
			'duration': 5000,      // milliseconds
			'frequency_low': 200,  // Hz
			'frequency_high': 600  // Hz
		});
	}
	```

#### Other Chart Types and Options

The [REFERENCE](REFERENCE.md) details all the options you can pass to AudioChart.

Components
-----------

The following objects are present in AudioChart ([JS code](build/audiochart.js), [CoffeeScript code](audiochart.coffee)).

 * A `DataWrapper` interface wraps third-party chart library/other data sources.
    - `GoogleDataWrapper` wraps Google Charts `DataTable` objects.
	- `JSONDataWrapper` wraps JSON strings or parsed/compatible objects.
	- `HTMLTableWrapper`
 * A `PitchMapper` maps from data values to pitches.
    - `FrequencyPitchMapper` does basic interpolation.
    - `NotePitchMapper` does basic interpolation, then "rounds" this to the nearest musical note (not yet implemented).
 * The `WebAudioSounder` wraps the Web Audio API.
 * The `Player` brings together wrapped data source, mapper and sounder.
 * The `AudioChart` object provides the public-facing interface.

Development
------------

AudioChart is developed in [CoffeeScript](http://coffeescript.org), which is translated into JS as part of the build process.  **You do not need to know CoffeeScript (or have it installed) to use AudioChart, as a built JS version is present in this repository.**  A Makefile is provided to automate the translation and run tests.  [Unit tests can be run in-browser](http://matatk.agrip.org.uk/audiochart/test/) or directly on the code, printing output to the terminal, via jasmine-node.

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  The `pre-commit` hook can be used to ensure only code that passes tests is committed.  You can make a symlink from the `.git/hooks/` directory to it and it'll be run before you are asked for a commit message.

Useful commands for development:

 * `make test` runs the tests from the command line.
 * `make` translates the code to JS and produces a minified JS version too.

### Setting up for development

Recommended dependencies are:

 * `make` for automating the running of unit tests and translation of CoffeeScript code (and tests, for running in-browser) to JS
 * [`curl`](http://curl.haxx.se) for downloading the Web Audio API externs for Google Closure Compiler (you could skip this if you download the file yourself)
 * [CoffeeScript](https://github.com/jashkenas/coffee-script); therefore [node](https://github.com/joyent/node) for translating to JS
 * [Google Closure Compiler](https://github.com/google/closure-compiler) for minifying the JS code

Optional dependencies (for terminal-based testing) are:

 * [jasmine-node](https://github.com/mhevery/jasmine-node) for running the tests
 * [jsdom](https://github.com/tmpvar/jsdom) for simulating a DOM environment
 
**Note:** jsdom is apparently tricky to install on Windows, so you may want to skip it and just use the in-browser testing.

Development set-up steps for Mac users with [Homebrew](http://brew.sh):

 1. `git clone` or otherwise download this repository.
 2. `brew install closure-compiler`
 3. `brew install node` (comes with `npm`)
 4. `npm install` (grabs `coffee-script`, `jasmine-node` and `jsdom` for you, as instructed by `package.json` in this repository)

Instructions for Windows are forthcomming (sorry for the wait).

Future Work Ideas
------------------

Patches for and feedback on the following are welcome!

 * Static/Periodic features such as grid/timing beats.
 * Play speed and direction.
 * Mouse hover "audition" mode.
 * Rendering a visual highlight element for chart APIs that don't provide this (i.e. JSON and HTML tables).
 * Multiple plots/data series per chart.
 * Instruments as different sound types.
 * Support for development on Windows.
 * Create a browser extension to enable AudioChart on charts/tables for sites that don't provide it themselves.
