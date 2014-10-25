AudioChart Reference
=====================

Options Objects
----------------

The 'options' object is passed to the `AudioChart()` constructor.  Here is an example options object being passed to AudioChart in the [Google Charts "Hello, World" example](http://matatk.agrip.org.uk/audiochart/hello-world.html).

```html
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

Here's an exmple from the [HTML table demo](http://matatk.agrip.org.uk/audiochart/example-charts.html#table).

```javascript
{
    'type': 'html_table',
    'document': document,
    'html_table_id': 'table1',
    'duration': 5000,
    'frequency_low': 200,
    'frequency_high': 600
}
```

AudioChart `type` and type-specific Options
--------------------------------------------

### Google Charts Options

The steps to create the [Google Charts "Hello, World" example](http://matatk.agrip.org.uk/audiochart/hello-world.html) are detailed in the [README](https://github.com/matatk/audiochart/blob/gh-pages/README.md).

`type` (string)
: "google"

`data` (object)
: the [`GoogleDataTable`](https://developers.google.com/chart/interactive/docs/reference#DataTable) behind the chart.

`chart` (object, optional)
: the Chart object -- if given, the data points will be visually highlighted in synch with the audio rendering.  It's the variable you instantiate the chart with:

```javascript
var chart = new google.visualization.LineChart(document.getElementById('chart'));
```

### JSON Options

There is [a JSON example](http://matatk.agrip.org.uk/audiochart/example-charts.html#json) in the examples gallery.

`type` (string)
: "json"

`data` (JSON string or object)
: The JSON fragment, as a string or an object.

### HTML Table Options

There is [an HTML example](http://matatk.agrip.org.uk/audiochart/example-charts.html#table) in the examples gallery.

`type` (string)
: "html_table"

`document` (object)
: the HTML `document` object

`html_table_id` (string)
: the table's `id` attribute.

AudioChart Standard Options
----------------------------

`duration` (float)
: The length of the audio rendering in seconds.

`frequency_low` (integer)
: The lower bound of the frequency range to be used, in Hz.

`frequency_high` (integer)
: Theh uppoer bound of the frequency range to be used, in Hz.