(function() {
  var FakeAudioContext, ac;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  FakeAudioContext = (function() {
    function FakeAudioContext() {}

    return FakeAudioContext;

  })();

  describe('AudioChart', function() {
    return it('calling it with a context causes _AudioChart to get that context', function() {
      var audiochart, fake_audio_context, options;
      spyOn(ac, '_AudioChart');
      options = {
        type: 'test'
      };
      fake_audio_context = new FakeAudioContext();
      return audiochart = new ac.AudioChart(options, fake_audio_context);
    });
  });

}).call(this);
