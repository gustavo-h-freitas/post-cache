const cache = require('./src/cache')

/*
  cachedUrls = [
    {
      url: 'api.myapi/graphics,
      queryParams: ['exQuery'],
      bodyParams: ['exBody'],
    },
    {
      url: 'api.myapi/info'
    },
    'api.myapi/superinfo'
  ]
*/

module.exports = function (axios, cachedUrls) {
  if (!axios) {
    throw new ReferenceError('You must pass axios or axios instance')
  }

  if (!cachedUrls) {
    throw new ReferenceError('c\'mon, man')
  }

  if (!Array.isArray(cachedUrls)) {
    throw new TypeError('the cached urls must be an array')
  }

  if (cachedUrls.some(elem => {
    if (!elem) {
      return true
    }

    if (Array.isArray(elem)) {
      return true
    }

    if (typeof elem === 'object') {
      if (!elem.url) {
        return true
      }
    } else if (typeof elem !== 'string') {
      return true
    }
  })) {
    throw new TypeError('Please, provide only objects (with a url) or a string')
  }

  return {
    async post (url, body, config) {
      if (!body) {
        throw ReferenceError('You must provide a body for a post request (even if it is empty)')
      }

      if (typeof body !== 'object' || Array.isArray(body)) {
        throw TypeError('The body must be an object (even if it is empty)')
      }

      let cacheable = false

      cachedUrls.forEach(elem => {
        if (typeof elem === 'string') {
          if (url.includes(elem)) {
            cacheable = elem            
          }
        } else {
          if (url.includes(elem.url)) {
            cacheable = elem
          }
        }
      })

      if (cacheable) {
        let cached = null

        if (typeof cacheable === 'string') {
          cached = cache.get(cacheable)
        } else {
          cached = cache.get(cacheable.url, body, config, cacheable.queryParams, cacheable.bodyParams)
        } 

        if (cached) {
          return Promise.resolve({
            data: cached,
            status: 200,
            statusText: 'OK',
            headers: {},
            request: {}
          })
        } else {
          const response = await axios.post(url, body, config)
          cache.set(response, cacheable.queryParams, cacheable.bodyParams)

          return response
        }
      }
      
      return axios.post(url, body, config)
    },

    async get (url, config) {

      let cacheable = false

      cachedUrls.forEach(elem => {
        if (typeof elem === 'string') {
          if (url.includes(elem)) {
            cacheable = elem        
          }
        } else {
          if (url.includes(elem.url)) {
            cacheable = elem
          }
        }
      })

      if (cacheable) {
        let cached = null
        const queryKeys = {}

        if (typeof cacheable === 'string') {
          cached = cache.get(cacheable)
        } else {

          if (cacheable.queryParams) {
            if (Array.isArray(cacheable.queryParams) && config) {
              cacheable.queryParams.forEach(elem => {
                queryKeys[elem] = config.params[elem]
              })
            } else if (config) {
              throw new TypeError('QueryParams must be an array')
            }
          }
          if (Object.keys(queryKeys).length > 0) {
            cached = cache.get(url, undefined, config, queryKeys, undefined)
          } else {
            cached = cache.get(cacheable)
          }
        }

        if (cached) {
          return Promise.resolve({
            data: cached,
            status: 200,
            statusText: 'OK, cached',
            headers: {},
            request: {}
          })
        } else {
          const response = await axios.get(url, config)
          if (Object.keys(queryKeys).length > 0) {
            cache.set(response, queryKeys, undefined, url)
          } else {
            cache.set(response)
          }
          return response
        }
      }
      
      return axios.get(url, config)
    },

    flushAll () {
      cache.flushAll()
    }
  }
}
