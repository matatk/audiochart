if exports?
	ac = require '../audiochart'
else
	ac = window


class FakeChart
	setSelection: (selection) ->


describe 'google_visual_callback', ->
	fake_chart = null
	fake_visual_callback = null

	beforeEach ->
		fake_chart = new FakeChart
		fake_visual_callback = ac._google_visual_callback_maker fake_chart
		spyOn fake_chart, 'setSelection'

	it 'correctly munges its parameters (1a)', ->
		fake_visual_callback 0, 0
		expect(fake_chart.setSelection).toHaveBeenCalledWith(
			[{'row': 0, 'column': 1}]
		)

	it 'correctly munges its parameters (1b)', ->
		fake_visual_callback 0, 1
		expect(fake_chart.setSelection).toHaveBeenCalledWith(
			[{'row': 1, 'column': 1}]
		)

	it 'correctly munges its parameters (1c)', ->
		fake_visual_callback 0, 2
		expect(fake_chart.setSelection).toHaveBeenCalledWith(
			[{'row': 2, 'column': 1}]
		)

	it 'correctly munges its parameters (2)', ->
		fake_visual_callback 1, 0
		expect(fake_chart.setSelection).toHaveBeenCalledWith(
			[{'row': 0, 'column': 2}]
		)
