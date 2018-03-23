'use strict'
/* global loadFixture OptionsMaker */

describe('OptionsMaker', () => {
	let trigger = null  // the button used to open the popup.

	// After some tests we could end up with a dangling dialog.
	// Store a copy of the last element on the page before the test;
	// this is used to compare, to detect a created dialog later.
	let _initialLastElement = null

	beforeEach(() => {
		loadFixture('optionsMaker.fixtures.html')
		trigger = document.getElementById('options-popup-trigger')
		_initialLastElement = document.body.lastChild
		spyOn(trigger, 'click').and.callThrough()
	})

	afterEach(() => {
		// Remove a dangling dialog if we're expecting one and it is there
		const clicks = trigger.click.calls.count()
		if (clicks > 0 && clicks % 2 !== 0) {
			if (_initialLastElement !== document.body.lastChild) {
				document.body.lastChild.remove()
			}
		}
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
		const initialOnclick = trigger.onclick
		new OptionsMaker(trigger)
		expect(trigger.onclick).not.toBe(initialOnclick)
		expect(typeof trigger.onclick).toBe('function')
	})

	it('adds aria-haspopup', () => {
		expect(trigger.getAttribute('aria-haspopup')).toBe(null)
		new OptionsMaker(trigger)
		expect(trigger.getAttribute('aria-haspopup')).toBe('true')
	})

	it('flags the button as expanded when clicked', () => {
		new OptionsMaker(trigger)
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')
	})

	it('creates a dialog on the first click; removes it on the second', () => {
		spyOn(document, 'createElement').and.callThrough()
		spyOn(document, 'appendChild').and.callThrough()
		new OptionsMaker(trigger)

		trigger.click()
		const initialCreateElementCalls = document.createElement.calls.count()
		const initialAppendChildCalls = document.appendChild.calls.count()
		expect(document.createElement).toHaveBeenCalledWith('div')
		const dialog = document.body.lastChild

		trigger.click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(document.createElement.calls.count())
			.toBe(initialCreateElementCalls)
		expect(document.appendChild.calls.count())
			.toBe(initialAppendChildCalls)
	})

	it('is no longer expanded after the dialog is removed', () => {
		new OptionsMaker(trigger)
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe(null)
	})

	it('creates a dialog container with the correct styling', () => {
		new OptionsMaker(trigger)
		trigger.click()

		const gap = 8
		const dialog = document.body.lastChild

		expect(dialog.style.backgroundColor).toBe('white')
		expect(dialog.style.padding).toBe('1em')
		expect(dialog.style.position).toBe('absolute')
		expect(dialog.style.borderColor).toBe('blue')
		expect(dialog.style.borderStyle).toBe('solid')
		expect(dialog.style.borderWidth).toBe('2px')
		expect(dialog.style.zIndex).toBe('1')
		expect(dialog.style.left).toBe(trigger.offsetLeft + 'px')
		expect(dialog.style.top).toBe(
			trigger.offsetTop + trigger.offsetHeight + gap + 'px')
	})

	it('adds cancel and OK buttons', () => {
		new OptionsMaker(trigger)
		trigger.click()
		const dialog = document.body.lastChild
		const buttons = dialog.querySelectorAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].innerText).toBe('Cancel')
		expect(buttons[1].innerText).toBe('OK')
	})

	it('closes the dialog after the cancel button is clicked', () => {
		new OptionsMaker(trigger)
		trigger.click()
		const dialog = document.body.lastChild
		document.querySelectorAll('button')[0].click()
		expect(document.body.lastChild).not.toBe(dialog)
	})

	it('closes the dialog after the ok button is clicked', () => {
		new OptionsMaker(trigger)
		trigger.click()
		const dialog = document.body.lastChild
		document.querySelectorAll('button')[1].click()
		expect(document.body.lastChild).not.toBe(dialog)
	})

	it('adds frequency settings', () => {
		new OptionsMaker(trigger)
		trigger.click()

		const dialog = document.body.lastChild
		const labels = dialog.querySelectorAll('label')
		expect(labels.length).toBe(2)
		const inputs = dialog.querySelectorAll('input')
		expect(inputs.length).toBe(2)

		expect(labels[0].innerText).toBe('Lowest frequency (Hz):')
		expect(inputs[0].value).toBe('200')
		expect(labels[1].innerText).toBe('Highest frequency (Hz):')
		expect(inputs[1].value).toBe('800')
	})
})
