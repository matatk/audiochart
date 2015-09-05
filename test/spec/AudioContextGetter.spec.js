(function() {
  var ac;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  describe('AudioContextGetter', function() {
    return it('returns the same audio context when called again', function() {
      var context1, context2, context3;
      context1 = ac.AudioContextGetter.get();
      context2 = ac.AudioContextGetter.get();
      context3 = ac.AudioContextGetter.get();
      expect(context1).toBe(context2);
      return expect(context2).toBe(context3);
    });
  });

}).call(this);
