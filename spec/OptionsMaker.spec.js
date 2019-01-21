'use strict'
/* global loadFixture OptionsMaker */
// FIXME TODO
// + insert directly after button/move focus to guarantee focus order?
// + multiple dialogs:
//   - check IDs are not the same
//   - check the correct settings get requested/updated

class FakeAudioChart {
	get options() {
		return {
			duration: 10e3,
			frequencyLow: 42,
			frequencyHigh: 84
		}
	}

	updateOptions(newOptions) {
		// This is the real code...
		if (newOptions === undefined || Object.keys(newOptions).length === 0) {
			throw Error('No new options given')
		}
	}
}

describe('A single OptionsMaker', () => {
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
		loadFixture('OptionsMaker.fixtures.html')
		activator = document.getElementById('options-popup-activator-1')
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
			new OptionsMaker(fakeAudioChart)
		}).toThrow(Error('Activator element not given'))

		expect(() => {
			new OptionsMaker(fakeAudioChart, 42)
		}).toThrow(Error('Activator element not given'))
	})

	it('accepts an object and an element', () => {
		expect(() => {
			new OptionsMaker(fakeAudioChart, activator)
		}).not.toThrow()
	})

	it('adds an event listener', () => {
		const initialOnclick = activator.onclick
		new OptionsMaker(fakeAudioChart, activator)
		expect(activator.onclick).not.toBe(initialOnclick)
		expect(typeof activator.onclick).toBe('function')
	})

	it('adds aria-haspopup to the activator', () => {
		expect(activator.getAttribute('aria-haspopup')).toBe(null)
		new OptionsMaker(fakeAudioChart, activator)
		expect(activator.getAttribute('aria-haspopup')).toBe('true')
	})

	it('flags the button as expanded when clicked', () => {
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe('true')
	})

	it('gets the current AudioChart options', () => {
		const spy = spyOnProperty(fakeAudioChart, 'options').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		expect(spy).toHaveBeenCalled()
	})

	it('creates a dialog on the first click; removes it on the second', () => {
		spyOn(document, 'createElement').and.callThrough()
		spyOn(document, 'appendChild').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)

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
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe('true')
		activator.click()
		expect(activator.getAttribute('aria-expanded')).toBe(null)
	})

	it('creates a dialog container with the correct styling', () => {
		new OptionsMaker(fakeAudioChart, activator)
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
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		const buttons = dialog.querySelectorAll('button')
		expect(buttons.length).toBe(2)
		expect(buttons[0].innerText).toBe('Cancel')
		expect(buttons[1].innerText).toBe('OK')
	})

	it('closes without updating when cancel is clicked', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		const button = dialog.querySelectorAll('button')[0]
		expect(button.innerText).toBe('Cancel')
		button.click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(fakeAudioChart.updateOptions).not.toHaveBeenCalled()
	})

	it('closes without updating when ok is clicked without changes', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		const button = dialog.querySelectorAll('button')[1]
		expect(button.innerText).toBe('OK')
		button.click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(fakeAudioChart.updateOptions).not.toHaveBeenCalled()
	})

	it('adds duration setting', () => {
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()

		const dialog = document.body.lastChild
		const label = dialog.querySelectorAll('label')[0]
		const select = dialog.querySelectorAll('select')[0]
		const options = select.querySelectorAll('option')
		const error = dialog.querySelectorAll('p')[0]

		expect(label.innerText).toBe('Duration (seconds):')
		expect(label.getAttribute('for')).toBe(select.id)
		expect(options.length).toBe(4)

		expect(options[0].innerText).toBe('1')
		expect(options[1].innerText).toBe('3')
		expect(options[2].innerText).toBe('5')
		expect(options[3].innerText).toBe('10')
		expect(options[3].selected).toBe(true)
		expect(error.hidden).toBe(true)
		expect(error.innerText).toBe('Error: moo')  // FIXME
	})

	it('adds frequency settings', () => {
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()

		const options = fakeAudioChart.options

		const dialog = document.body.lastChild
		const labels = dialog.querySelectorAll('label')
		expect(labels.length).toBe(3)
		const inputs = dialog.querySelectorAll('input')
		expect(inputs.length).toBe(2)
		const errors = dialog.querySelectorAll('p')
		expect(errors.length).toBe(3)

		const lowLabel = labels[1]
		const lowInput = inputs[0]
		const lowError = errors[1]

		const highLabel = labels[2]
		const highInput = inputs[1]
		const highError = errors[2]

		expect(lowLabel.innerText).toBe('Lowest frequency (Hz):')
		expect(lowLabel.getAttribute('for')).toBe(lowInput.id)
		expect(lowInput.value).toBe(String(options.frequencyLow))
		expect(lowError.hidden).toBe(true)
		expect(lowError.innerText).toBe('Error: moo')  // FIXME

		expect(highLabel.innerText).toBe('Highest frequency (Hz):')
		expect(highLabel.getAttribute('for')).toBe(highInput.id)
		expect(highInput.value).toBe(String(options.frequencyHigh))
		expect(highError.hidden).toBe(true)
		expect(highError.innerText).toBe('Error: moo')  // FIXME
	})

	it('checks frequency values', () => {
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()

		const dialog = document.body.lastChild
		const labels = dialog.querySelectorAll('label')
		expect(labels.length).toBe(3)
		const inputs = dialog.querySelectorAll('input')
		expect(inputs.length).toBe(2)
		const errors = dialog.querySelectorAll('p')
		expect(errors.length).toBe(3)

		// const lowLabel = labels[1]
		const lowInput = inputs[0]
		// const lowError = errors[1]

		// const highLabel = labels[2]
		// const highInput = inputs[1]
		// const highError = errors[2]

		lowInput.value = 50
		expect(lowInput.value).toBe('50')

		// TODO
		// expect(errors[1].hidden).toBe(false)
		// TODO more error-checking goodness, e.g. aria-label
	})

	it('closes and updates when ok is clicked with changes', () => {
		spyOn(fakeAudioChart, 'updateOptions').and.callThrough()
		new OptionsMaker(fakeAudioChart, activator)
		activator.click()
		const dialog = document.body.lastChild
		const button = dialog.querySelectorAll('button')[1]
		expect(button.innerText).toBe('OK')

		const select = dialog.querySelector('select')
		select.selectedIndex = 0  // this will be 1s rather than 3s

		button.click()
		expect(document.body.lastChild).not.toBe(dialog)
		expect(fakeAudioChart.updateOptions).toHaveBeenCalled()
	})

})

describe('Two OptionsMakers', () => {
	let activator1 = null
	let activator2 = null
	let fakeAudioChart1 = null
	let fakeAudioChart2 = null

	beforeEach(() => {
		loadFixture('OptionsMaker.fixtures.html')
		activator1 = document.getElementById('options-popup-activator-1')
		activator2 = document.getElementById('options-popup-activator-1')
		fakeAudioChart1 = new FakeAudioChart()
		fakeAudioChart2 = new FakeAudioChart()
	})

	it('can open one popup', () => {
		new OptionsMaker(fakeAudioChart1, activator1)
	})

	it('can open two popups', () => {
		new OptionsMaker(fakeAudioChart1, activator1)
		new OptionsMaker(fakeAudioChart2, activator2)
	})
})
