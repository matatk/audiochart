if exports?
	ac = require '../audiochart'
else
	ac = window


# FIXME assumes 5000 milliseconds
expected_frequency_calls = (series_length) ->
	# What are the paramaters of the expectec calls to set the
	# frequency of the notes generated during playback?
	interval = 5000 / series_length
	out = []
	# The first call won't make use of the optional offset parameter
	out.push [ 21 ]
	for i in [1..series_length - 1]
		out.push [ 21, interval * i ]
	return out


# TODO: Ensure this interface is kept up-to-date wrt DataWrappers
class BaseFakeDataWrapper
	#constructor: (@data) -> @fakedata = [ . . . ]
	num_series: -> 1
	series_names: -> ['Test']
	#series_min: (series) ->
	#series_max: (series) ->
	series_value: (series, index) -> 42
	#series_length: (series) -> n

class ShortFakeDataWrapper extends BaseFakeDataWrapper
	#constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 4

class LongFakeDataWrapper extends BaseFakeDataWrapper
	#constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	series_length: (series) -> 100


class FakeMapper
	map: (datum) -> 21


class FakeSounder
	frequency: (frequency, offset) ->
	start: ->
	stop: ->


# FIXME test fake visual callback was called with correct params at correct times!
mixin_data_wrapper_core = (message, test_data_class, use_visual_callback, test_interval, test_call_count) ->
	# Check that the Player makes the right calls to its mapper, sounder
	# and visual callback (if applicable)
	describe message, ->
		fake_data = null
		fake_mapper = null
		fake_sounder = null
		if use_visual_callback
			fake_visual_callback = null
		player = null

		beforeEach ->
			fake_data = new test_data_class
			fake_mapper = new FakeMapper
			fake_sounder = new FakeSounder
			if use_visual_callback
				fake_visual_callback = jasmine.createSpy 'fake_visual_callback'
				player = new ac.Player \
					fake_data, fake_mapper, fake_sounder, fake_visual_callback
			else
				player = new ac.Player \
					fake_data, fake_mapper, fake_sounder

		it 'works out for how long to sound each datum', ->
			# FIXME assumes play time is five seconds
			expect(player.interval).toBe test_interval

		it 'starts the sounder', ->
			jasmine.Clock.useMock()
			spyOn(fake_sounder, 'start')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_sounder.start.callCount).toBe 1

		it 'stops the sounder', ->
			jasmine.Clock.useMock()
			spyOn(fake_sounder, 'stop')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_sounder.stop.callCount).toBe 1

		it 'makes the correct number of map calls', ->
			# FIXME assumes play time is five seconds
			jasmine.Clock.useMock()
			spyOn(fake_mapper, 'map')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_mapper.map.callCount).toBe test_call_count

		it 'makes the right number of calls to the sounder', ->
			# FIXME assumes play time is five seconds
			jasmine.Clock.useMock()
			spyOn(fake_sounder, 'frequency')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_sounder.frequency.callCount).toBe test_call_count

		it 'calls the sounder with the correct arguments each time', ->
			# FIXME assumes play time is five seconds
			jasmine.Clock.useMock()
			spyOn(fake_sounder, 'frequency')
			player.play()
			jasmine.Clock.tick 5000
			expect(fake_sounder.frequency.argsForCall)
				.toEqual(expected_frequency_calls test_call_count)

		if use_visual_callback
			it 'makes the correct number of visual callback calls', ->
				# FIXME assumes play time is five seconds
				jasmine.Clock.useMock()
				player.play()
				jasmine.Clock.tick 5000
				expect(fake_visual_callback.callCount).toBe test_call_count


mixin_data_wrapper = (message, test_data_class, test_interval, test_call_count) ->
	# Test the Player with and without the simulated visual callback
	describe message, ->
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
