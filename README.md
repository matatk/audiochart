AudioChart
===========

[![Build Status](https://travis-ci.org/matatk/audiochart.svg?branch=gh-pages)](https://travis-ci.org/matatk/audiochart)

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  The code can easily be added to any page containing charts.

AudioChart uses the Web Audio API, which is [supported by modern browsers, including Microsoft Edge](http://caniuse.com/audio-api) (but not Internet Explorer).

Thanks to [The Sonification Handbook](http://sonification.de/handbook/) for the research behind it and to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a Google Chart, JSON fragment or HTML table.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * JSON (the format is detailed in the examples gallery).
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples/gallery/) covers using AudioChart with Google Charts, JSON and HTML tables.

Examples and Documentation
---------------------------

 * These "getting started" examples contain commented code samples.
   - ["Hello, World" AudioChart&mdash;Google Chart Tools tutorial](http://matatk.agrip.org.uk/audiochart/examples/hello-google/)
   - ["Hello, World" AudioChart&mdash;C3 tutorial](http://matatk.agrip.org.uk/audiochart/examples/hello-c3/)
 * The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples/gallery/) demonstrates using AudioChart with Google Chart Tools, C3, HTML Table and raw JSON data.
 * [AudioChart options reference](https://github.com/matatk/audiochart/blob/master/REFERENCE.md)
 * [Public API documentation](http://matatk.agrip.org.uk/audiochart/doc/public/)

Development
------------

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  A Gruntfile is provided to run the tests and automate things like linting and minification.  The `pre-commit` hook can be used to ensure only code that passes tests is committed (it does this by running Grunt).  You can make a symlink from the `.git/hooks/` directory to it and thus it (and the tests) will be run before you are asked for a commit message.

When building the software locally, unit tests are automatically run in Chrome and Firefox.  The [unit tests are also run on Travis](https://travis-ci.org/matatk/audiochart/) (as part of a build).  You can view the [test coverage details](http://matatk.agrip.org.uk/audiochart/coverage/).  In addition, [internal API documentation](http://matatk.agrip.org.uk/audiochart/doc/internal/) is available.

**Warning:** AudioChart is still fairly early in development, so the APIs are changing quite fast.

### Setting up for development

The build process uses npm and therefore also Node.  You can get set up for development as follows (most of these instructions require the use of a command line).

 1. Install [Node](https://nodejs.org/) (if you're a Mac user doing this via [Homebrew](http://brew.sh) is recommended: `brew install node`).
 2. Get AudioChart's code by using `git clone https://github.com/matatk/audiochart.git` or [downloading a ZIP of the latest code](https://github.com/matatk/audiochart/archive/gh-pages.zip).
 3. Locally install AudioChart's dependencies by running `npm install` in the newly-cloned/extracted `audiochart/` directory (the packages will be stored inside `node_modules/`).
 4. Issuing `npm run build` will lint the code, run the tests and make a minified production version.

**Windows users:** this has not yet been extensively tested on Windows, but it doesn't use anything platform-specific, so should work fine. Please file a bug if you encounter any problems.

Future Work Ideas
------------------

Feedback on the following is welcome.

 * Play speed/duration (supported in the code, but not currently changeable easily by the user/keyboard commands; perhaps this could be done via a WebExtension UI?)
 * Support SVG charts (this would most likely be done by accessing the data behind them as raw JSON, and creating a chart-specific visual callback to highlight the correct data on the chart).
 * Static/Periodic features such as grid/timing beats.
 * Mouse hover "audition" mode (hovering the mouse over a point would sound it).
 * Rendering a visual highlight element for chart APIs that don't provide this (i.eJSON and HTML tables).
 * Multiple plots/data series per chart.
 * Instruments as different sound types.
 * Officially support development on Windows.
 * Create a browser extension to enable AudioChart on charts/tables for sites that don't provide it themselves.
 * Allow modular builds to be created, with only support for data sources relevant to your site/application.
 * Make AudioChart a bower package and explain how it can be easily added to any page that way.
