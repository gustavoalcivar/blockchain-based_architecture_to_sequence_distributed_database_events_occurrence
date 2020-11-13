const errToStatus = {
  'No auth token': 401,
  'Unauthorized': 401,
  'invalid signature': 401,
  'Cannot read property \'nested\' of undefined': 400,
  'Not Found': 404,
  'No user with such username.': 400,
  'Invalid value': 400,
}

const errToMessage = {
  'No auth token': 'no_session_try_to_sign_in_again',
  'Unauthorized': 'unauthorized',
  'invalid signature': 'no_session_try_to_sign_in_again',
  'Cannot read property \'nested\' of undefined': 'invalid_protos_set',
  'Not Found': 'not_found',
  'No user with such username.': 'no_user_with_such_username',
  'Invalid value': 'invalid_param_value',
}

function normalizeError (err) {
  let normalizedMessage = err.message
  if (!Object.values(errToMessage).includes(err.message)) // if not normalized
    normalizedMessage = errToMessage[err.message] || 'unknown_error'
  const status = errToStatus[err.message] || 500
  return Object.assign(new Error(normalizedMessage), { status })
}

function deleteEmptyArrayFields (query) {
  for (let key in query) {
    if (Array.isArray(query[key]) && query[key].length == 0)
      delete query[key]
  }
  return query
}

module.exports = { deleteEmptyArrayFields, normalizeError }
