/**
 * Ensures that there is only one Web Audio context per page.
 * Sets up a new AudioContext the first time it's called; then re-uses it.
 * @private
 * @returns {AudioContext} page-global Web Audio context
 */
var getAudioContext = (function() {
	let audioContext = null

	if (window.AudioContext !== undefined) {
		audioContext = new window.AudioContext()
	} else if (window.webkitAudioContext !== undefined) {
		/* eslint-disable new-cap */
		audioContext = new window.webkitAudioContext()
		/* eslint-enable new-cap */
	}

	function _getAudioContext() {
		return audioContext
	}

	return _getAudioContext
})()

export { getAudioContext }
