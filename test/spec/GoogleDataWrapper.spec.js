var test_one = [[0, 2], [1, 3], [2, 3], [3, 4]];
var test_neg = [[0, 20], [1, -10], [2, 0], [3, 8], [4, -90]];

var FakeGoogleDataTable = (function() {
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
		var i, len, max, min, ref, row, value;
		if (columnIndex === 0) {
			return {
				min: 0,
				max: this.table.length
			};
		} else {
			min = this.table[0][columnIndex];
			max = this.table[0][columnIndex];
			ref = this.table;
			for (i = 0, len = ref.length; i < len; i++) {
				row = ref[i];
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

data_wrappers_test_core(
	'GoogleDataWrapper',
	new window.GoogleDataWrapper(new FakeGoogleDataTable(test_one)),
	new window.GoogleDataWrapper(new FakeGoogleDataTable(test_neg)));
