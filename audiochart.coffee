#
# Data Wrappers
#

class DataWrapper
  constructor: (@data) -> throw Error 'Please use a derived class'

  num_series: ->

  series_names: ->

  series_min: (series) ->

  series_max: (series) ->

  series_value: (series, index) ->

  series_length: (series) ->


class GoogleDataWrapper extends DataWrapper
  # Note: We assume that the first column in the data table is there simply
  # to provide values for the x axis, as for line and scatter plots.
  constructor: (@data) ->

  num_series: ->
    @data.getNumberOfColumns() - 1

  series_names: ->
    @data.getColumnLabel i for i in [1 .. @data.getNumberOfColumns() - 1]

  series_min: (series) ->
    @data.getColumnRange(series + 1)['min']

  series_max: (series) ->
    @data.getColumnRange(series + 1)['max']

  series_value: (series, index) ->
    @data.getValue index, (series + 1)

  series_length: (series) ->
    @data.getNumberOfRows()


class JSONDataWrapper extends DataWrapper
  constructor: (json) ->
    if typeof json == 'string'
      @object = JSON.parse json
    else if typeof json == 'object'
      @object = json
    else
      throw Error "Please provide a JSON string or derived object."

  num_series: -> @object.data.length

  series_names: -> chunk.series for chunk in @object.data

  # TODO why is it that if I change "['values']" to ".values" below,
  #      it will pass tests but not function in Safari/Chrome?
  series_min: (series) -> Math.min.apply(@, @object.data[series]['values'])

  series_max: (series) -> Math.max.apply(@, @object.data[series]['values'])

  series_value: (series, index) -> @object.data[series]['values'][index]

  series_length: (series) -> @object.data[series]['values'].length


class HTMLTableDataWrapper extends DataWrapper
  constructor: (@table) ->
    throw Error "No table given." unless @table

  num_series: -> @table.getElementsByTagName('tr')[0].children.length

  series_names: ->
    element.textContent for element in @table.getElementsByTagName('th')

  _series_floats: (series) ->
    parseFloat element.textContent \
      for element in @table.getElementsByTagName('td')

  series_min: (series) ->
    Math.min.apply(@, @_series_floats(series))

  series_max: (series) ->
    Math.max.apply(@, @_series_floats(series))

  series_value: (series, index) ->
    parseFloat(@table
      .getElementsByTagName('tr')[index + 1]
      .children[series]
      .textContent)

  series_length: (series) -> @table.getElementsByTagName('tr').length - 1


#
# Pitch Mappers
#

class PitchMapper
  # TODO: test derived class thing?
  constructor: (@minimum_datum, @maximum_datum) ->
    if @minimum_datum > @maximum_datum
      throw Error 'minimum datum should be <= maximum datum'

  map: (datum) ->


class FrequencyPitchMapper extends PitchMapper
  constructor: (
    minimum_datum,
    maximum_datum,
    @minimum_frequency,
    @maximum_frequency) ->
    super(minimum_datum, maximum_datum)
    if @minimum_frequency > @maximum_frequency
      throw Error 'minimum frequency should be <= maximum frequency'
    @data_range = @maximum_datum - @minimum_datum

  map: (datum) ->
    # How far into the data scale is the datum?
    if @data_range
      ratio = (datum - @minimum_datum) / @data_range
    else
      ratio = 0.5  # flat data; return half-way frequency
    return @minimum_frequency \
      + ratio * (@maximum_frequency - @minimum_frequency)


class NotePitchMapper extends PitchMapper
  # pass


#
# Web Audio Sounder
#

# - Wraps the Web Audio API.
# - Takes care of the fact that AudioContext currentTime is ever-increasing,
#   whereas Player time is relative to the time the Player was created.
# - Manages the use of oscillators.
class WebAudioSounder
  constructor: (@context) ->
    @oscillator = @context.createOscillator()

  start: ->
    @oscillator.connect(@context.destination)
    @oscillator.start(0)
    return

  frequency: (frequency, offset) ->
    callback = =>
      @oscillator.frequency.value = frequency
      return
    setTimeout(callback, offset)
    return

  stop: (offset) ->
    @oscillator.stop(@context.currentTime + offset)
    return


#
# Player
#

class Player
  constructor: (duration, @data, @pitch_mapper, @sounder,
    @visual_callback = null) ->
    @interval = duration / @data.series_length(0)

  play: ->
    series_length = @data.series_length(0)
    series_max_index = series_length - 1
    @sounder.start(0)
    # Initial datum
    if @visual_callback?
      @visual_callback(0, 0)
    @sounder.frequency(@pitch_mapper.map(@data.series_value(0, 0)))

    # All the rest come after certain intervals
    for i in [1 .. series_max_index]
      offset = @interval * i
      # Visual
      if @visual_callback?
        @_highlight_enqueue(0, i, offset)
      # Audio
      @sounder.frequency(
        @pitch_mapper.map(@data.series_value(0, i)),
        offset)

    @sounder.stop((series_length * @interval) / 1000)
    return

  # Due to scoping behaviour, this has to be separate from the loop
  _highlight_enqueue: (series, row, offset) ->
    callback = =>
      @visual_callback(series, row)
      return
    setTimeout(callback, offset)
    return


#
# AudioChart and Helpers
#

# This is a thin wrapper around the /real/ AudioChart object that either tries
# to create/get an AudioContext (useful for when nothing else on the page is
# using the Web Audio API) or will pass along an existing AudioContext to said
# /real/ AudioChart object.
class AudioChart
  constructor: (options, context = null) ->
    #console.log 'AudioChart()', options, context
    if context is null
      # Check for Web Audio API support
      fail = "Sorry, it seems your browser doesn't support the Web Audio API."
      context = AudioContextGetter.get()
      throw Error(fail) unless context?

    return _AudioChart(options, context)


# This is the /real/ AudioChart object
class _AudioChart
  constructor: (options, context) ->
    #console.log '_AudioChart()', options, context
    # FIXME: This is presently un(-mechanically-)tested at integration level
    # Structure of options object is detailed in REFERENCE.md

    # TODO check for options.data, options.chart, ...
    data_wrapper = null
    callback = null
    switch options.type
      when 'google'
        data_wrapper = new GoogleDataWrapper(options.data)
        if options['chart']?
          callback = google_visual_callback_maker(options['chart'])
      when 'json'
        data_wrapper = new JSONDataWrapper(options.data)
      when 'html_table'
        data_wrapper = new HTMLTableDataWrapper(options.table)
        if options['highlight_class']?
          callback = html_table_visual_callback_maker(
            options.table
            options['highlight_class'])
      when 'test'
        return
      else
        throw Error "Invalid data type '#{options.type}' given."

    # TODO check options
    frequency_pitch_mapper = new FrequencyPitchMapper(
      data_wrapper.series_min(0),
      data_wrapper.series_max(0),
      options['frequency_low'],
      options['frequency_high'])

    sounder = new WebAudioSounder(context)

    # TODO check duration option
    player = new Player(
      options['duration'], data_wrapper, frequency_pitch_mapper, sounder,
        callback)
    player.play()


# Helper needed to ensure only one context is ever requested, and to
# even out cross-browser differences
class AudioContextGetter
  audio_context = null

  _get_audio_context = ->
    if window?  # needed to enable testing in jasmine-node
      if window.AudioContext?
        return new window.AudioContext()
      else if window.webkitAudioContext?
        return new window.webkitAudioContext()
    return null  # terminates both if branches (window? and browser support)

  @get: ->
    return audio_context ?= _get_audio_context()


# Callback generator ensures that setSelection will be called with the
# correct arguments and that the Player doesn't need to know about the chart.
google_visual_callback_maker = (chart) ->
  return (series, row) ->
    chart.setSelection([{'row': row, 'column': series + 1}])
    return


# Callback generator for visual indication of HTML table playback
html_table_visual_callback_maker = (table, class_name) ->
  return (series, row) ->
    cell.className = '' for cell in table.getElementsByTagName('td')
    cell = table.getElementsByTagName('td')[row]
    cell.className = class_name
    return


root = exports ? this
root.AudioChart = AudioChart
root._AudioChart = _AudioChart
root.AudioContextGetter = AudioContextGetter
root.DataWrapper = DataWrapper  # base
root.GoogleDataWrapper = GoogleDataWrapper
root.JSONDataWrapper = JSONDataWrapper
root.HTMLTableDataWrapper = HTMLTableDataWrapper
root.PitchMapper = PitchMapper  # base
root.FrequencyPitchMapper = FrequencyPitchMapper
root.NotePitchMapper = NotePitchMapper
root.WebAudioSounder = WebAudioSounder
root.Player = Player
root.google_visual_callback_maker = google_visual_callback_maker
root.html_table_visual_callback_maker = html_table_visual_callback_maker
