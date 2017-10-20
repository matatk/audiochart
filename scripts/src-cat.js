'use strict'
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'src')
const files = [
	'DataWrappers.js',
	'PitchMappers.js',
	'WebAudioSounder.js',
	'Player.js',
	'getAudioContext.js',
	'visualCallbackMakers.js',
	'KeyboardHandler.js',
	'AudioChart.js'
]

let code = ''

files.forEach(function(fileName) {
	const lines = fs.readFileSync(path.join(src, fileName), 'utf-8').split('\n')
	for (const line of lines) {
		if (line.length > 0) {
			code += '\t' + line + '\n'
		} else {
			code += '\n'
		}
	}
})

const wrapped = String(
	fs.readFileSync(path.join(__dirname, 'production-iife-and-exports.js')))

fs.writeFileSync(
	path.join(__dirname, '..', 'src', 'audiochart-all.js'),
	wrapped.replace('\tTHE_CODE\n\n', code))
