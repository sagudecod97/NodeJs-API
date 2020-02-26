/*
 * Main file for the API
 */

const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const config = require('./config')

const server = http.createServer((req, res) => {
    // First Parse the URL
    let parsedURL = url.parse(req.url, true)
    // Getting the URL
    let path = parsedURL.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // get the req Method
    let reqMethod = req.method.toUpperCase()

    // Query string as Object
    let queryObj = parsedURL.query

    // Headers as Object
    let headerObj = req.headers

    // Get Payload
    let decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', (chunk) => {
        buffer += decoder.write(chunk)
    })
    req.on('end', () => {
        buffer += decoder.end()

        // Handler for Req, if not found --> 404
        let handlerReq = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // Build data object for Handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryObj': queryObj,
            'method': reqMethod,
            'payload': buffer
        }

        // Route req to handler
        handlerReq(data, function(statusCode, payload) {
            // Use status of handler, or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use payload of handler, or empty object
            payload = typeof(payload) == 'object' ? payload : {}

            // Serialize Payload
            let payloadJSON = JSON.stringify(payload)

            // Return res
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadJSON)

            console.log('Returned response:\n', statusCode, payload)
        })


        res.end('Hello World\n')
    })

})

server.listen(config.PORT, () => {
    console.log(`Server listening on port: ${config.PORT}\nIn env: ${config.envName}`)
})

// Handlers
let handlers = {}

// Sample handler
handlers.sample = function(data, callback) {
    // Call a HTTP status, and Payload object
    callback(406, {'name': 'Sample handler'})
} 

// Not Found (404) handler
handlers.notFound = function(data, callback) {
    callback(404)
}

//  Request Router
let router = {
    'sample': handlers.sample
}