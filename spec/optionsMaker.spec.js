'use strict'
/* global loadFixture OptionsMaker */

describe('htmlTableVisualCallback', () => {
	describe('test', () => {
		let trigger = null

		beforeEach(() => {
			loadFixture('optionsMaker.fixtures.html')
			trigger = document.getElementById('options-popup-trigger')
		})

		it('needs a trigger element', () => {
			expect(() => {
				new OptionsMaker(null)
			}).toThrow(Error('Trigger element not given'))

			expect(() => {
				new OptionsMaker(42)
			}).toThrow(Error('Trigger element not given'))
		})

		it('accepts an Element as a trigger', () => {
			expect(() => {
				new OptionsMaker(trigger)
			}).not.toThrow()
		})

		it('adds an event listener', () => {
			/*
			new OptionsMaker(trigger)
			expect(trigger).toHandle('click')
			*/
		})
	})
})
