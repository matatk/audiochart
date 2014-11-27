if exports?
  ac = require '../audiochart'
  dw = require './DataWrappers-common.spec'
else
  ac = window
  dw = window


# Test Data
test_one = '{
  "data":	[
    {
      "series": "Test",
      "values": [ 2, 3, 3, 4 ]
    }
  ]
}'

test_neg = '{
  "data": [
    {
      "series": "Test",
      "values": [ 20, -10, 0, 8, -90 ]
    }
  ]
}'


dw.data_wrappers_test_core \
  'JSONDataWrapper, starting from string',
  new ac.JSONDataWrapper(test_one),
  new ac.JSONDataWrapper(test_neg)

dw.data_wrappers_test_core \
  'JSONDataWrapper, starting from object',
  new ac.JSONDataWrapper(JSON.parse test_one),
  new ac.JSONDataWrapper(JSON.parse test_neg)
