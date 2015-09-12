describe('AudioContextGetter', function() {
	it('returns the same audio context when called again', function() {
		var context1, context2, context3;
		context1 = window.AudioContextGetter.get();
		context2 = window.AudioContextGetter.get();
		context3 = window.AudioContextGetter.get();
		expect(context1).toBe(context2);
		expect(context2).toBe(context3);
	});
});
