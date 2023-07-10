const puppeteer = require("puppeteer");


exports.generatePdf = async (htmlString) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();


    await page.setContent(htmlContent);
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
        path: 'uploads/invoice.pdf',
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    return pdf;
}
