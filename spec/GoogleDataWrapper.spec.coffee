if exports?
	ac = require '../audiochart'
	dw = require './DataWrappers-common.spec'
else
	ac = window
	dw = window


# Test Data
test_one = [
	[ 0, 2 ],
	[ 1, 3 ],
	[ 2, 3 ],
	[ 3, 4 ]
]

test_neg = [
	[ 0,  20 ],
	[ 1, -10 ],
	[ 2,   0 ],
	[ 3,   8 ],
	[ 4, -90 ]
]


class FakeGoogleDataTable
	constructor: (@table) ->  # NOTE: paramater used for testing only
	getValue: (rowIndex, columnIndex) -> @table[rowIndex][columnIndex]
	getNumberOfColumns: -> 2
	getNumberOfRows: -> @table.length
	getColumnLabel: (columnIndex) -> 'Test'
	getColumnRange: (columnIndex) ->
		if columnIndex is 0
			{ min: 0, max: @table.length }
		else
			min = @table[0][columnIndex]
			max = @table[0][columnIndex]
			for row in @table
				value = row[columnIndex]
				min = value if min > value
				max = value if max < value
			{ min: min, max: max }


dw.data_wrappers_test_core \
	'GoogleDataWrapper',
	new ac.GoogleDataWrapper(new FakeGoogleDataTable test_one),
	new ac.GoogleDataWrapper(new FakeGoogleDataTable test_neg)
