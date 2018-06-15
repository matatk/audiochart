'use strict'
/* global loadFixture OptionsMaker */
// FIXME TODO
// - insert directly after button to guarantee focus order?

describe('OptionsMaker', () => {
	let trigger = null  // the button used to open the popup.

	// After some tests we could end up with a dangling dialog.
	// Store a copy of the last element on the page before all tests;
	// this is used to detect a created dialog later.
	let _initialLastElement = null

	beforeAll(() => {
		_initialLastElement = document.body.lastChild
	})

	beforeEach(() => {
		loadFixture('optionsMaker.fixtures.html')
		trigger = document.getElementById('options-popup-trigger')
	})

	afterEach(() => {
		// Remove a dangling dialog if need be
		if (_initialLastElement !== document.body.lastChild) {
			document.body.lastChild.remove()
		}
	})

	it('needs a trigger element', () => {
		expect(() => {
			new OptionsMaker(null)
		}).toThrow(Error('Trigger HTML Element not given'))

		expect(() => {
			new OptionsMaker(42)
		}).toThrow(Error('Trigger HTML Element not given'))
	})

	it('needs a callback function', () => {
		expect(() => {
			new OptionsMaker(trigger)
		}).toThrow(Error('Callback function not given'))

		expect(() => {
			new OptionsMaker(trigger, 42)
		}).toThrow(Error('Callback function not given'))
	})

	it('accepts an Element as a trigger and a function as callback', () => {
		expect(() => {
			new OptionsMaker(trigger, () => {})
		}).not.toThrow()
	})

	it('adds an event listener', () => {
		const initialOnclick = trigger.onclick
		new OptionsMaker(trigger, () => {})
		expect(trigger.onclick).not.toBe(initialOnclick)
		expect(typeof trigger.onclick).toBe('function')
	})

	it('adds aria-haspopup', () => {
		expect(trigger.getAttribute('aria-haspopup')).toBe(null)
		new OptionsMaker(trigger, () => {})
		expect(trigger.getAttribute('aria-haspopup')).toBe('true')
	})

	it('flags the button as expanded when clicked', () => {
		new OptionsMaker(trigger, () => {})
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')
	})

	it('creates a dialog on the first click; removes it on the second', () => {
		spyOn(document, 'createElement').and.callThrough()
		spyOn(document, 'appendChild').and.callThrough()
		new OptionsMaker(trigger, () => {})

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
		new OptionsMaker(trigger, () => {})
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe('true')
		trigger.click()
		expect(trigger.getAttribute('aria-expanded')).toBe(null)
	})

	it('creates a dialog container with the correct styling', () => {
		new OptionsMaker(trigger, () => {})
		trigger.click()

		const gap = 8
		const dialog = document.body.lastChild

		expect(dialog.className).toBe('audiochart-options')
		expect(dialog.style.position).toBe('absolute')
		expect(dialog.style.left).toBe(trigger.offsetLeft + 'px')
		expect(dialog.style.top).toBe(
			trigger.offsetTop + trigger.offsetHeight + gap + 'px')
		expect(dialog.style.zIndex).toBe('1')
	})

	it('adds cancel and OK buttons', () => {
		new OptionsMaker(trigger, () => {})
		trigger.click()
		const dialog = document.body.lastChild
		const buttons = dialog.querySelectorAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].innerText).toBe('Cancel')
		expect(buttons[1].innerText).toBe('OK')
	})

	it('closes without running the callback when cancel is clicked', () => {
		const callback = jasmine.createSpy('testCallback')
		new OptionsMaker(trigger, callback)
		trigger.click()
		const dialog = document.body.lastChild
		document.querySelectorAll('button')[0].click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(callback).not.toHaveBeenCalled()
	})

	it('closes the dialog and runs the callback when ok is clicked', () => {
		const callback = jasmine.createSpy('testCallback')
		new OptionsMaker(trigger, callback)
		trigger.click()
		const dialog = document.body.lastChild
		dialog.querySelectorAll('button')[1].click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(callback).toHaveBeenCalled()
	})

	it('closes the dialog and runs the callback after cancel is clicked first', () => {
		const callback = jasmine.createSpy('testCallback')
		new OptionsMaker(trigger, callback)

		trigger.click()
		const dialog1 = document.body.lastChild
		dialog1.querySelectorAll('button')[0].click()
		expect(document.body.lastChild).not.toBe(dialog1)
		expect(callback).not.toHaveBeenCalled()

		trigger.click()
		const dialog2 = document.body.lastChild
		dialog2.querySelectorAll('button')[1].click()
		expect(document.body.lastChild).not.toBe(dialog2)
		expect(callback).toHaveBeenCalled()
	})

	it('adds frequency settings', () => {
		new OptionsMaker(trigger, () => {})
		trigger.click()

		const dialog = document.body.lastChild
		const labels = dialog.querySelectorAll('label')
		expect(labels.length).toBe(2)
		const inputs = dialog.querySelectorAll('input')
		expect(inputs.length).toBe(2)
		const errors = dialog.querySelectorAll('p')
		expect(errors.length).toBe(2)

		expect(labels[0].innerText).toBe('Lowest frequency (Hz):')
		expect(labels[0].getAttribute('for')).toBe(inputs[0].id)
		expect(inputs[0].value).toBe('200')
		expect(errors[0].hidden).toBe(true)
		expect(errors[0].innerText).toBe('Error: moo')

		expect(labels[1].innerText).toBe('Highest frequency (Hz):')
		expect(labels[1].getAttribute('for')).toBe(inputs[1].id)
		expect(inputs[1].value).toBe('800')
		expect(errors[1].hidden).toBe(true)
		expect(errors[1].innerText).toBe('Error: moo')
	})

	it('checks frequency values', () => {
		new OptionsMaker(trigger, () => {})
		trigger.click()

		const dialog = document.body.lastChild
		const labels = dialog.querySelectorAll('label')
		expect(labels.length).toBe(2)
		const inputs = dialog.querySelectorAll('input')
		expect(inputs.length).toBe(2)
		const errors = dialog.querySelectorAll('p')
		expect(errors.length).toBe(2)

		inputs[1].value = 50
		expect(inputs[1].value).toBe('50')

		// TODO
		// expect(errors[1].hidden).toBe(false)
		// TODO more error-checking goodness, e.g. aria-label
	})
})
