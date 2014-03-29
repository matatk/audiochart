// Generated by CoffeeScript 1.7.1
(function() {
  var FakeGoogleDataTable, ac, test_neg, test_one;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
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

  describe('GoogleDataWrapper', function() {
    describe('when storing non-negative data', function() {
      var data;
      data = null;
      beforeEach(function() {
        return data = new ac.GoogleDataWrapper(new FakeGoogleDataTable(test_one));
      });
      it('can get the number of series', function() {
        return expect(data.num_series()).toBe(1);
      });
      it('can get series names', function() {
        return expect(data.series_names()).toEqual(['Test']);
      });
      it('can get the min and max value of data in a series', function() {
        expect(data.series_min(0)).toBe(2);
        return expect(data.series_max(0)).toBe(4);
      });
      it('can get values of data in a series', function() {
        expect(data.series_value(0, 0)).toBe(2);
        expect(data.series_value(0, 1)).toBe(3);
        expect(data.series_value(0, 2)).toBe(3);
        return expect(data.series_value(0, 3)).toBe(4);
      });
      return it('gets the length of a series', function() {
        return expect(data.series_length(0)).toBe(4);
      });
    });
    return describe('when storing negative data', function() {
      var data;
      data = null;
      beforeEach(function() {
        return data = new ac.GoogleDataWrapper(new FakeGoogleDataTable(test_neg));
      });
      it('can get the number of series', function() {
        return expect(data.num_series()).toBe(1);
      });
      it('can get series names', function() {
        return expect(data.series_names()).toEqual(['Test']);
      });
      it('can get the min and max value of data in a series', function() {
        expect(data.series_min(0)).toBe(-90);
        return expect(data.series_max(0)).toBe(20);
      });
      it('can get values of data in a series', function() {
        expect(data.series_value(0, 0)).toBe(20);
        expect(data.series_value(0, 1)).toBe(-10);
        expect(data.series_value(0, 2)).toBe(0);
        expect(data.series_value(0, 3)).toBe(8);
        return expect(data.series_value(0, 4)).toBe(-90);
      });
      return it('gets the length of a series', function() {
        return expect(data.series_length(0)).toBe(5);
      });
    });
  });

}).call(this);
