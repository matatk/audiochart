if exports?
	ac = require '../audiochart'
else
	ac = window


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


# TODO: factor out the tests to test the common API across data sources
describe 'GoogleDataWrapper', ->
	describe 'when storing non-negative data', ->
		data = null

		beforeEach ->
			data = new ac.GoogleDataWrapper new FakeGoogleDataTable test_one

		it 'can get the number of series', ->
			(expect data.num_series()).toBe 1

		it 'can get series names', ->
			(expect data.series_names()).toEqual ['Test']

		it 'can get the min and max value of data in a series', ->
			(expect data.series_min 0).toBe 2
			(expect data.series_max 0).toBe 4

		it 'can get values of data in a series', ->
			(expect data.series_value 0, 0).toBe 2
			(expect data.series_value 0, 1).toBe 3
			(expect data.series_value 0, 2).toBe 3
			(expect data.series_value 0, 3).toBe 4

		it 'gets the length of a series', ->
			(expect data.series_length 0).toBe 4

	describe 'when storing negative data', ->
		data = null

		beforeEach ->
			data = new ac.GoogleDataWrapper new FakeGoogleDataTable test_neg

		it 'can get the number of series', ->
			(expect data.num_series()).toBe 1

		it 'can get series names', ->
			(expect data.series_names()).toEqual ['Test']

		it 'can get the min and max value of data in a series', ->
			(expect data.series_min 0).toBe -90
			(expect data.series_max 0).toBe 20

		it 'can get values of data in a series', ->
			(expect data.series_value 0, 0).toBe 20
			(expect data.series_value 0, 1).toBe -10
			(expect data.series_value 0, 2).toBe 0
			(expect data.series_value 0, 3).toBe 8
			(expect data.series_value 0, 4).toBe -90

		it 'gets the length of a series', ->
			(expect data.series_length 0).toBe 5
