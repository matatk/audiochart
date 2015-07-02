if exports?
  ac = require '../audiochart'
else
  ac = window


expected_frequency_calls = (playback_time, series_length) ->
  # What are the paramaters of the expected calls to set the
  # frequency of the notes generated during playback?
  # Note: we're pretending that the frequency mapper will always return 21Hz.
  interval = playback_time / series_length
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


# TODO: test fake visual callback was called with correct params
# at correct times!
mixin_data_wrapper_core = (message, test_data_class, test_duration,
  test_call_count, test_interval, use_visual_callback) ->
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
          test_duration, fake_data, fake_mapper, fake_sounder,
            fake_visual_callback
      else
        player = new ac.Player \
          test_duration, fake_data, fake_mapper, fake_sounder

    it 'works out for how long to sound each datum', ->
      expect(player.interval).toBe test_interval

    it 'starts the sounder', ->
      jasmine.Clock.useMock()
      spyOn(fake_sounder, 'start')
      player.play()
      jasmine.Clock.tick test_duration
      expect(fake_sounder.start.callCount).toBe 1

    it 'stops the sounder', ->
      jasmine.Clock.useMock()
      spyOn(fake_sounder, 'stop')
      player.play()
      jasmine.Clock.tick test_duration
      expect(fake_sounder.stop.callCount).toBe 1

    it 'makes the correct number of map calls', ->
      jasmine.Clock.useMock()
      spyOn(fake_mapper, 'map')
      player.play()
      jasmine.Clock.tick test_duration
      expect(fake_mapper.map.callCount).toBe test_call_count

    it 'makes the right number of calls to the sounder', ->
      jasmine.Clock.useMock()
      spyOn(fake_sounder, 'frequency')
      player.play()
      jasmine.Clock.tick test_duration
      expect(fake_sounder.frequency.callCount).toBe test_call_count

    it 'calls the sounder with the correct arguments each time', ->
      jasmine.Clock.useMock()
      spyOn(fake_sounder, 'frequency')
      player.play()
      jasmine.Clock.tick test_duration
      expect(fake_sounder.frequency.argsForCall)
        .toEqual(expected_frequency_calls test_duration, test_call_count)

    if use_visual_callback
      it 'makes the correct number of visual callback calls', ->
        jasmine.Clock.useMock()
        player.play()
        jasmine.Clock.tick test_duration
        expect(fake_visual_callback.callCount).toBe test_call_count


mixin_data_wrapper = (message, test_data_class, test_duration, test_call_count,
  test_interval) ->
  # Test the Player with and without the simulated visual callback
  describe message, ->
    mixin_data_wrapper_core \
      'when not having a callback',
      test_data_class,
      test_duration,
      test_call_count,
      test_interval,
      false

    mixin_data_wrapper_core \
      'when having a callback',
      test_data_class,
      test_duration,
      test_call_count,
      test_interval,
      true


describe 'Player', ->
  mixin_data_wrapper \
    'instantiated with short fake data source for 5000ms',
    ShortFakeDataWrapper,
    5000,
    4,
    1250

  mixin_data_wrapper \
    'instantiated with short fake data source for 3000ms',
    ShortFakeDataWrapper,
    3000,
    4,
    750

  mixin_data_wrapper \
    'instantiated with long fake data source for 5000ms',
    LongFakeDataWrapper,
    5000,
    100,
    50

  mixin_data_wrapper \
    'instantiated with long fake data source for 2500ms',
    LongFakeDataWrapper,
    2500,
    100,
    25
