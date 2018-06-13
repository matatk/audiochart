/** @module */
/* exported OptionsMaker */

function removeDialog(trigger, container, callback, callTheCallback) {
	container.remove()
	trigger.removeAttribute('aria-expanded')
	if (callTheCallback) {
		callback()
	}
	trigger.onclick = function() {  // FIXME DRY
		makeDialog(this, callback)
	}
}

function makeDialog(trigger, callback) {
	const container = document.createElement('div')
	const gap = 8

	// Styling
	container.className = 'audiochart-options'

	// Position
	container.style.position = 'absolute'
	container.style.zIndex = 1
	container.style.left = trigger.offsetLeft + 'px'
	container.style.top = trigger.offsetTop + trigger.offsetHeight + gap + 'px'

	appendFrequencySetting(container, trigger.id + '-low', 'Lowest', 200)
	appendFrequencySetting(container, trigger.id + '-high', 'Highest', 800)

	// Buttons
	const cancel = document.createElement('button')
	cancel.appendChild(document.createTextNode('Cancel'))
	const ok = document.createElement('button')
	ok.appendChild(document.createTextNode('OK'))

	// Dialog accessibility and labelling
	trigger.setAttribute('aria-expanded', true)
	// FIXME TODO

	container.appendChild(cancel)
	container.appendChild(ok)

	cancel.onclick = () => removeDialog(trigger, container, callback, false)
	ok.onclick = () => removeDialog(trigger, container, callback, true)
	trigger.onclick = () => removeDialog(trigger, container, callback, false)

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
	 * @param {HTMLElement} trigger - the trigger
	 * @param {Function} callback - function to run when OK is clicked
	 */
	constructor(trigger, callback) {
		if (!(trigger instanceof Element)) {
			throw Error('Trigger HTML Element not given')
		}

		if (typeof callback !== 'function') {
			throw Error('Callback function not given')
		}

		trigger.setAttribute('aria-haspopup', true)
		trigger.onclick = function() {
			makeDialog(this, callback)  // FIXME DRY
		}
	}
}
