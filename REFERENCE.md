AudioChart Reference
=====================

AudioChart options objects are standard JavaScript data structures (like JSON, but as they often include references to in-memory objects, they are not necessarily valid JSON).  This document explains all of the options that you can pass to AudioChart when using different source chart/data types, and gives an example options data structure for each source chart/data type.

You can supply the AudioChart options object to AudioChart as shown in the [Google Charts "Hello, World" example](http://matatk.agrip.org.uk/audiochart/hello-world-tutorial.html).

Standard Options
-----------------

These must always be specified, regardless of the type the source chart/data.

 * **`type` (string):** indicates the sort of chart you want AudioChart to sonify.  Valid values are as follows, and their accompanying settings are given in the following section.
   - "google"
   - "json"
   - "html_table"
 * **`duration` (integer):** the length of the audio rendering in milliseconds.
 * **`frequency_low` (integer):** the lower bound of the frequency range to be used, in Hz.
 * **`frequency_high` (integer):** the uppoer bound of the frequency range to be used, in Hz.

Source Chart/Data Types and their Options
------------------------------------------

### AudioChart using Google Chart Tools

The steps to create the [Google Charts "Hello, World" example](http://matatk.agrip.org.uk/audiochart/hello-world-tutorial.html) are detailed in the [README](https://github.com/matatk/audiochart/blob/gh-pages/README.md).

 * **`type` (string):** "google"
 * **`data` (object):** the [`GoogleDataTable`](https://developers.google.com/chart/interactive/docs/reference#DataTable) behind the chart.
 * **`chart` (object, optional):** the in-memory chart object -- if given, the data points will be visually highlighted in synch with the audio rendering.

### Google Chart Tools Options Example

```javascript
{
  "type": "google",
  "data": data,          // in-memory GoogleDataTable
  "chart": chart,        // in-memory Google Chart
  "duration": 5000,
  "frequency_low": 200,
  "frequency_high": 600
}
```

### AudioChart using JSON Data

There is [a JSON example](http://matatk.agrip.org.uk/audiochart/examples-gallery.html#json) in the examples gallery.

 * **`type` (string):** "json"
 * **`data` (JSON string or object):** The JSON fragment, as a string or the JSON's root object.

### JSON Options Example

```javascript
{
  "type": "json",
  "data": "{"data":[{"series":"Test","values":[21,42,84,42,21]}]}"
  "duration": 5000,
  "frequency_low": 200,
  "frequency_high": 600
}
```

### HTML Table Options

There is [an HTML example](http://matatk.agrip.org.uk/audiochart/examples-gallery.html#table) in the examples gallery.

 * **`type` (string):** "html_table"
 * **`table` (object):** the table element's in-memory DOM object.
 * **`highlight_class` (string, optional):** the name of a CSS class to be used to indicate the currently-playing datum's table cell.

### HTML Table Options Example

```javascript
{
  "type": "html_table",
  "table": table_element_object,
  "highlight_class": "audiochart-current",
  "duration": 5000,
  "frequency_low": 200,
  "frequency_high": 600
}
```
