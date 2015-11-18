describe('HTMLTableDataWrapper', function() {
	jasmine.getFixtures().fixturesPath = 'spec/';
	loadFixtures('HTMLTableDataWrapper.fixtures.html');

	data_wrappers_test_core(
		'HTMLTableDataWrapper (data wrapper core)',
		new window.HTMLTableDataWrapper(document.getElementById('test_one')),
		new window.HTMLTableDataWrapper(document.getElementById('test_neg')));

	it('Throws when a null table is given', function() {
		expect(function() {
			new window.HTMLTableDataWrapper(document.getElementById('moo'));
		}).toThrow();
	});
});
