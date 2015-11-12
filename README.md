AudioChart
===========

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  The code can easily be added to any page containing charts.

Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you, and to [The Sonification Handbook](http://sonification.de/handbook/) for the research behind it.

AudioChart uses the Web Audio API, which has [great support amongst browsers, including Microsoft Edge](http://caniuse.com/audio-api), though is not (yet) supported by Internet Explorer.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a Google Chart, JSON fragment or HTML table.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * JSON (the format is detailed in the examples gallery).
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples-gallery.html) covers using AudioChart with Google Charts, JSON and HTML tables.

"Hello, World" Tutorial (using Google Charts)
----------------------------------------------

You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/hello-world-tutorial.html).  Note that you can also use AudioChart with JSON and HTML tables (there are [examples](http://matatk.agrip.org.uk/audiochart/examples-gallery.html) to demonstrate this).

### Google Charts Bits

More details on this can be found in the [Google Charts documentation](https://developers.google.com/chart/).

 1. Load the Google Charts API.

    ```html
    <script src="https://www.google.com/jsapi"></script>
    ```

 2. Have an element in your document to contain the chart.

    ```html
    <div id="chart"></div>
    ```

 3. Instantiate the Google Charts API and hook it up to a function to draw the chart when the page has loaded (you could put this code in a `<script>` element in your document's `<head>`, for example).

    ```javascript
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(draw_chart);

    function draw_chart() {
    	. . .
    }
    ```

    The rest of the JavaScript code goes inside `draw_chart()`.

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

    Note that there are other ways to add data to `DataTable` objects; the [AudioChart examples](http://matatk.agrip.org.uk/audiochart/examples-gallery.html) include a sine wave, generated by code, and the [DataTable documentation](https://developers.google.com/chart/interactive/docs/reference#DataTable) gives other approaches.

 5. Prepare chart options and create a Google Charts API chart.

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
    <script src="https://raw.githubusercontent.com/matatk/audiochart/gh-pages/lib/audiochart.min.js"></script>
    ```

 2. Create an element in your document to trigger audio playback.

    ```html
    <button id="play">Play</button>
    ```

 3. Wire up the button, data table and chart to AudioChart; include the following code in `draw_chart()`.  The `chart` is passed in so that AudioChart can visually highlight the chart data points during playback (this is optional).

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

The following objects are present in [AudioChart (JavaScript code)](src/audiochart.js).

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

A Gruntfile is provided to run the tests and automate things like linting and minification.  [Unit tests can be run in-browser](http://matatk.agrip.org.uk/audiochart/test/) or via the Gruntfile, printing output to the terminal.

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  The `pre-commit` hook can be used to ensure only code that passes tests is committed.  You can make a symlink from the `.git/hooks/` directory to it and it'll be run before you are asked for a commit message.

### Setting up for development

The build process uses [Grunt](http://gruntjs.com) (and therefore [node](https://github.com/joyent/node)).  Development set-up steps for Mac users with [Homebrew](http://brew.sh):

 1. `brew install node` (comes with `npm`).
 2. `npm -g install grunt-cli` in order to be able to conveniently run the grunt command (this will not globally install any other tools/libraries).
 3. `git clone` or otherwise download this repository.
 4. `npm install` in the newly-cloned repository grabs all required tools and libraries and stores them in the local `node_modules` directory.
 5. `grunt` will lint the code, run the tests and make a minified production version.

Instructions for Windows are forthcomming (sorry for the wait) -- but it should be trivial and very similar to the above once you've got node set up.

### Hosting the AudioChart Site and Examples Locally

You can use [Jekyll](http://jekyllrb.com) to host the AudioChart site locally and run the in-browser tests.  On the Mac, it can help to have your own Ruby install, e.g. from Homebrew, and use [Bundler](http://bundler.io) to manage the gems, as follows.

 1. `brew install ruby` gives you a local ruby installation. You may need to close your current terminal session before `/usr/local/bin/ruby` and `/usr/local/bin/gem` will supersede the system ones.
 2. `gem install bundler` will grab the gem-management tool.
 3. `bundle install` will use the `Gemfile` and `Gemfile.lock` to ensure you have a compatible set of gems (currently this is particularly targetted at ensuring the site will work on [GitHub Pages with Jekyll](https://help.github.com/articles/using-jekyll-with-pages/)).
 4. `bundle exec jekyll serve` will perpetually (re-)generate and serve the site locally.  The URL will be given in the terminal window.  Changes to files will be reflected when you reload a page in the browser.

Future Work Ideas
------------------

Patches for and feedback on the following are welcome!

 * Play speed/duration.
 * Support [C3.js](http://c3js.org) charts.
 * Support SVG charts.
 * Static/Periodic features such as grid/timing beats.
 * Mouse hover "audition" mode (hovering the mouse over a point would sound it).
 * Rendering a visual highlight element for chart APIs that don't provide this (i.eJSON and HTML tables).
 * Multiple plots/data series per chart.
 * Instruments as different sound types.
 * Officially support development on Windows.
 * Create a browser extension to enable AudioChart on charts/tables for sites that don't provide it themselves.
 * Allow modular builds to be created, with only support for data sources relevant to your site/application.
