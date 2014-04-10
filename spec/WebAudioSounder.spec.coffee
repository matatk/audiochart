if exports?
	ac = require '../audiochart'
else
	ac = window


class FakeOscillator
	constructor: ->
		@frequency = { value: 0 }
	connect: (destination) ->
	start: (opt_offest) ->
	stop: (opt_offset) ->


class FakeAudioContext
	createOscillator: -> new FakeOscillator
	destination: 42


# TODO: check other pass-through calls too (i.e. stop() etc.)
describe 'WebAudioSounder', ->
	fake_audio_context = null

	beforeEach ->
		fake_audio_context = new FakeAudioContext

	it 'creates an oscillator', ->
		spyOn fake_audio_context, 'createOscillator'
		sounder = new ac.WebAudioSounder fake_audio_context
		expect(fake_audio_context.createOscillator).toHaveBeenCalled()

	it 'connects and starts its oscillator', ->
		sounder = new ac.WebAudioSounder fake_audio_context
		fake_oscillator = sounder.oscillator  # guts!
		spyOn fake_oscillator, 'connect'
		spyOn fake_oscillator, 'start'
		sounder.start()
		expect(fake_oscillator.connect)
			.toHaveBeenCalledWith fake_audio_context.destination
		expect(fake_oscillator.start).toHaveBeenCalledWith 0

	it 'changes frequency immediately', ->
		fake_oscillator = null

		runs ->
			sounder = new ac.WebAudioSounder fake_audio_context
			fake_oscillator = sounder.oscillator  # guts!
			expect(fake_oscillator.frequency.value).toBe 0
			sounder.frequency 42

		waitsFor ->
			fake_oscillator.frequency.value is 42

	it 'changes frequency with an offset', ->
		fake_oscillator = null
		jasmine.Clock.useMock()
		delay = 250
		sounder = new ac.WebAudioSounder fake_audio_context
		fake_oscillator = sounder.oscillator  # guts!
		expect(fake_oscillator.frequency.value).toBe 0
		sounder.frequency 84, delay
		jasmine.Clock.tick delay
		expect(fake_oscillator.frequency.value).toBe 84

	it 'stops its oscillator', ->
		# TODO test, with opt_offset!
