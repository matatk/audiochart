class DataWrapper
	constructor: -> throw 'please use a derived class'  # TODO: test throw?
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
		(@data.getColumnRange series + 1)['min']

	series_max: (series) ->
		(@data.getColumnRange series + 1)['max']

	series_value: (series, index) ->
		@data.getValue index, series + 1

	series_length: (series) ->
		@data.getNumberOfRows()


class PitchMapper
	constructor: (@minimum_datum, @maximum_datum) ->
		if @minimum_datum > @maximum_datum
			throw 'minimum datum should be <= maximum datum'
	map: (datum) ->


class FrequencyPitchMapper extends PitchMapper
	constructor: (
		minimum_datum,
		maximum_datum,
		@minimum_frequency,
		@maximum_frequency) ->
		super minimum_datum, maximum_datum
		if @minimum_frequency > @maximum_frequency
			throw 'minimum frequency should be <= maximum frequency'

	map: (datum) ->
		# how far into the data scale is the datum?
		data_range = @maximum_datum - @minimum_datum
		if data_range > 0
			ratio = (datum - @minimum_datum) / data_range
		else
			ratio = 0.5
		@minimum_frequency + ratio * (@maximum_frequency - @minimum_frequency)


class NotePitchMapper extends PitchMapper
	# pass


class Sounder
	constructor: -> throw 'please use a derived class'
	start: (opt_offset) ->
	stop: (opt_offset) ->


class WebAudioSounder extends Sounder
	constructor: (@context) ->
		@oscillator = @context.createOscillator()

	start: ->
		@oscillator.connect @context.destination
		@oscillator.start 0
		return

	frequency: (frequency, offset = 0) ->
		callback = =>
			@oscillator.frequency.value = frequency
			return
		setTimeout callback, offset
		return

	stop: (opt_offset = 0) ->
		@oscillator.stop 0  # NOTE: seems a browser bug that offset is ignored
		return


class DataSource
	constructor: (@data_wrapper, @pitch_mapper) ->

	num_series: ->
		@data_wrapper.num_series()

	series_names: ->
		@data_wrapper.series_names()

	series_value: (series, index) ->
		@pitch_mapper.map @data_wrapper.series_value series, index

	series_length: (series) ->
		@data_wrapper.series_length series


class Player
	constructor: (@data_source, @sounder) ->
		@interval = (5 * 1000) / @data_source.series_length 0

	play: ->
		series_length = @data_source.series_length 0
		series_max_index = series_length - 1
		@sounder.start 0
		@sounder.frequency @data_source.series_value(0, 0)

		callback_play = =>
			for i in [1 .. series_max_index]
				@sounder.frequency \
					@data_source.series_value(0, i),
					@interval * i
			return

		setTimeout callback_play, @interval
		setTimeout (=> @sounder.stop()), series_length * @interval
		return


class AudioChart
	constructor: (data) ->
		# This is presently untested at integration level
		@data_wrapper = new GoogleDataWrapper data
		@freq_pitch_mapper = new FrequencyPitchMapper \
			@data_wrapper.series_min(0),
			@data_wrapper.series_max(0),
			200,
			600
		@data_source = new DataSource @data_wrapper, @freq_pitch_mapper
		@sounder = new WebAudioSounder new webkitAudioContext
		@player = new Player @data_source, @sounder
		@player.play()


if exports?
	exports.AudioChart = AudioChart
	exports.DataWrapper = DataWrapper
	exports.GoogleDataWrapper = GoogleDataWrapper
	exports.PitchMapper = PitchMapper  # base
	exports.FrequencyPitchMapper = FrequencyPitchMapper
	exports.NotePitchMapper = NotePitchMapper
	exports.Sounder = Sounder  # base
	exports.WebAudioSounder = WebAudioSounder
	exports.DataSource = DataSource
	exports.Player = Player
else
	this['AudioChart'] = AudioChart
	this['DataWrapper'] = DataWrapper
	this['GoogleDataWrapper'] = GoogleDataWrapper
	this['PitchMapper'] = PitchMapper  # base
	this['FrequencyPitchMapper'] = FrequencyPitchMapper
	this['NotePitchMapper'] = NotePitchMapper
	this['Sounder'] = Sounder  # base
	this['WebAudioSounder'] = WebAudioSounder
	this['DataSource'] = DataSource
	this['Player'] = Player
