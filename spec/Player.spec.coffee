if exports?
	ac = require '../audiochart'
else
	ac = window


# TODO: DRY this wrt GoogleDataWrapper?
class BaseFakeDataWrapper
	#constructor: (@data) -> @fakedata = [ . . . ]
	num_series: -> 1
	series_names: -> ['Test']
	#series_min: (series) ->
	#series_max: (series) ->
	series_value: (series, index) -> @fakedata[index]
	#series_length: (series) -> n

class ShortFakeDataWrapper extends BaseFakeDataWrapper
	constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 4

class LongFakeDataWrapper extends BaseFakeDataWrapper
	constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 100


class FakeMapper
	map: ->


class FakeSounder
	frequency: (frequency, offset) ->
	start: ->
	stop: ->


mixin_data_wrapper = (msg, test_data_class, test_interval, test_call_count) ->
	describe msg, ->
		fake_mapper = null
		fake_sounder = null
		player = null

		beforeEach ->
			fake_mapper = new FakeMapper
			fake_sounder = new FakeSounder
			player = new ac.Player \
				new test_data_class, fake_mapper, fake_sounder

		it 'works out for how long to sound each datum', ->
			# FIXME assumes play time is five seconds
			(expect player.interval).toBe test_interval

		it 'makes calls appropriate to play the sound', ->
			# FIXME assumes play time is five seconds
			# FIXME test things are called at the right offsets
			spyOn(fake_mapper, 'map')
			spyOn(fake_sounder, 'start')
			spyOn(fake_sounder, 'frequency')
			spyOn(fake_sounder, 'stop')
			result = 42

			runs ->
				result = player.play()

			waits 5000  # FIXME got to be a quicker way to wait for stop()

			runs ->
				(expect fake_mapper.map.callCount).toBe test_call_count
				(expect fake_sounder.start).toHaveBeenCalled()
				(expect fake_sounder.frequency.callCount).toBe test_call_count
				(expect fake_sounder.stop).toHaveBeenCalled()


describe 'Player', ->
	mixin_data_wrapper \
		'instantiated with short fake data source',
		ShortFakeDataWrapper,
		1250,
		4

	mixin_data_wrapper \
		'instantiated with long fake data source',
		LongFakeDataWrapper,
		50,
		100
