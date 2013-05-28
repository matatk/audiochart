if exports?
	ac = require '../audiochart'
else
	ac = window


# TODO: merge this with the fake data source
class FakeDataWrapper
	constructor: (@data) -> @fakedata = [ 2, 3, 3, 4 ]
	num_series: -> 1
	series_names: -> ['Test']
	#series_min: (series) ->
	#series_max: (series) ->
	series_value: (series, index) -> @fakedata[index]
	series_length: (series) -> 4


class FakePitchMapper
	constructor: (@minimum_datum, @maximum_datum) ->
	map: (datum) -> -datum


# TODO: factor out the tests to test the common API across data sources
describe 'DataSource', ->
	data = null

	beforeEach ->
		data = new ac.DataSource \
			new FakeDataWrapper(null),
			new FakePitchMapper

	it 'can get the number of series', ->
		(expect data.num_series()).toBe 1

	it 'can get series names', ->
		(expect data.series_names()).toEqual ['Test']

	xit 'can get the min and max value of data in a series', ->
		# NOTE: not doing this test (not needed for output)

	it 'can get values of data in a series', ->
		(expect data.series_value 0, 0).toBe -2
		(expect data.series_value 0, 1).toBe -3
		(expect data.series_value 0, 2).toBe -3
		(expect data.series_value 0, 3).toBe -4
	
	it 'reports its length', ->
		(expect data.series_length 0).toBe 4
