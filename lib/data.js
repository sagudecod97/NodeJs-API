/*
 * Lib for store/edit Data
 */

const fs = require('fs')
const path = require('path')

// Container
const lib = {}
lib.baseDir = path.join(__dirname, '/../.data/')

// Write data
lib.create = function(dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fd) {
        if (!err && fd) {
            // Serialize data
            let dataJSON = JSON.stringify(data)
            fs.writeFile(fd, dataJSON, (err) => {
                if (!err) {
                    fs.close(fd, (err) => {
                        if (!err) {
                            callback(false)
                        } else {
                            callback('Error closing file')
                        }
                    })
                } else {
                    callback('Error writing to file')
                }
            })
        } else {
            callback('Could not create new file, may already exists')
        }
    })
}

// Read file
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data)
    })
}

// Update file
lib.update = function(dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fd) => {
        if (!err) {
            let dataJSON = JSON.stringify(data)

            fs.ftruncate(fd, (err) => {
                if (!err) {
                    fs.writeFile(fd, dataJSON, (err) => {
                        if (!err) {
                            fs.close(fd, (err) => {
                                if (!err) {
                                    callback(false, data)
                                } else {
                                    callback('Couldn\'t close the file')
                                }
                            })
                        } else {
                            callback('Couldn\'t write to existing file')
                        }
                    })
                } else {
                    callback('Couldn\'t update the file')
                }
            })
        } else {
            callback('Couldn\'t open the file, or non existing')
        }
    })
}

// Delete File
lib.delete = function(dir, file, callback) {
    // Unlink --> Delete from file system
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('There\'s been an error while deleting file')
        }
    })
}

module.exports = lib