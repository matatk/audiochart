describe('html_table_visual_callback', function() {
	jasmine.getFixtures().fixturesPath = 'spec/';

	var html_table_visual_callback = null;
	var highlight_class_name = 'audiochart-playing';
	var table = null;

	beforeEach(function() {
		loadFixtures('HTMLTableDataWrapper.fixtures.html');
		table = document.getElementById('test_one');
		html_table_visual_callback = window.html_table_visual_callback_maker(table, 'audiochart-playing');
	});

	it('does not add a class before it is called', function() {
		var first_data_cell;
		first_data_cell = table.getElementsByTagName('td')[0];
		expect(first_data_cell.className).toBe('');
	});

	it('has added a class after it is called', function() {
		var first_data_cell;
		html_table_visual_callback(0, 0);
		first_data_cell = table.getElementsByTagName('td')[0];
		expect(first_data_cell.className).toBe(highlight_class_name);
	});

	it('has removes the class from one cell and adds it to another', function() {
		var first_data_cell, second_data_cell;
		html_table_visual_callback(0, 0);
		first_data_cell = table.getElementsByTagName('td')[0];
		expect(first_data_cell.className).toBe(highlight_class_name);
		html_table_visual_callback(0, 1);
		second_data_cell = table.getElementsByTagName('td')[1];
		expect(first_data_cell.className).toBe('');
		expect(second_data_cell.className).toBe(highlight_class_name);
	});
});
