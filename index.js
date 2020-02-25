/*
 * Main file for the API
 */

const http = require('http')
const url = require('url')

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
    
    res.end('Hello World\n')
})

server.listen(3000, () => {
    console.log('Server listening on port 3000')
})