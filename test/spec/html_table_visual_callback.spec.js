(function() {
  var HTML_FILE_NAME, ac, document, fs, headless, html_string, jsdom, run_tests;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
    fs = require('fs');
    jsdom = require('jsdom').jsdom;
    headless = true;
  } else {
    ac = window;
    headless = false;
  }

  HTML_FILE_NAME = 'HTMLTableDataWrapper.fixtures.html';

  run_tests = function(doc) {
    return describe('html_table_visual_callback', function() {
      var highlight_class_name, html_table_visual_callback, table;
      html_table_visual_callback = null;
      highlight_class_name = 'audiochart-playing';
      table = null;
      beforeEach(function() {
        table = doc.getElementById('test_one');
        return html_table_visual_callback = ac._html_table_visual_callback_maker(table, 'audiochart-playing');
      });
      it('does not add a class before it is called', function() {
        var first_data_cell;
        first_data_cell = table.getElementsByTagName('td')[0];
        return expect(first_data_cell.className).toBe('');
      });
      it('has added a class after it is called', function() {
        var first_data_cell;
        html_table_visual_callback(0, 0);
        first_data_cell = table.getElementsByTagName('td')[0];
        return expect(first_data_cell.className).toBe(highlight_class_name);
      });
      return it('has removes the class from one cell and adds it to another', function() {
        var first_data_cell, second_data_cell;
        html_table_visual_callback(0, 0);
        first_data_cell = table.getElementsByTagName('td')[0];
        expect(first_data_cell.className).toBe(highlight_class_name);
        html_table_visual_callback(0, 1);
        second_data_cell = table.getElementsByTagName('td')[1];
        expect(first_data_cell.className).toBe('');
        return expect(second_data_cell.className).toBe(highlight_class_name);
      });
    });
  };

  if (headless) {
    html_string = fs.readFileSync(__dirname + '/' + HTML_FILE_NAME);
    document = jsdom(html_string);
    run_tests(document);
  } else {
    loadFixtures('spec/' + HTML_FILE_NAME);
    run_tests(window.document);
  }

}).call(this);
