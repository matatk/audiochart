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
	container.style.backgroundColor = 'white'
	container.style.padding = '1em'
	container.style.position = 'absolute'
	container.style.border = '2px solid blue'
	container.style.zIndex = 1
	container.style.left = this.offsetLeft + 'px'
	container.style.top = this.offsetTop + this.offsetHeight + gap + 'px'

	appendFrequencySetting(container, 'Lowest', 200)
	appendFrequencySetting(container, 'Highest', 800)

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

function appendFrequencySetting(dialog, prettyName, value) {
	const label = document.createElement('label')
	label.appendChild(document.createTextNode(`${prettyName} frequency (Hz):`))

	const input = document.createElement('input')
	input.type = 'number'
	input.value = value
	input.min = 50
	input.min = 5000
	input.step = 50

	label.appendChild(input)
	dialog.appendChild(label)
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
