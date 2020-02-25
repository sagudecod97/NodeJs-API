/*
 * Main file for the API
 */

const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

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
        res.end('Hello World\n')
    })

})

server.listen(3000, () => {
    console.log('Server listening on port 3000')
})