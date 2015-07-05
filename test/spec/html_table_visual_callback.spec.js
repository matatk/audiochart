(function() {
  var ac;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  describe('html_table_visual_callback', function() {
    var fake_table, html_table_visual_callback;
    fake_table = null;
    html_table_visual_callback = null;
    beforeEach(function() {
      return html_table_visual_callback = ac._html_table_visual_callback_maker(fake_table);
    });
    return it('does something', function() {
      html_table_visual_callback(0, 0);
      return expect(true).toBe(true);
    });
  });

}).call(this);
