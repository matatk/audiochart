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

# Helper needed to even out cross-browser differences
audio_context_getter = ->
	if AudioContext?
		return new AudioContext
	else if webkitAudioContext?
		return new webkitAudioContext
	else
		throw new Error 'No support for Web Audio API'


class Player
	constructor: (@data_wrapper, @pitch_mapper, @sounder) ->
		@interval = (5 * 1000) / @data_wrapper.series_length 0

	play: ->
		series_length = @data_wrapper.series_length 0
		series_max_index = series_length - 1
		@sounder.start 0
		# Initial datum
		@sounder.frequency @pitch_mapper.map @data_wrapper.series_value(0, 0)

		# All the rest come after certain intervals
		for i in [1 .. series_max_index]
			@sounder.frequency \
				@pitch_mapper.map(@data_wrapper.series_value(0, i)),
				@interval * i

		@sounder.stop (series_length * @interval) / 1000
		return


class AudioChart
	constructor: (data) ->
		# This is presently un(-mechanically-)tested at integration level
		@data_wrapper = new GoogleDataWrapper data
		@freq_pitch_mapper = new FrequencyPitchMapper \
			@data_wrapper.series_min(0),
			@data_wrapper.series_max(0),
			200,
			600
		@sounder = new WebAudioSounder audio_context_getter()
		@player = new Player @data_wrapper, @freq_pitch_mapper, @sounder
		@player.play()


if exports?
	exports.AudioChart = AudioChart
	exports.DataWrapper = DataWrapper  # base
	exports.GoogleDataWrapper = GoogleDataWrapper
	exports.PitchMapper = PitchMapper  # base
	exports.FrequencyPitchMapper = FrequencyPitchMapper
	exports.NotePitchMapper = NotePitchMapper
	exports.WebAudioSounder = WebAudioSounder
	exports.Player = Player
else
	this['AudioChart'] = AudioChart
	this['DataWrapper'] = DataWrapper  # base
	this['GoogleDataWrapper'] = GoogleDataWrapper
	this['PitchMapper'] = PitchMapper  # base
	this['FrequencyPitchMapper'] = FrequencyPitchMapper
	this['NotePitchMapper'] = NotePitchMapper
	this['WebAudioSounder'] = WebAudioSounder
	this['Player'] = Player
