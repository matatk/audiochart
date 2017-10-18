AudioChart
===========

[![Build Status](https://travis-ci.org/matatk/audiochart.svg?branch=gh-pages)](https://travis-ci.org/matatk/audiochart)

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  The code can easily be added to any page containing charts.

AudioChart uses the Web Audio API, which is [supported by modern browsers, including Microsoft Edge](http://caniuse.com/audio-api) (but not Internet Explorer).

Thanks to [The Sonification Handbook](http://sonification.de/handbook/) for the research behind it and to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

Use Cases
----------

What does it let your users do?

 * Play an auditory version of the data represented by a chart.
 * Use the keyboard to pause the playback and move around the chart.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * C3 line charts.
 * Raw JSON data.
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples/gallery/) covers using AudioChart with Google Charts, JSON and HTML tables.

Examples and Documentation
---------------------------

 * These "getting started" examples contain commented code samples.
   - ["Hello, World" AudioChart&mdash;Google Chart Tools example](http://matatk.agrip.org.uk/audiochart/examples/hello-google/)
   - ["Hello, World" AudioChart&mdash;C3 example](http://matatk.agrip.org.uk/audiochart/examples/hello-c3/)
 * The [examples gallery](http://matatk.agrip.org.uk/audiochart/examples/gallery/) demonstrates using AudioChart with Google Chart Tools, C3, HTML Table and raw JSON data.
 * [AudioChart options reference](https://github.com/matatk/audiochart/blob/master/REFERENCE.md)
 * [Public API documentation](http://matatk.agrip.org.uk/audiochart/doc/public/)

Development
------------

Current and planned work is documented and discussed in the [AudioChart issue tracker](https://github.com/matatk/audiochart/issues) on GitHub.

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  When building the software locally, unit tests are run in Chrome and Firefox via the npm scripts ([Husky](https://github.com/typicode/husky) ensures they are run before a commit).  The [unit tests are also run on Travis](https://travis-ci.org/matatk/audiochart/) (where Headless Chrome is used).  You can view the [test coverage details](http://matatk.agrip.org.uk/audiochart/coverage/).  In addition, [internal API documentation](http://matatk.agrip.org.uk/audiochart/doc/internal/) is available.

**Warning:** AudioChart is still fairly early in development, so the APIs are changing quite fast.

### Setting up for development

The build process uses npm and therefore also Node.  You can get set up for development as follows (most of these instructions require the use of a command line).

 1. Install [Node](https://nodejs.org/) (if you're a Mac user doing this via [Homebrew](http://brew.sh) is recommended: `brew install node`).
 2. Get AudioChart's code by using `git clone https://github.com/matatk/audiochart.git` or [downloading a ZIP of the latest code](https://github.com/matatk/audiochart/archive/gh-pages.zip).
 3. Locally install AudioChart's dependencies by running `npm install` in the newly-cloned/extracted `audiochart/` directory (the packages will be stored inside `node_modules/`).
 4. Issuing `npm run build` will lint the code, run the tests and make a minified production version.

**Windows users:** this has not yet been extensively tested on Windows, but it doesn't use anything platform-specific, so should work fine.  Please file a bug if you encounter any problems.
