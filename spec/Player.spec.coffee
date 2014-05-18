if exports?
	ac = require '../audiochart'
else
	ac = window


# TODO: Ensure this interface is kept up-to-date wrt DataWrappers
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


mixin_data_wrapper_core = (msg, test_data_class, use_callback, test_interval, test_call_count) ->
	describe msg, ->
		fake_mapper = null
		fake_sounder = null
		if use_callback
			fake_callback = null
		player = null

		beforeEach ->
			fake_mapper = new FakeMapper
			fake_sounder = new FakeSounder
			if use_callback
				fake_callback = jasmine.createSpy 'fake_callback'
				player = new ac.Player \
					new test_data_class, fake_mapper, fake_sounder, fake_callback
			else
				player = new ac.Player \
					new test_data_class, fake_mapper, fake_sounder

		it 'works out for how long to sound each datum', ->
			# FIXME assumes play time is five seconds
			expect(player.interval).toBe test_interval

		it 'makes calls appropriate to play the sound', ->
			# FIXME assumes play time is five seconds
			# FIXME test things are called at the right offsets
			# FIXME test that callback was called with correct params
			jasmine.Clock.useMock()
			spyOn(fake_mapper, 'map')
			spyOn(fake_sounder, 'start')
			spyOn(fake_sounder, 'frequency')
			spyOn(fake_sounder, 'stop')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_mapper.map.callCount).toBe test_call_count
			expect(fake_sounder.start).toHaveBeenCalled()
			expect(fake_sounder.frequency.callCount).toBe test_call_count
			expect(fake_sounder.stop).toHaveBeenCalled()
			if use_callback
				expect(fake_callback.callCount).toBe test_call_count


mixin_data_wrapper = (msg, test_data_class, test_interval, test_call_count) ->
	describe msg, ->
		mixin_data_wrapper_core \
			'when not having a callback',
			test_data_class,
			false,
			test_interval,
			test_call_count
		mixin_data_wrapper_core \
			'when having a callback',
			test_data_class,
			true,
			test_interval,
			test_call_count


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
