# REALLY IMPORTANT NOTE:
#   This is cRaZy... it seems that the require below loads the AudioChart
#   library *once per jasmine-node session*, which means that not only would
#   the state of the singleton be preserved across different it() blocks in
#   this describe() block, but it would also be preserved across all tests
#   in this entire suite!
#
#   This seems so counter-intuitive that it's obviously wrong, but all my
#   fiddling about and trying different ways to load the library has pointed
#   to this.  I've tried a lot of different stuff involving mocking the real
#   AudioContext object provided by the browser, so that the jasmine-node
#   tests are still pretty robust, but it results in much ugliness, so have
#   just given up on that for now and done a simpler test here instead.

if exports?
  ac = require '../audiochart'
else
  ac = window


describe 'AudioContextGetter', ->
  it 'returns the same audio context when called again', ->
    context1 = ac.AudioContextGetter.get()
    context2 = ac.AudioContextGetter.get()
    context3 = ac.AudioContextGetter.get()
    expect(context1).toBe(context2)
    expect(context2).toBe(context3)
