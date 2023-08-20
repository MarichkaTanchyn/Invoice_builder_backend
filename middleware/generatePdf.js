const puppeteer = require("puppeteer");

exports.generatePdf = async (htmlString) => {
    let browser;

    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setContent(htmlString);
        await page.emulateMediaType('screen');

        const pdfPath = 'uploads/invoice.pdf';
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        return {
            path: pdfPath,
            filename: 'invoice.pdf'
        };

    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}
