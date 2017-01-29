---
layout: base
title: AudioChart
extra-style:
- index.css
head-script:
- https://www.google.com/jsapi
- lib/audiochart.min.js
body-script:
- index.js
abstract: <p>Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  The code is <a href="https://github.com/matatk/audiochart">developed on GitHub</a> and can easily be added to any page containing charts (or HTML tables or JSON data).  A <a href="examples/hello/">tutorial</a> and <a href="examples/gallery/">examples</a> are available.</p>
---
<div id="chart-container" class="chart-container google-chart">
	<div id="chart"></div>
	<button id="play">Play or Pause</button>
</div>

