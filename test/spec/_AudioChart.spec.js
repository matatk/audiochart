describe('_AudioChart', function() {
	it('throws when an errant `options.type` is supplied', function() {
		var options = {
			'type': 'moo'
		};
		expect(function() {
			new _AudioChart(options, null);
		}).toThrow(Error("Invalid data type 'moo' given."));
	});

	it('assigns the JSON data wrapper, parameter and callback', function() {
		var options = {
			'type': 'json',
			'data': 42
		};
		expect(_AudioChart._assign_wrapper_callback(options))
			.toEqual({
				'wrapper': JSONDataWrapper,
				'parameter': 42,
				'callback': null
			});
	});
});
