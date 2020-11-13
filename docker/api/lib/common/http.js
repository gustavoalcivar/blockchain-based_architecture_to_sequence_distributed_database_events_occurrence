const request = require('request')

function get (url) {
  return new Promise(resolve => request(url, (error, response, body) => handleResponse(error, response, body, resolve)))
}

function post (url, authToken, data, callback) {
  return new Promise(resolve => {
    const options = {
      url,
      headers: {
        'Authorization': 'key=' + authToken
      },
      body: data,
      json: true
    }
    request.post(options, (error, response, body) => handleResponse(error, response, body, resolve))
  })
}

function handleResponse(error, response, body, callback) {
  callback = callback || new Function()
  if (!error) {
    console.log(response.req.path + ' response code is ' + response.statusCode)
    if (response.statusCode == 200) {
      callback({ok: true, body})
    } else {
      callback({ok: false})
      if (response.statusCode == 502) {
        console.log('Proxy error')
      }
    }
  } else {
    console.log('Error is', error);
  }
}

module.exports = { get, post }