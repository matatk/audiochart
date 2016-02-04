describe('AudioChart', function() {
	var fake_options = null;

	beforeEach(function() {
		fake_options = { type: 'test' };
	});

	it('passes its context to _AudioChart', function() {
		function FakeAudioContext() {}
		var fake_audio_context = new FakeAudioContext();
		spyOn(window, '_AudioChart');

		var audiochart = new AudioChart(fake_options, fake_audio_context);
		expect(_AudioChart)
			.toHaveBeenCalledWith(fake_options, fake_audio_context);
	});

	it('can create a new context and pass it to _AudioChart', function() {
		spyOn(window, '_AudioChart');
		spyOn(AudioContextGetter, 'get').and.returnValue(42);

		var audiochart = new AudioChart(fake_options);
		expect(_AudioChart)
			.toHaveBeenCalledWith(fake_options, 42);
	});

	it('throws with a message if Web Audio API is unsupported', function() {
		spyOn(AudioContextGetter, 'get').and.returnValue(null);
		expect(function() {
			new AudioChart(fake_options);
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		);
	});
});
