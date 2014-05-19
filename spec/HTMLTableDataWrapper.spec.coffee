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
	# TODO test malformed tables cause stuff to be thrown
	# TODO test that finding a non-existant table throws
	# TODO test that finding a malformed table throws
	dw.data_wrappers_test_core \
		'HTMLDataWrapper',
		new ac.HTMLTableDataWrapper(doc, 'test_one'),
		new ac.HTMLTableDataWrapper(doc, 'test_neg')


if headless
	html_string = fs.readFileSync __dirname + '/' + HTML_FILE_NAME
	document = jsdom html_string
	run_tests document
else
	loadFixtures 'spec/' + HTML_FILE_NAME
	run_tests window.document
