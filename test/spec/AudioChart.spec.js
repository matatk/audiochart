describe('AudioChart', function() {
  var fake_options = null;

  beforeEach(function() {
    fake_options = { type: 'test' };
  });

  it('passes its context to _AudioChart', function() {
    function FakeAudioContext() {}
    var fake_audio_context = new FakeAudioContext();
    spyOn(window, '_AudioChart');

    var audiochart = new window.AudioChart(fake_options, fake_audio_context);
    expect(window._AudioChart)
      .toHaveBeenCalledWith(fake_options, fake_audio_context);
  });

  it('can create a new context and pass it to _AudioChart', function() {
    spyOn(window, '_AudioChart');
	spyOn(window.AudioContextGetter, 'get').and.returnValue(42);

    var audiochart = new window.AudioChart(fake_options);
    expect(window._AudioChart)
      .toHaveBeenCalledWith(fake_options, 42);
  });
});
