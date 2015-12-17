describe('_AudioChart', function() {
	it('throws when an errant `options.type` is supplied', function() {
		var options = {
			'type': 'moo'
		};

		expect(function() {
			new _AudioChart(options, null);
		}).toThrow(Error("Invalid data type 'moo' given."));
	});

	it('assigns a JSON data wrapper, parameter and no callback', function() {
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

	it('assigns a Google wrapper and parameter without a chart', function() {
		var options = {
			'type': 'google',
			'data': 42
		};

		expect(_AudioChart._assign_wrapper_callback(options))
			.toEqual({
				'wrapper': GoogleDataWrapper,
				'parameter': 42,
				'callback': null
			});
	});

	it('assigns a Google wrapper, parameter and chart callback', function() {
		var options = {
			'type': 'google',
			'data': 42,
			'chart': {}
		};

		// FIXME Given that we have to do this to stub out this callback
		// maker, maybe it is better to revert to doing this for *all* of
		// these tests, because returning this artificial object thing is
		// a bit naff...
		spyOn(window, 'google_visual_callback_maker').and.returnValue(42);

		expect(_AudioChart._assign_wrapper_callback(options))
			.toEqual({
				'wrapper': GoogleDataWrapper,
				'parameter': 42,
				'callback': 42
			});
	});

	it('assigns a HTML data wrapper, parameter and no callback', function() {
		var options = {
			'type': 'html_table',
			'table': 42
		};

		expect(_AudioChart._assign_wrapper_callback(options))
			.toEqual({
				'wrapper': HTMLTableDataWrapper,
				'parameter': 42,
				'callback': null
			});
	});

	it('assigns a HTML data wrapper, parameter and callback', function() {
		var options = {
			'type': 'html_table',
			'table': 42,
			'highlight_class': 'moo'
		};

		spyOn(window, 'html_table_visual_callback_maker').and.returnValue(42);

		expect(_AudioChart._assign_wrapper_callback(options))
			.toEqual({
				'wrapper': HTMLTableDataWrapper,
				'parameter': 42,
				'callback': 42
			});

		expect(html_table_visual_callback_maker)
			.toHaveBeenCalledWith(42, 'moo');
	});
});
