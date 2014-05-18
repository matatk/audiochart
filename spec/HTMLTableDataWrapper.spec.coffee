if exports?
	ac = require '../audiochart'
	dw = require './DataWrappers.common.spec'
	jsdom = require 'jsdom'
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
	# FIXME for some reason the tests run but don't show up in Jasmine's
	#       output in the console. I have tried using asyncWait() and
	#       asyncSpecDone() but that doesn't make it print out the test
	#       passes either.
	jsdom.env {
		file: __dirname + '/' + HTML_FILE_NAME,
		done: (errors, window) ->
			run_tests window.document
	}
else
	loadFixtures '/spec/' + HTML_FILE_NAME
	run_tests window.document
