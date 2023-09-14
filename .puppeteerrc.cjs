const { join } = require('path')

module.exports = {
    // Changes the cache location for Puppeteer.
    launch: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
}