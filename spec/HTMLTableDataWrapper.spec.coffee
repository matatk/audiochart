if exports?
	ac = require '../audiochart'
	dw = require './DataWrappers.common.spec'
	fs = require 'fs'
	jsdom = require('jsdom').jsdom
	headless = true
else
	ac = window
	dw = window
	headless = false

HTML_FILE_NAME = 'HTMLTableDataWrapper.fixtures.html'


run_tests = (doc) ->
	dw.data_wrappers_test_core \
		'HTMLTableDataWrapper',
		new ac.HTMLTableDataWrapper(doc, 'test_one'),
		new ac.HTMLTableDataWrapper(doc, 'test_neg')

	describe 'HTMLTableDataWrapper error-checking', ->
		it 'Throws when an invalid id is given', ->
			expect(() -> new ac.HTMLTableDataWrapper doc, 'moo').toThrow()

		it 'Does not throw when a valid id is given', ->
			expect(
				() -> new ac.HTMLTableDataWrapper doc, 'test_one').not.toThrow()


if headless
	html_string = fs.readFileSync __dirname + '/' + HTML_FILE_NAME
	document = jsdom html_string
	run_tests document
else
	loadFixtures 'spec/' + HTML_FILE_NAME
	run_tests window.document
