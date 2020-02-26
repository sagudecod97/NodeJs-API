/*
 * Create and Export configuration variables
 */

// Environments container
let environtments = {}

// Stagin Env (Default)
environtments.stagin = {
    'httpPORT': 3000,
    'httpsPORT': 3001,
    'envName': 'stagin'
}

// Production Env
environtments.production = {
    'httpPORT': 5000,
    'httpsPORT': 5001,
    'envName': 'production'
}

let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

let environmentExport = environtments[currentEnv] ? environtments[currentEnv] : environtments.stagin

module.exports = environmentExport