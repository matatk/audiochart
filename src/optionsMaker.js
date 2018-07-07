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
		audioChart.updateOptions({})
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

	appendFrequencySetting(container, activator.id + '-low', 'Lowest', 200)
	appendFrequencySetting(container, activator.id + '-high', 'Highest', 800)

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
		if (typeof audioChart !== 'object') {
			throw Error('AudioChart object not given')
		}

		if (!(activator instanceof Element)) {
			throw Error('Activator element not given')
		}

		activator.setAttribute('aria-haspopup', true)
		addOpener(audioChart, activator)
	}
}
