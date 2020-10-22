# Description
This is a straight forward wrapper for caching axios requests. It curently supports post and get requests.

# Installation

`npm install --save post-cache`<br/>
or<br/>
`yarn add post-cache`

# Usage

## Instantiate
You can use the axios itself or an instance as the first parameter. The second parameter must be an array of objects and/or strings. It will be used to filter the the urls that will be cached. If you use an object, it must have at least an url attribute.<br/>
The params will be added to the key and will be used to differ the requests. The queryParams are extracted from the config.params, while the bodyParams are extracted from the request body. Notice that we will check if the url in the cachedUrls is contained in the request's url. Therefore 'api.my-api.com' would match both 'api.my-api.com/info' and 'api.my-api.com/super-info'

```javascript
const axios = require('axios')
const PostCache = require('post-cache')

const cachedUrls = [
    {
      url: 'api.my-api.com/info',
      queryParams: ['queryExample'],
      bodyParams: ['bodyExample']
    },
    'api.my-api.com/super-info'
  ]

const postCache = PostCache(axios, cachedUrls)
```


## Post Request

```javascript

postCache.post(url, body, options)

```
### URL 
The Url will be verified to be cached or to get from the cache

### Body
the request's body

### Options
The request's options


## Get Request

```javascript

postCache.get(url, config)

```

### URL
The Url will be verified to be cached or to get from the cache

### config
The request's config

