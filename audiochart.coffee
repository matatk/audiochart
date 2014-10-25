class DataWrapper
	constructor: (@data) -> throw new Error 'Please use a derived class'
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
			throw new Error "Please provide a JSON string or derived object."
	num_series: -> @object.data.length
	series_names: -> chunk.series for chunk in @object.data
	# TODO why is it that if I change "['values']" to ".values" below,
	#      it will pass tests but not function in Safari/Chrome?
	series_min: (series) -> Math.min.apply @, @object.data[series]['values']
	series_max: (series) -> Math.max.apply @, @object.data[series]['values']
	series_value: (series, index) -> @object.data[series]['values'][index]
	series_length: (series) -> @object.data[series]['values'].length

class HTMLTableDataWrapper extends DataWrapper
	constructor: (doc, id) ->
		@table = doc.getElementById id
		if not @table?
			throw new Error 'Failed to find table with id "' + id + '".'
	num_series: -> @table.getElementsByTagName('tr')[0].children.length
	series_names: ->
		element.textContent for element in @table.getElementsByTagName 'th'
	_series_floats: (series) ->
		parseFloat element.textContent \
			for element in @table.getElementsByTagName 'td'
	series_min: (series) ->
		Math.min.apply @, @_series_floats series
	series_max: (series) ->
		Math.max.apply @, @_series_floats series
	series_value: (series, index) ->
		parseFloat(@table
			.getElementsByTagName('tr')[index + 1]
			.children[series]
			.textContent)
	series_length: (series) -> @table.getElementsByTagName('tr').length - 1


class PitchMapper
	# TODO: test derived class thing?
	constructor: (@minimum_datum, @maximum_datum) ->
		if @minimum_datum > @maximum_datum
			throw new Error 'minimum datum should be <= maximum datum'
	map: (datum) ->

class FrequencyPitchMapper extends PitchMapper
	constructor: (
		minimum_datum,
		maximum_datum,
		@minimum_frequency,
		@maximum_frequency) ->
		super minimum_datum, maximum_datum
		if @minimum_frequency > @maximum_frequency
			throw new Error 'minimum frequency should be <= maximum frequency'
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


class WebAudioSounder
	constructor: (@context) ->
		@oscillator = @context.createOscillator()

	start: ->
		@oscillator.connect @context.destination
		@oscillator.start 0
		return

	frequency: (frequency, offset) ->
		callback = =>
			@oscillator.frequency.value = frequency
			return
		setTimeout callback, offset
		return

	stop: (offset) ->
		@oscillator.stop offset
		return


class Player
	constructor: (@data, @pitch_mapper, @sounder, @visual_callback = null) ->
		@interval = (5 * 1000) / @data.series_length 0

	play: ->
		series_length = @data.series_length 0
		series_max_index = series_length - 1
		@sounder.start 0
		# Initial datum
		if @visual_callback?
			@visual_callback 0, 0
		@sounder.frequency @pitch_mapper.map @data.series_value(0, 0)

		# All the rest come after certain intervals
		for i in [1 .. series_max_index]
			offset = @interval * i
			# Visual
			if @visual_callback?
				@_highlight_enqueue 0, i, offset
			# Audio
			@sounder.frequency \
				@pitch_mapper.map(@data.series_value 0, i),
				offset

		@sounder.stop (series_length * @interval) / 1000
		return

	# Due to scoping behaviour, this has to be separate from the loop
	_highlight_enqueue: (series, row, offset) ->
		callback = =>
			@visual_callback(series, row)
			return
		setTimeout callback, offset
		return


class AudioChart
	constructor: (options) ->
		# TODO: This is presently un(-mechanically-)tested at integration level
		# Structure of options object is detailed in REFERENCE.md

		error_support = 
			"Sorry, it seems your browser doesn't support the Web Audio API."
		context = _audio_context_getter()
		if not context?
			alert fail
			throw new Error fail

		# TODO check for options.data, options.chart, ...
		error_type = "Invalid data type '#{options.type}' given."
		data_wrapper = null
		callback = null
		switch options.type
			when 'google'
				data_wrapper = new GoogleDataWrapper options.data
				if options['chart']?
					callback = _google_visual_callback_maker options['chart']
			when 'json'
				data_wrapper = new JSONDataWrapper options.data
			when 'html_table'
				data_wrapper = new HTMLTableDataWrapper \
					options['html_document'],
					options['html_table_id']
			else
				alert error_type
				throw new Error error_type

		# TODO check options
		frequency_pitch_mapper = new FrequencyPitchMapper \
			data_wrapper.series_min(0),
			data_wrapper.series_max(0),
			options['frequency_low'],
			options['frequency_high']

		sounder = new WebAudioSounder context
		player = new Player \
			data_wrapper, frequency_pitch_mapper, sounder, callback
		player.play()


# Helper needed to even out cross-browser differences
_audio_context_getter = ->
	if AudioContext?
		return new AudioContext
	else if webkitAudioContext?
		return new webkitAudioContext
	else
		return null


# Callback generator ensures that setSelection will be called with the
# correct arguments and that the Player doesn't need to know about the chart.
_google_visual_callback_maker = (chart) ->
	return (series, row) ->
		chart.setSelection([{'row': row, 'column': series + 1}])
		return


if exports?
	exports.AudioChart = AudioChart
	exports.DataWrapper = DataWrapper  # base
	exports.GoogleDataWrapper = GoogleDataWrapper
	exports.JSONDataWrapper = JSONDataWrapper
	exports.HTMLTableDataWrapper = HTMLTableDataWrapper
	exports.PitchMapper = PitchMapper  # base
	exports.FrequencyPitchMapper = FrequencyPitchMapper
	exports.NotePitchMapper = NotePitchMapper
	exports.WebAudioSounder = WebAudioSounder
	exports.Player = Player
	exports._google_visual_callback_maker = _google_visual_callback_maker
else
	this['AudioChart'] = AudioChart
	this['DataWrapper'] = DataWrapper  # base
	this['GoogleDataWrapper'] = GoogleDataWrapper
	this['JSONDataWrapper'] = JSONDataWrapper
	this['HTMLTableDataWrapper'] = HTMLTableDataWrapper
	this['PitchMapper'] = PitchMapper  # base
	this['FrequencyPitchMapper'] = FrequencyPitchMapper
	this['NotePitchMapper'] = NotePitchMapper
	this['WebAudioSounder'] = WebAudioSounder
	this['Player'] = Player
	this['_google_visual_callback_maker'] = _google_visual_callback_maker
