const base = require('./webpack.config.base')
module.exports = base.map(f => f("development", "source-map"));