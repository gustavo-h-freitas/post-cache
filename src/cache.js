const NodeCache = require('node-cache')

const cache = new NodeCache({
  stdTTL: 900 // standard in seconds
})

module.exports = {
  flushAll () {
    cache.flushAll()
  },

  set (res, queryParams, bodyParams, url) {
    if (!res) {
      throw new ReferenceError('you must pass a response object')
    }

    if (Array.isArray(queryParams) && typeof queryParams !== 'undefined') {
      throw new TypeError('queryParams must be an object or unset')
    }

    if (!Array.isArray(bodyParams) && typeof bodyParams !== 'undefined') {
      throw new TypeError('bodyParams must be an array or unset')
    }

    // if (res.config.url[0] !== '/') {
    //   res.config.url = '/' + res.config.url
    // }

    if (!Array.isArray(queryParams) || Array.isArray(bodyParams)) {
      const queryObject = {}
      const bodyObject = {}
      const req = res.data


      if (!Array.isArray(queryParams) && res.config.params) {
        Object.keys(queryParams).forEach(key => {
          queryObject[key] = res.config.params[key]
        })
      }

      if (Array.isArray(bodyParams)) {
        bodyParams.forEach(elem => {
          bodyObject[elem] = req[elem]
        })
      }

      cache.set(url + '-' + JSON.stringify({
        ...(Object.keys(queryObject).length ? { queryObject } : null),
        ...(Object.keys(bodyObject).length ? { bodyObject } : null)
      }), res.data)

    } else {
      cache.set(url, res.data)
    }

  },
  get (url, body, config, queryParams, bodyParams) {
    if (!url) {
      throw new ReferenceError('you must pass a response object')
    }

    if ((Array.isArray(body) || typeof body !== 'object') && typeof body !== 'undefined') {
      throw new TypeError('body must be an object or unset')
    }

    if ((Array.isArray(config) || typeof config !== 'object') && typeof config !== 'undefined') {
      throw new TypeError('config must be an object or unset')
    }

    if (Array.isArray(queryParams) && typeof queryParams !== 'undefined') {
      throw new TypeError('queryParams must be an object or unset')
    }

    if (!Array.isArray(bodyParams) && typeof bodyParams !== 'undefined') {
      throw new TypeError('bodyParams must be an array or unset')
    }

    // if (url[0] !== '/') {
    //   url = '/' + url
    // }

    if (!Array.isArray(queryParams) || Array.isArray(bodyParams)) {
      const queryObject = {}
      const bodyObject = {}


      if (!Array.isArray(queryParams) && config && config.params) {
        Object.keys(queryParams).forEach(key => {
          queryObject[key] = config.params[key]
        })
      }

      if (Array.isArray(bodyParams) && body) {
        bodyParams.forEach(elem => {
          bodyObject[elem] = body[elem]
        })
      }
      return cache.get(url + '-' + JSON.stringify({
        ...(Object.keys(queryObject).length ? { queryObject } : null),
        ...(Object.keys(bodyObject).length ? { bodyObject } : null)
      }))
    } else if (!config && typeof url === 'object') {
      return cache.get(url.url)
    }

    return cache.get(url)

  }
}
