if exports?
  ac = require '../audiochart'
else
  ac = window


describe 'html_table_visual_callback', ->
  fake_table = null
  html_table_visual_callback = null

  beforeEach ->
    html_table_visual_callback =
      ac._html_table_visual_callback_maker(fake_table)

  it 'does something', ->
    html_table_visual_callback(0, 0)
    expect(true).toBe true
