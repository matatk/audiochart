'use strict'
/* global dataWrappersTestCore C3DataWrapper */

describe('C3DataWrapper', () => {
	const c3TestOne = {
		columns: [
			['Test', 2, 3, 3, 4]
		]
	}

	const c3TestNeg = {
		columns: [
			['Test', 20, -10, 0, 8, -90],
		]
	}

	const c3TestTwo = {
		columns: [
			['Test1', 20, -10, 0, 8, -90],
			['Test2', 42, 72, -42, -8, 0]
		]
	}

	const c3TestOneX = {
		x: 'x',
		columns: [
			['t', 2, 3, 3, 4],
			['x', 1, 2, 3, 4]
		]
	}

	const c3TestTwoX = {
		x: 'x',
		columns: [
			['t1', 20, -10,   0,  8, -90],
			['t2', 42,  72, -42, -8,   0],
			['x',   1,   2,   3,  4,   5]
		]
	}

	// TODO
	const c3TestOneXFirst = {
		x: 'x',
		columns: [
			['x', 1, 2, 3, 4],
			['t', 2, 3, 3, 4]
		]
	}

	// TODO
	const c3TestTwoXFirst = {
		x: 'x',
		columns: [
			['x',   1,   2,   3,  4,   5],
			['t1', 20, -10,   0,  8, -90],
			['t2', 42,  72, -42, -8,   0]
		]
	}

	dataWrappersTestCore(
		'C3DataWrapper',
		new C3DataWrapper(c3TestOne),
		new C3DataWrapper(c3TestNeg),
		new C3DataWrapper(c3TestTwo))

	it('skips a column that is for the x-axis (single-column data)', () => {
		const wrapper = new C3DataWrapper(c3TestOneX)
		expect(wrapper.numSeries()).toBe(1)
	})

	it('skips a column that is for the x-axis (two-column data)', () => {
		const wrapper = new C3DataWrapper(c3TestTwoX)
		expect(wrapper.numSeries()).toBe(2)
	})
})
