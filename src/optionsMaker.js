/** @module */
/* exported OptionsMaker */

function removeDialog(trigger, container) {
	container.remove()
	trigger.removeAttribute('aria-expanded')
	trigger.onclick = makeDialog
}

function makeDialog() {
	const container = document.createElement('div')
	const gap = 8

	// Styling
	container.className = 'audiochart-options'

	// Position
	container.style.position = 'absolute'
	container.style.zIndex = 1
	container.style.left = this.offsetLeft + 'px'
	container.style.top = this.offsetTop + this.offsetHeight + gap + 'px'

	appendFrequencySetting(container, this.id + '-low', 'Lowest', 200)
	appendFrequencySetting(container, this.id + '-high', 'Highest', 800)

	// Buttons
	const cancel = document.createElement('button')
	cancel.appendChild(document.createTextNode('Cancel'))
	const ok = document.createElement('button')
	ok.appendChild(document.createTextNode('OK'))

	// Dialog accessibility and labelling
	this.setAttribute('aria-expanded', true)
	// FIXME TODO

	container.appendChild(cancel)
	container.appendChild(ok)

	cancel.onclick = () => removeDialog(this, container)
	ok.onclick = () => removeDialog(this, container)
	this.onclick = () => removeDialog(this, container)

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
	 */
	constructor(trigger) {
		if (!(trigger instanceof Element)) {
			throw Error('Trigger element not given')
		}

		trigger.setAttribute('aria-haspopup', true)
		trigger.onclick = makeDialog
	}
}
