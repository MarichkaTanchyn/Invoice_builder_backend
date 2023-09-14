const { join } = require('path')
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        cacheDirectory: join(__dirname, '.cache', 'puppeteer')
    });
})();
