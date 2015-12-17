var test_one = '{ "data": [ { "series": "Test", "values": [ 2, 3, 3, 4 ] } ] }';
var test_neg = '{ "data": [ { "series": "Test", "values": [ 20, -10, 0, 8, -90 ] } ] }';

data_wrappers_test_core(
		'JSONDataWrapper, starting from string',
		new window.JSONDataWrapper(test_one),
		new window.JSONDataWrapper(test_neg));

data_wrappers_test_core(
		'JSONDataWrapper, starting from object',
		new window.JSONDataWrapper(JSON.parse(test_one)),
		new window.JSONDataWrapper(JSON.parse(test_neg)));

// FIXME test unhappy paths
