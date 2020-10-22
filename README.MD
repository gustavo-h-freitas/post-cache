# Description
This is a straight forward wrapper for caching axios requests. It curently supports post and get requests.

# Installation

`npm install --save post-cache`<br/>
or<br/>
`yarn add post-cache`

# Usage

## Instantiate
You can use the axios itself or an instance as the first parameter. The second parameter must be an array of objects and/or strings. It will be used to filter the the urls that will be cached. If you use an object, it must have at least an url attribute.<br/>

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
###

### Body