import NodeCache from 'node-cache'

const cache = new NodeCache({
  stdTTL: 900 // standard in seconds
})

export default {
  set (res, fields) {
    if (!res) {
      throw new ReferenceError('you must pass a response object')
    }

    if (!Array.isArray(fields) && typeof fields !== 'undefined') {
      throw new TypeError('fields must be an array or unset')
    }

    if (res.config.url[0] !== '/') {
      res.config.url = '/' + res.config.url
    }

    if (Array.isArray(fields) && fields.length) {
      const keysObject = {}
      const req = JSON.parse(res.config.data)

      fields.forEach(elem => {
        keysObject[elem] = req[elem]
      })

      cache.set(res.config.url + '-' + JSON.stringify(keysObject), res.data)
    } else {
      cache.set(res.config.url, res.data)
    }
  },
  get (url, fields) {
    if (url[0] !== '/') {
      url = '/' + url
    }

    return fields ? cache.get(url + '-' + JSON.stringify(fields)) : cache.get(url)
  }
}
