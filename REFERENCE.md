AudioChart Reference
=====================

Example Options Objects
------------------------

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

Standard Options
-----------------

 * **`type` (string):** indicates the sort of chart you want AudioChart to sonify.  Valid values and their accompanying settings are given in the following section.
 * **`duration` (integer):** the length of the audio rendering in milliseconds.
 * **`frequency_low` (integer):** the lower bound of the frequency range to be used, in Hz.
 * **`frequency_high` (integer):** the uppoer bound of the frequency range to be used, in Hz.

Chart Types and Type-specific Options
--------------------------------------

### Google Charts Options

The steps to create the [Google Charts "Hello, World" example](http://matatk.agrip.org.uk/audiochart/hello-world.html) are detailed in the [README](https://github.com/matatk/audiochart/blob/gh-pages/README.md).

 * **`type` (string):** "google"
 * **`data` (object):** the [`GoogleDataTable`](https://developers.google.com/chart/interactive/docs/reference#DataTable) behind the chart.
 * **`chart` (object, optional):** the in-memory chart object -- if given, the data points will be visually highlighted in synch with the audio rendering.

### JSON Options

There is [a JSON example](http://matatk.agrip.org.uk/audiochart/example-charts.html#json) in the examples gallery.

 * **`type` (string):** "json"
 * **`data` (JSON string or object):** The JSON fragment, as a string or an object.

### HTML Table Options

There is [an HTML example](http://matatk.agrip.org.uk/audiochart/example-charts.html#table) in the examples gallery.

 * **`type` (string):** "html_table"
 * **`html_document` (object):** the HTML `document` object
 * **`html_table_id` (string):** the table's `id` attribute.
 * **`html_table_highlight_class` (string, optional):** the name of a CSS class to be used to indicate the currently-playing datum's table cell.