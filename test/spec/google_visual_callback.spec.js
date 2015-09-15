describe('google_visual_callback', function() {
	var FakeChart = (function() {
		function FakeChart() {}
		FakeChart.prototype.setSelection = function(selection) {};
		return FakeChart;
	})();

	var fake_chart = null;
	var google_visual_callback = null;

	beforeEach(function() {
		fake_chart = new FakeChart();
		google_visual_callback = window.google_visual_callback_maker(fake_chart);
		spyOn(fake_chart, 'setSelection');
	});

	it('correctly munges its parameters (1a)', function() {
		google_visual_callback(0, 0);
		expect(fake_chart.setSelection).toHaveBeenCalledWith([
				{
					'row': 0,
					'column': 1
				}
		]);
	});

	it('correctly munges its parameters (1b)', function() {
		google_visual_callback(0, 1);
		expect(fake_chart.setSelection).toHaveBeenCalledWith([
				{
					'row': 1,
					'column': 1
				}
		]);
	});

	it('correctly munges its parameters (1c)', function() {
		google_visual_callback(0, 2);
		expect(fake_chart.setSelection).toHaveBeenCalledWith([
				{
					'row': 2,
					'column': 1
				}
		]);
	});

	it('correctly munges its parameters (2)', function() {
		google_visual_callback(1, 0);
		expect(fake_chart.setSelection).toHaveBeenCalledWith([
				{
					'row': 0,
					'column': 2
				}
		]);
	});
});
