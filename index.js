/*
 * Main file for the API
 */

const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const StringDecoder = require('string_decoder').StringDecoder

const config = require('./config')
const _data = require('./lib/data')

// Test --> Delete later
_data.create('test', 'newFile', {'name': 'Santiago'}, function(err) {
    console.log('ERROR:', err)
})

_data.read('test', 'newFilesito1', function(err, data) {
    if (err) {
        console.log('ERROR Reading:', err)
    } else {
        console.log('Data:', data)
    }    
})
_data.update('test', 'newFile', {'name': 'Juan'}, (err, data) => {
    if (!err) {
        console.log('Data upadted:', data)
    } else {
        console.log('ERROR Updating:', err)
    }
})
_data.delete('test', 'newFilesito', (err) => {
    console.log('ERROR:', err)
})

// Instatiate HTTP Server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
})
httpServer.listen(config.httpPORT, () => {
    console.log(`Server listening on port: ${config.httpPORT}\nIn env: ${config.envName}`)
})

// Instatitate HTTPS Server
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res)
})
httpsServer.listen(config.httpsPORT, () => {
    console.log(`Server listening on port: ${config.httpsPORT}\nIn env: ${config.envName}`)
})


// HTTP & HTTPS
let unifiedServer = function(req, res) {
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

    })
}

// Handlers
let handlers = {}

// Ping handler
handlers.ping = function(data, callback) {
    callback(200)
}

// Not Found (404) handler
handlers.notFound = function(data, callback) {
    callback(404)
}

//  Request Router
let router = {
    'ping': handlers.ping
}