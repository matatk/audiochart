if exports?
	ac = require '../audiochart'
else
	ac = window


# TODO: merge this with the fake data wrapper
class BaseFakeDataSource
	#constructor: (@data) -> @fakedata = [ . . . ]
	num_series: -> 1
	series_names: -> ['Test']
	#series_min: (series) ->
	#series_max: (series) ->
	series_value: (series, index) -> @fakedata[index]
	#series_length: (series) -> n


class ShortFakeDataSource extends BaseFakeDataSource
	constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 4


class LongFakeDataSource extends BaseFakeDataSource
	constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 100


class FakeSounder
	frequency: (frequency, offset) ->
	start: ->
	stop: ->


mixin_data_source = (msg, data_source_class, interval, call_count) ->
	describe msg, ->
		fake_sounder = null
		player = null

		beforeEach ->
			fake_sounder = new FakeSounder
			player = new ac.Player new data_source_class, fake_sounder

		it 'works out for how long to sound each datum', ->
			# FIXME assumes play time is five seconds
			(expect player.interval).toBe interval

		it 'makes calls appropriate to play the sound', ->
			# FIXME assumes play time is five seconds
			# TODO check the offsets are correct too?
			spyOn(fake_sounder, 'start')
			spyOn(fake_sounder, 'frequency')
			spyOn(fake_sounder, 'stop')
			result = 42

			runs ->
				result = player.play()

			waits 5000  # FIXME got to be a quicker way to wait for stop()

			runs ->
				(expect fake_sounder.start).toHaveBeenCalled()
				(expect fake_sounder.frequency.callCount).toBe call_count
				(expect fake_sounder.stop).toHaveBeenCalled()


describe 'Player', ->
	mixin_data_source \
		'instantiated with short fake data source',
		ShortFakeDataSource,
		1250,
		4

	mixin_data_source \
		'instantiated with long fake data source',
		LongFakeDataSource,
		50,
		100
