AudioChart
===========

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.

Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

Use Cases
----------

What does it let your users do?

 * Play an auditory version of the data represented by a chart.

What sort of charts does it work with?

 * Google Chart Tools line charts.

Components
-----------

### Data Sources and Auditory Rendering

 * Data source (3rd-party, wrapped)
 * Data sampler (for large datasets)
 * Mappers (frequency, note)
 * Web Audio API (3rd-party, wrapped)
 * Player (brings together wrapped data source, mapper and sounder)

### Graphical (under construction)

 * Chart (3rd-party, wrapped)
 * Wrapper
 * Renderer (cursor)

Future
-------

 * Static/Periodic features such as grid/timing beats.
 * Play speed and direction.
 * Mouse hover "audition" mode.
 * HTML tables and JSON as data source (won't render the chart).
 * Multiple plots per chart.
 * Multiple chart types (currently only supports line plots).
 * Instruments as different sound types.
