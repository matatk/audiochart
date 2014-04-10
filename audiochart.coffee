class DataWrapper
	constructor: (@data) -> throw new Error 'please use a derived class'  # TODO: test
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
				@highlight_enqueue 0, i, offset
			# Audio
			@sounder.frequency \
				@pitch_mapper.map(@data.series_value 0, i),
				offset

		@sounder.stop (series_length * @interval) / 1000
		return

	# Due to scoping behaviour, this has to be separate from the loop
	# TODO try making it a private member function (may not work due to var)
	highlight_enqueue: (series, row, offset) ->
		callback = =>
			@visual_callback(series, row)
			return
		setTimeout callback, offset
		return


class AudioChart
	constructor: (data, chart) ->
		# This is presently un(-mechanically-)tested at integration level
		fail = "Sorry, it seems your browser doesn't support the Web Audio API."
		data_wrapper = new GoogleDataWrapper data
		freq_pitch_mapper = new FrequencyPitchMapper \
			data_wrapper.series_min(0),
			data_wrapper.series_max(0),
			200,
			600
		context = audio_context_getter()
		if not context?
			alert fail
			throw new Error fail
		sounder = new WebAudioSounder context
		callback = google_visual_callback_maker chart
		player = new Player \
			data_wrapper, freq_pitch_mapper, sounder, callback
		player.play()


# Helper needed to even out cross-browser differences
audio_context_getter = ->
	if AudioContext?
		return new AudioContext
	else if webkitAudioContext?
		return new webkitAudioContext
	else
		return null


# Callback generator ensures that setSelection will be called with the
# correct arguments and that the Player doesn't need to know about the chart.
google_visual_callback_maker = (chart) ->
	return (series, row) ->
		chart.setSelection([{'row': row, 'column': series + 1}])
		return


if exports?
	exports.AudioChart = AudioChart
	exports.DataWrapper = DataWrapper  # base
	exports.GoogleDataWrapper = GoogleDataWrapper
	exports.PitchMapper = PitchMapper  # base
	exports.FrequencyPitchMapper = FrequencyPitchMapper
	exports.NotePitchMapper = NotePitchMapper
	exports.WebAudioSounder = WebAudioSounder
	exports.Player = Player
	exports.google_visual_callback_maker = google_visual_callback_maker
else
	this['AudioChart'] = AudioChart
	this['DataWrapper'] = DataWrapper  # base
	this['GoogleDataWrapper'] = GoogleDataWrapper
	this['PitchMapper'] = PitchMapper  # base
	this['FrequencyPitchMapper'] = FrequencyPitchMapper
	this['NotePitchMapper'] = NotePitchMapper
	this['WebAudioSounder'] = WebAudioSounder
	this['Player'] = Player
	this['google_visual_callback_maker'] = google_visual_callback_maker
