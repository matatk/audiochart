'use strict'
/* global Player */

describe('Player sampling rate and interval', () => {
	it('calculates the correct sampling rates and intervals', () => {
		expect(Player.samplingInfo(1000,  50)).toEqual(
			{ sample: 1, in: 1, interval: 20 })
		expect(Player.samplingInfo(1000, 100)).toEqual(
			{ sample: 1, in: 1, interval: 10 })
		expect(Player.samplingInfo(1000, 629)).toEqual(
			{ sample: 1, in: 6, interval: 10 })
		expect(Player.samplingInfo(1000, 250)).toEqual(
			{ sample: 1, in: 3, interval: 10 })
	})
})

class BaseFakeDataWrapper {
	numSeries() {
		return 1
	}

	seriesNames() {
		return ['Test']
	}

	seriesValue(series, index) {
		return 42
	}
}


class ShortFakeDataWrapper extends BaseFakeDataWrapper {
	seriesLength(series) {
		return 4
	}
}


class LongFakeDataWrapper extends BaseFakeDataWrapper {
	seriesLength(series) {
		return 100
	}
}


class FakeMapper {
	map(datum) {
		return 21
	}
}


class FakeSounder {
	frequency(frequency) {}
	start() {}
	stop() {}
}


function expectedFrequencyCalls(seriesLength) {
	const out = []
	for (let i = 0; i <= seriesLength - 1; i++) {
		out.push([21])
	}
	return out
}


function mixinDataWrapperCore(message, TestDataClass, testDuration, testCallCount, testInterval, useVisualCallback) {
	describe(message, () => {
		let fakeData = null
		let fakeMapper = null
		let fakeSounder = null
		let player = null
		let fakeVisualCallback = null  // may not be used

		beforeEach(() => {
			fakeData = new TestDataClass()
			fakeMapper = new FakeMapper()
			fakeSounder = new FakeSounder()
			if (useVisualCallback) {
				fakeVisualCallback = jasmine.createSpy('fakeVisualCallback')
				player = new Player(testDuration, fakeData, fakeMapper, fakeSounder, fakeVisualCallback)
			} else {
				player = new Player(testDuration, fakeData, fakeMapper, fakeSounder)
			}

			jasmine.clock().install()
		})

		afterEach(() => {
			jasmine.clock().uninstall()
		})

		it('works out for how long to sound each datum', () => {
			expect(player.interval).toBe(testInterval)
		})

		it('starts the sounder', () => {
			spyOn(fakeSounder, 'start')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.start.calls.count()).toBe(1)
		})

		it('stops the sounder', () => {
			spyOn(fakeSounder, 'stop')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.stop.calls.count()).toBe(1)
		})

		it('makes the correct number of map calls', () => {
			spyOn(fakeMapper, 'map')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeMapper.map.calls.count()).toBe(testCallCount)
		})

		it('makes the right number of calls to the sounder', () => {
			spyOn(fakeSounder, 'frequency')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.frequency.calls.count()).toBe(testCallCount)
		})

		it('calls the sounder with the correct arguments each time', () => {
			spyOn(fakeSounder, 'frequency')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.frequency.calls.allArgs()).toEqual(expectedFrequencyCalls(testCallCount))
		})

		if (useVisualCallback) {
			it('makes the correct number of visual callback calls', () => {
				player.playPause()
				jasmine.clock().tick(testDuration)
				expect(fakeVisualCallback.calls.count()).toBe(testCallCount)
			})
		}

		it('knows it has never played', () => {
			expect(player._state).toBe('ready')
		})

		it('knows when it is playing', () => {
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			expect(player._state).toBe('playing')
		})

		it('knows when it has finished playing', () => {
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(player._state).toBe('finished')
		})

		it('[TODO] clears its interval timer when paused', () => {
			// TODO this seems to trigger a Jasmine bug
			// spyOn( 'clearInterval').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			expect(player.intervalID).toBeDefined()
			player.playPause()
			jasmine.clock().tick(testDuration / 4)
			// expect(clearInterval).toHaveBeenCalled()
		})

		it('knows when it is paused', () => {
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			player.playPause()
			expect(player._state).toBe('paused')
		})

		it('continues playing after a pause', () => {
			spyOn(player, '_play').and.callThrough()
			spyOn(player, '_playLoop').and.callThrough()
			spyOn(player, '_pause').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			player.playPause()
			jasmine.clock().tick(testDuration / 4)
			player.playPause()
			expect(player._play).toHaveBeenCalledTimes(1)
			expect(player._playLoop).toHaveBeenCalledTimes(2)
			expect(player._pause).toHaveBeenCalledTimes(1)
		})

		it('complains if the state is invalid', () => {
			player._state = 'moo'
			expect(() => {
				player.playPause()
			}).toThrow()
		})

		it('steps backward when requested', () => {
			player.playPause()
			jasmine.clock().tick(testDuration * 0.9)
			const index1 = player.playIndex
			player.stepBackward(2)
			const index2 = player.playIndex
			expect(index2).toBe(index1 - 2)
		})

		it('updates the sound (and visual cursor) when stepped backward whilst paused', () => {
			spyOn(player, '_playOne').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 10)
			player.playPause()
			const numberOfTimesPlayCoreCalled = player._playOne.calls.count()
			player.stepBackward()
			const steppedNumberOfTimesPlayCoreCalled = player._playOne.calls.count()
			expect(steppedNumberOfTimesPlayCoreCalled).toBe(
				numberOfTimesPlayCoreCalled + 1)
		})

		it('steps forward when requested', () => {
			player.playPause()
			const index1 = player.playIndex
			player.stepForward(2)
			const index2 = player.playIndex
			expect(index2).toBe(index1 + 2)
		})

		it('updates the sound (and visual cursor) when stepped forward whilst paused', () => {
			spyOn(player, '_playOne').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 10)
			player.playPause()
			const numberOfTimesPlayCoreCalled = player._playOne.calls.count()
			player.stepForward()
			const steppedNumberOfTimesPlayCoreCalled = player._playOne.calls.count()
			expect(steppedNumberOfTimesPlayCoreCalled).toBe(
				numberOfTimesPlayCoreCalled + 1)
		})
	})
}


function mixinDataWrapper(message, TestDataClass, testDuration, testCallCount, testInterval) {
	describe(message, () => {
		mixinDataWrapperCore('when not having a callback', TestDataClass, testDuration, testCallCount, testInterval, false)
		mixinDataWrapperCore('when having a callback', TestDataClass, testDuration, testCallCount, testInterval, true)
	})
}


describe('Player', () => {
	// With 'long' intervals
	mixinDataWrapper('instantiated with short fake data source for 5000ms', ShortFakeDataWrapper, 5000, 4, 1250)
	mixinDataWrapper('instantiated with short fake data source for 3000ms', ShortFakeDataWrapper, 3000, 4, 750)
	mixinDataWrapper('instantiated with long fake data source for 5000ms', LongFakeDataWrapper, 5000, 100, 50)
	mixinDataWrapper('instantiated with long fake data source for 2500ms', LongFakeDataWrapper, 2500, 100, 25)

	// With minimum intervals
	mixinDataWrapper('instantiated with long fake data source for 500ms', LongFakeDataWrapper, 500, 50, 10)
	mixinDataWrapper('instantiated with long fake data source for 500ms', LongFakeDataWrapper, 100, 10, 10)
})
