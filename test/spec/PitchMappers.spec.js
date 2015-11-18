var mixin_min_max = function(klass, test_min, test_max) {
	describe('Minimum and Maximum data', function() {
		var obj = null;

		beforeEach(function() {
			obj = new klass(test_min, test_max);
		});

		it('stores a minimum data value [not for public use]', function() {
			expect(obj.minimum_datum).toBe(test_min);
		});

		it('stores a maximum data value [not for public use]', function() {
			expect(obj.maximum_datum).toBe(test_max);
		});

		it('will not allow min datum > max datum', function() {
			expect(function() {
				new klass(test_max, test_min);
			}).toThrow();
		});
	});
};


describe('PitchMapper', function() {
	var MIN = -4;
	var MAX = 2;
	mixin_min_max(window.PitchMapper, MIN, MAX);
});


describe('FrequencyPitchMapper', function() {
	var MIN = 0;
	var MAX = 42;

	mixin_min_max(window.FrequencyPitchMapper, MIN, MAX);

	it('will not allow min frequency > max frequency', function() {
		expect(function() {
			new window.FrequencyPitchMapper(0, 42, MAX, MIN);
		}).toThrow();
	});

	describe('maps from input data to a frequency', function() {
		it('test range 1', function() {
			var fm = new window.FrequencyPitchMapper(0, 42, 100, 1000);
			expect(fm.map(0)).toBe(100);
			expect(fm.map(42)).toBe(1000);
			expect(fm.map(21)).toBe(550);
		});

		it('test range 2', function() {
			var fm = new window.FrequencyPitchMapper(0, 100, 0, 100);
			expect(fm.map(0)).toBe(0);
			expect(fm.map(21)).toBe(21);
			expect(fm.map(42)).toBe(42);
			expect(fm.map(50)).toBe(50);
			expect(fm.map(70)).toBe(70);
			expect(fm.map(100)).toBe(100);
		});

		it('test range 3', function() {
			var fm = new window.FrequencyPitchMapper(0, 100, 1, 101);
			expect(fm.map(0)).toBe(1);
			expect(fm.map(21)).toBe(22);
			expect(fm.map(42)).toBe(43);
			expect(fm.map(50)).toBe(51);
			expect(fm.map(70)).toBe(71);
			expect(fm.map(100)).toBe(101);
		});

		it('test range 4', function() {
			var fm = new window.FrequencyPitchMapper(-100, 0, 0, 100);
			expect(fm.map(-100)).toBe(0);
			expect(fm.map(-70)).toBe(30);
			expect(fm.map(-50)).toBe(50);
			expect(fm.map(-20)).toBe(80);
			expect(fm.map(0)).toBe(100);
		});

		it('test range 5', function() {
			var fm = new window.FrequencyPitchMapper(-100, 100, 0, 100);
			expect(fm.map(-100)).toBe(0);
			expect(fm.map(-50)).toBe(25);
			expect(fm.map(0)).toBe(50);
			expect(fm.map(50)).toBe(75);
			expect(fm.map(100)).toBe(100);
		});

		it('test range 6', function() {
			var fm = new window.FrequencyPitchMapper(42, 42, 0, 100);
			expect(fm.map(42)).toBe(50);
		});
	});
});


describe('NotePitchMapper', function() {
	var MIN = 0;
	var MAX = 42;
	mixin_min_max(window.NotePitchMapper, MIN, MAX);
});
