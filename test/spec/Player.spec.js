var expected_frequency_calls = function(playback_time, series_length) {
	// TODO tidy up
	var i, interval, j, out, ref;
	interval = playback_time / series_length;
	out = [];
	out.push([21]);
	for (i = j = 1, ref = series_length - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
		out.push([21, interval * i]);
	}
	return out;
};


var BaseFakeDataWrapper = (function() {
	function BaseFakeDataWrapper() {}

	BaseFakeDataWrapper.prototype.num_series = function() {
		return 1;
	};

	BaseFakeDataWrapper.prototype.series_names = function() {
		return ['Test'];
	};

	BaseFakeDataWrapper.prototype.series_value = function(series, index) {
		return 42;
	};

	return BaseFakeDataWrapper;
})();


var ShortFakeDataWrapper = (function() {
	function ShortFakeDataWrapper() {
		return BaseFakeDataWrapper.call(this, arguments);
	}

	ShortFakeDataWrapper.prototype = Object.create(BaseFakeDataWrapper.prototype);
	ShortFakeDataWrapper.prototype.constructor = ShortFakeDataWrapper;

	ShortFakeDataWrapper.prototype.series_length = function(series) {
		return 4;
	};

	return ShortFakeDataWrapper;
})();


var LongFakeDataWrapper = (function() {
	function LongFakeDataWrapper() {
		return BaseFakeDataWrapper.call(this, arguments);
	}

	LongFakeDataWrapper.prototype = Object.create(BaseFakeDataWrapper.prototype);
	LongFakeDataWrapper.prototype.constructor = LongFakeDataWrapper;

	LongFakeDataWrapper.prototype.series_length = function(series) {
		return 100;
	};

	return LongFakeDataWrapper;
})();


var FakeMapper = (function() {
	function FakeMapper() {}

	FakeMapper.prototype.map = function(datum) {
		return 21;
	};

	return FakeMapper;
})();


var FakeSounder = (function() {
	function FakeSounder() {}
	FakeSounder.prototype.frequency = function(frequency, offset) {};
	FakeSounder.prototype.start = function() {};
	FakeSounder.prototype.stop = function() {};
	return FakeSounder;
})();


var mixin_data_wrapper_core = function(message, test_data_class, test_duration, test_call_count, test_interval, use_visual_callback) {
	describe(message, function() {
		var fake_data = null;
		var fake_mapper = null;
		var fake_sounder = null;
		var player = null;
		if (use_visual_callback) {
			var fake_visual_callback = null;
		}

		beforeEach(function() {
			fake_data = new test_data_class();
			fake_mapper = new FakeMapper();
			fake_sounder = new FakeSounder();
			if (use_visual_callback) {
				fake_visual_callback = jasmine.createSpy('fake_visual_callback');
				player = new window.Player(test_duration, fake_data, fake_mapper, fake_sounder, fake_visual_callback);
			} else {
				player = new window.Player(test_duration, fake_data, fake_mapper, fake_sounder);
			}

			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it('works out for how long to sound each datum', function() {
			expect(player.interval).toBe(test_interval);
		});

		it('starts the sounder', function() {
			spyOn(fake_sounder, 'start');
			player.play();
			jasmine.clock().tick(test_duration);
			expect(fake_sounder.start.calls.count()).toBe(1);
		});

		it('stops the sounder', function() {
			spyOn(fake_sounder, 'stop');
			player.play();
			jasmine.clock().tick(test_duration);
			expect(fake_sounder.stop.calls.count()).toBe(1);
		});

		it('makes the correct number of map calls', function() {
			spyOn(fake_mapper, 'map');
			player.play();
			jasmine.clock().tick(test_duration);
			expect(fake_mapper.map.calls.count()).toBe(test_call_count);
		});

		it('makes the right number of calls to the sounder', function() {
			spyOn(fake_sounder, 'frequency');
			player.play();
			jasmine.clock().tick(test_duration);
			expect(fake_sounder.frequency.calls.count()).toBe(test_call_count);
		});

		it('calls the sounder with the correct arguments each time', function() {
			spyOn(fake_sounder, 'frequency');
			player.play();
			jasmine.clock().tick(test_duration);
			expect(fake_sounder.frequency.calls.allArgs()).toEqual(expected_frequency_calls(test_duration, test_call_count));
		});

		if (use_visual_callback) {
			it('makes the correct number of visual callback calls', function() {
				player.play();
				jasmine.clock().tick(test_duration);
				expect(fake_visual_callback.calls.count()).toBe(test_call_count);
			});
		}
	});
};


var mixin_data_wrapper = function(message, test_data_class, test_duration, test_call_count, test_interval) {
	describe(message, function() {
		mixin_data_wrapper_core('when not having a callback', test_data_class, test_duration, test_call_count, test_interval, false);
		mixin_data_wrapper_core('when having a callback', test_data_class, test_duration, test_call_count, test_interval, true);
	});
};


describe('Player', function() {
	mixin_data_wrapper('instantiated with short fake data source for 5000ms', ShortFakeDataWrapper, 5000, 4, 1250);
	mixin_data_wrapper('instantiated with short fake data source for 3000ms', ShortFakeDataWrapper, 3000, 4, 750);
	mixin_data_wrapper('instantiated with long fake data source for 5000ms', LongFakeDataWrapper, 5000, 100, 50);
	mixin_data_wrapper('instantiated with long fake data source for 2500ms', LongFakeDataWrapper, 2500, 100, 25);
});
