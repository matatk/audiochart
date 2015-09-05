(function() {
  var FakeGoogleDataTable, ac, dw, test_neg, test_one;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
    dw = require('./DataWrappers-common.spec');
  } else {
    ac = window;
    dw = window;
  }

  test_one = [[0, 2], [1, 3], [2, 3], [3, 4]];

  test_neg = [[0, 20], [1, -10], [2, 0], [3, 8], [4, -90]];

  FakeGoogleDataTable = (function() {
    function FakeGoogleDataTable(table) {
      this.table = table;
    }

    FakeGoogleDataTable.prototype.getValue = function(rowIndex, columnIndex) {
      return this.table[rowIndex][columnIndex];
    };

    FakeGoogleDataTable.prototype.getNumberOfColumns = function() {
      return 2;
    };

    FakeGoogleDataTable.prototype.getNumberOfRows = function() {
      return this.table.length;
    };

    FakeGoogleDataTable.prototype.getColumnLabel = function(columnIndex) {
      return 'Test';
    };

    FakeGoogleDataTable.prototype.getColumnRange = function(columnIndex) {
      var max, min, row, value, _i, _len, _ref;
      if (columnIndex === 0) {
        return {
          min: 0,
          max: this.table.length
        };
      } else {
        min = this.table[0][columnIndex];
        max = this.table[0][columnIndex];
        _ref = this.table;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          value = row[columnIndex];
          if (min > value) {
            min = value;
          }
          if (max < value) {
            max = value;
          }
        }
        return {
          min: min,
          max: max
        };
      }
    };

    return FakeGoogleDataTable;

  })();

  dw.data_wrappers_test_core('GoogleDataWrapper', new ac.GoogleDataWrapper(new FakeGoogleDataTable(test_one)), new ac.GoogleDataWrapper(new FakeGoogleDataTable(test_neg)));

}).call(this);
