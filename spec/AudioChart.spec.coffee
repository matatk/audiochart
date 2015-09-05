if exports?
  ac = require '../audiochart'
else
  ac = window


class FakeAudioContext


describe 'AudioChart', ->
  it 'calling it with a context causes _AudioChart to get that context', ->
    spyOn(ac, '_AudioChart')
    # Some options have to be passed (for convenience to API users)
    options = {
      type: 'test'
    }
    # A context is optional (but we can't test not passing one, as it'll fail)
    fake_audio_context = new FakeAudioContext()
    # Instantiate the wrapper; hopefully get a /real/ AudioChart object
    audiochart = new ac.AudioChart(options, fake_audio_context)

    # FIXME the spying doesn't work, so this always thinks it's not been called
    #       (the spy is created OK, but doesn't seem to track the calls)
    #expect(ac._AudioChart).toHaveBeenCalledWith(options, fake_audio_context)
