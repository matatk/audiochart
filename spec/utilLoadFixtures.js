'use strict'
/* exported loadFixture */
const TEST_FIXTURE_DIV_ID = 'test-fixture'

/**
 * Load an HTML fixture into the test fixtures container
 * @param {string} name - the fixture's filename
 */
function loadFixture(name) {
	const xhr = new XMLHttpRequest()
	xhr.open('get', '/base/spec/' + name, false)
	xhr.send()

	let fixtureDiv = document.getElementById(TEST_FIXTURE_DIV_ID)
	if (!fixtureDiv) {
		fixtureDiv = document.createElement('div')
		fixtureDiv.id = TEST_FIXTURE_DIV_ID
		document.body.appendChild(fixtureDiv)
	}

	fixtureDiv.innerHTML = xhr.responseText
}
