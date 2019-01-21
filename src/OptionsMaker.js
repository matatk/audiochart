/** @module */
/* exported OptionsMaker */

function addOpener(audioChart, activator) {
	activator.onclick = function() {
		makeDialog(audioChart, this)
	}
}

function removeDialog(audioChart, activator, container, doUpdate) {
	container.remove()
	activator.removeAttribute('aria-expanded')
	if (doUpdate) {
		const durationSelect = container.querySelector('select')
		const duration = durationSelect.options[durationSelect.selectedIndex].value

		if (durationSelect.selectedIndex !== 3) {  // FIXME
			audioChart.updateOptions({
				'duration': duration * 1000 // FIXME TEST
			})
		}
	}
	addOpener(audioChart, activator)
}

function makeDialog(audioChart, activator) {
	const container = document.createElement('div')
	const gap = 8

	// Styling
	container.className = 'audiochart-options'

	// Position
	container.style.position = 'absolute'
	container.style.zIndex = 1
	container.style.left = activator.offsetLeft + 'px'
	container.style.top = activator.offsetTop + activator.offsetHeight + gap + 'px'

	const options = audioChart.options

	appendDurationSetting(container, activator.id, [1, 3, 5, 10], options.duration)

	appendFrequencySetting(
		container, activator.id + '-low', 'Lowest', options.frequencyLow)

	appendFrequencySetting(
		container, activator.id + '-high', 'Highest', options.frequencyHigh)

	// Buttons
	const cancel = document.createElement('button')
	cancel.appendChild(document.createTextNode('Cancel'))
	const ok = document.createElement('button')
	ok.appendChild(document.createTextNode('OK'))

	// Dialog accessibility and labelling
	activator.setAttribute('aria-expanded', true)
	// FIXME TODO

	container.appendChild(cancel)
	container.appendChild(ok)

	cancel.onclick = () =>
		removeDialog(audioChart, activator, container, false)

	ok.onclick = () =>
		removeDialog(audioChart, activator, container, true)

	activator.onclick = () =>
		removeDialog(audioChart, activator, container, false)

	document.body.appendChild(container)
}

function appendDurationSetting(dialog, baseId, values, currentValue) {
	const inputId = baseId + '-input'
	const container = document.createElement('div')

	const label = document.createElement('label')
	label.appendChild(document.createTextNode('Duration (seconds):'))
	label.setAttribute('for', inputId)

	const select = document.createElement('select')
	select.id = inputId
	for (const value of values) {
		const option = document.createElement('option')
		if (value === (currentValue / 1000)) option.selected = true
		option.append(document.createTextNode(value))
		select.append(option)
	}

	const error = document.createElement('p')
	error.appendChild(document.createTextNode('Error: moo'))
	error.hidden = true

	container.appendChild(label)
	container.appendChild(select)
	container.appendChild(error)

	dialog.appendChild(container)
}

function appendFrequencySetting(dialog, baseId, prettyName, value) {
	const inputId = baseId + '-input'
	const container = document.createElement('div')

	const label = document.createElement('label')
	label.appendChild(document.createTextNode(`${prettyName} frequency (Hz):`))
	label.setAttribute('for', inputId)

	const input = document.createElement('input')
	input.id = inputId
	input.type = 'number'
	input.value = value
	input.min = 50
	input.min = 5000
	input.step = 50

	const error = document.createElement('p')
	error.appendChild(document.createTextNode('Error: moo'))
	error.hidden = true

	container.appendChild(label)
	container.appendChild(input)
	container.appendChild(error)

	dialog.appendChild(container)
}

class OptionsMaker {
	/**
	 * Create an OptionsMaker object.
	 * @param {Object} audioChart - the AudioChart object
	 * @param {HTMLElement} activator - the button that opens the pop-up
	 */
	constructor(audioChart, activator) {
		if (typeof audioChart === 'object'
			&& typeof audioChart.updateOptions === 'function'
			&& typeof Object.getOwnPropertyDescriptor(
				Object.getPrototypeOf(audioChart), 'options'
			).get === 'function') {
			// OK
		} else {
			throw Error('AudioChart object not given')
		}

		if (!(activator instanceof Element)) {
			throw Error('Activator element not given')
		}

		activator.setAttribute('aria-haspopup', true)
		addOpener(audioChart, activator)
	}
}
