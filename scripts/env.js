const dotenv = require('dotenv')

let env = dotenv.config({ path: require('find-config')('.ENV') }); env = env.parsed

module.exports = env