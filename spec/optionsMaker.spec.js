'use strict'
/* global loadFixture OptionsMaker */
// FIXME TODO
// - insert directly after button to guarantee focus order?

class FakeAudioChart {
	get options() {
		return 'moo'
	}

	// TODO put the original code back / decide if AC is too strict / other
	updateOptions(newOptions) {
		// This is the real code...
		/* if (newOptions === undefined || Object.keys(newOptions).length === 0) {
			throw Error('No new options given')
		} */
		// However, for our tests, it is easier to do...
		if (typeof newOptions !== 'object') throw Error('No new options given')
	}
}

describe('OptionsMaker', () => {
	let activator = null  // the button used to open the popup.
	let fakeAudioChart = null

	// After some tests we could end up with a dangling dialog.
	// Store a copy of the last element on the page before all tests;
	// this is used to detect a created dialog later.
	let _initialLastElement = null

	beforeAll(() => {
		_initialLastElement = document.body.lastChild
	})

	beforeEach(() => {
		loadFixture('optionsMaker.fixtures.html')
		activator = document.getElementById('options-popup-activator')
		fakeAudioChart = new FakeAudioChart()
	})

	afterEach(() => {
		// Remove a dangling dialog if need be
		if (_initialLastElement !== document.body.lastChild) {
			document.body.lastChild.remove()
		}
	})

	it('needs an AudioChart object', () => {
		expect(() => {
			new OptionsMaker()
		}).toThrow(Error('AudioChart object not given'))

		expect(() => {
			new OptionsMaker(42)
		}).toThrow(Error('AudioChart object not given'))
	})

	it('needs an activator element', () => {
		expect(() => {
			new OptionsMaker({}, null)
		}).toThrow(Error('Activator element not given'))

		expect(() => {
			new OptionsMaker({}, 42)
		}).toThrow(Error('Activator element not given'))
	})

	it('accepts an object and an element', () => {
		expect(() => {
			new OptionsMaker({}, activator)
		}).not.toThrow()
	})

	it('adds an event listener', () => {
		const initialOnclick = activator.onclick
		new OptionsMaker({}, activator)
		expect(activator.onclick).not.toBe(initialOnclick)
		expect(typeof activator.onclick).toBe('function')
	})

	it('adds aria-haspopup', () => {
		expect(activator.getAttribute('aria-haspopup')).toBe(null)
		new OptionsMaker({}, activator)
		expect(activator.getAttribute('aria-haspopup')).toBe('true')
	})

	it('flags the button as expanded when clicked', () => {
		new OptionsMaker({}, activator)
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe('true')
	})

	it('creates a dialog on the first click; removes it on the second', () => {
		spyOn(document, 'createElement').and.callThrough()
		spyOn(document, 'appendChild').and.callThrough()
		new OptionsMaker({}, activator)

		activator.click()
		const initialCreateElementCalls = document.createElement.calls.count()
		const initialAppendChildCalls = document.appendChild.calls.count()
		expect(document.createElement).toHaveBeenCalledWith('div')
		const dialog = document.body.lastChild

		activator.click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(document.createElement.calls.count())
			.toBe(initialCreateElementCalls)
		expect(document.appendChild.calls.count())
			.toBe(initialAppendChildCalls)
	})

	it('is no longer expanded after the dialog is removed', () => {
		new OptionsMaker({}, activator)
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe('true')
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe(null)
	})

	it('creates a dialog container with the correct styling', () => {
		new OptionsMaker({}, activator)
		activator.click()

		const gap = 8
		const dialog = document.body.lastChild

		expect(dialog.className).toBe('audiochart-options')
		expect(dialog.style.position).toBe('absolute')
		expect(dialog.style.left).toBe(activator.offsetLeft + 'px')
		expect(dialog.style.top).toBe(
			activator.offsetTop + activator.offsetHeight + gap + 'px')
		expect(dialog.style.zIndex).toBe('1')
	})

	it('adds cancel and OK buttons', () => {
		new OptionsMaker({}, activator)
		activator.click()
		const dialog = document.body.lastChild
		const buttons = dialog.querySelectorAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].innerText).toBe('Cancel')
		expect(buttons[1].innerText).toBe('OK')
	})

	it('closes without updating options when cancel is clicked', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		document.querySelectorAll('button')[0].click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(fakeAudioChart.updateOptions).not.toHaveBeenCalled()
	})

	it('closes the dialog and updates options when ok is clicked', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		dialog.querySelectorAll('button')[1].click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(fakeAudioChart.updateOptions).toHaveBeenCalled()
	})

	it('closes the dialog and updates options cancel is clicked first', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)

		activator.click()
		const dialog1 = document.body.lastChild
		dialog1.querySelectorAll('button')[0].click()
		expect(document.body.lastChild).not.toBe(dialog1)
		expect(fakeAudioChart.updateOptions).not.toHaveBeenCalled()

		activator.click()
		const dialog2 = document.body.lastChild
		dialog2.querySelectorAll('button')[1].click()
		expect(document.body.lastChild).not.toBe(dialog2)
		expect(fakeAudioChart.updateOptions).toHaveBeenCalled()
	})

	it('adds frequency settings', () => {
		new OptionsMaker({}, activator)
		activator.click()

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
		new OptionsMaker({}, activator)
		activator.click()

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
