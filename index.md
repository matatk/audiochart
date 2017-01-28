---
layout: base
title: AudioChart
extra-style:
- index.css
head-script:
- https://www.google.com/jsapi
- lib/audiochart.min.js
body-script:
- examples/hello/hello-world-tutorial.js
abstract: <p>Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  The code is <a href="https://github.com/matatk/audiochart">developed on GitHub</a> and can easily be added to any page containing charts (or HTML tables or JSON data).  A <a href="examples/hello/">tutorial</a> and <a href="examples/gallery/">examples</a> are available.</p>
---
<div id="chartContainer">
	<div id="chart"></div>
	<button id="play">Play</button>
</div>

AudioChart uses the Web Audio API, which has [great support amongst browsers, including Microsoft Edge](http://caniuse.com/audio-api), though is not (yet) supported by Internet Explorer.

Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you, and to [The Sonification Handbook](http://sonification.de/handbook/) for the research behind it.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a Google Chart, JSON fragment or HTML table.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * JSON (the format is detailed in the examples gallery).
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples/gallery/) covers using AudioChart with Google Charts, JSON and HTML tables.

Tutorial and Documentation
---------------------------

- The ["Hello, World" AudioChart and Google Charts tutorial](http://matatk.agrip.org.uk/audiochart/examples/hello/) demonstrates how to get started.
- [AudioChart options reference](REFERENCE.md)
- [Public API documentation](http://matatk.agrip.org.uk/audiochart/doc/public/)

Development
------------

A Gruntfile is provided to run the tests and automate things like linting and minification.  [Unit tests can be run in-browser](http://matatk.agrip.org.uk/audiochart/test/) or via the Gruntfile, printing output to the terminal.  You can also view the [test coverage details](http://matatk.agrip.org.uk/audiochart/test/coverage/).

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  The `pre-commit` hook can be used to ensure only code that passes tests is committed.  You can make a symlink from the `.git/hooks/` directory to it and thus it (and the tests) will be run before you are asked for a commit message.

### Setting up for development

The build process uses Grunt and therefore also Node.  You can get set up for development as follows (most of these instructions require the use of a command line).

 1. Install [Node](https://nodejs.org/) (if you're a Mac user doing this via [Homebrew](http://brew.sh) is recommended: `brew install node`).
 2. Install [Grunt](http://gruntjs.com) globally via `npm -g install grunt-cli` in order to be able to run the `grunt` command in any directory.
 3. Get AudioChart's code by using `git clone https://github.com/matatk/audiochart.git` or [downloading a ZIP of the latest code](https://github.com/matatk/audiochart/archive/gh-pages.zip).
 4. Locally install AudioChart's dependencies by running `npm install` in the newly-cloned/extracted `audiochart/` directory (the packages will be stored inside `node_modules/`).
 5. Running `grunt` will lint the code, run the tests and make a minified production version.

**Windows users:** this has not yet been extensively tested on Windows, but it doesn't use anything platform-specific, so should work fine. Please file a bug if you encounter any problems.

### Documentation

- [Internal API documentation](http://matatk.agrip.org.uk/audiochart/doc/public/)

Future Work Ideas
------------------

Patches for and feedback on the following are welcome!

 * Play speed/duration.
 * Support [Google Chart Web Component (Polymer)](https://github.com/GoogleWebComponents/google-chart) charts.
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
 * Make AudioChart a bower package and explain how it can be easily added to any page that way.
