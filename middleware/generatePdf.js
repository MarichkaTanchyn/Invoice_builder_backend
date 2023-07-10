const puppeteer = require("puppeteer");


exports.generatePdf = async (htmlString) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(htmlString);
    await page.emulateMediaType('screen');

    const pdfPath = 'uploads/invoice.pdf';
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    return {
        path: pdfPath,
        filename: 'invoice.pdf'
    };
}
