const PdfPrinter = require('pdfmake');
const { PDFDocument } = require('pdf-lib');
const docShipping = require('./files/docShipping');
const docPacking = require('./files/docPacking');
const docInstall = require('./files/docInstall');
const docSystemQueue = require('./files/docSystemQueue');
const docSystemPOS = require('./files/docSystemPOS');
const docSystemCRM = require('./files/docSystemCRM');
const docTestQueue = require('./files/docTestQueue');
const docTestPOS = require('./files/docTestPOS');
const docTestCRM = require('./files/docTestCRM');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const fonts = {
    Roboto: {
        normal: './fonts/THSarabunNew.ttf',
        bold: './fonts/THSarabunNew Bold.ttf',
        italics: './fonts/THSarabunNew Italic.ttf',
        bolditalics: './fonts/THSarabunNew BoldItalic.ttf',
    },
};

module.exports = function registerEndpoint(router) {
    router.use(cors());
    router.use(bodyParser.json());

    // Generate PDF Endpoint
    router.post('/generate-pdf/:type', async (req, res) => {
        try {
            const { type } = req.params;
            const printer = new PdfPrinter(fonts);
            const data = req.body;
            let pdfBuffers = [];

            if (type === 'packingDoc') {
                const buffer = await generatePdfBuffer(printer, docPacking(data));
                pdfBuffers.push(buffer);
            } else if (type === 'shippingDoc') {
                const buffer = await generatePdfBuffer(printer, docShipping(data));
                pdfBuffers.push(buffer);
            } else if (type === 'installDoc') {
                const bufferInstall = await generatePdfBuffer(printer, docInstall(req.body));
                if (data.thirdSection.queueChecked) {
                    const bufferQueue = await generatePdfBuffer(printer, docSystemQueue(req.body));
                    const bufferQueueTest = await generatePdfBuffer(printer, docTestQueue(req.body));
                    pdfBuffers.push(bufferQueue, bufferQueueTest);
                }
                if (data.thirdSection.crmChecked) {
                    const bufferCRM = await generatePdfBuffer(printer, docSystemCRM(req.body));
                    const bufferCRMTest = await generatePdfBuffer(printer, docTestCRM(req.body));
                    pdfBuffers.push(bufferCRM, bufferCRMTest);
                }
                if (data.secondSection.posChecked) {
                    const bufferPOS = await generatePdfBuffer(printer, docSystemPOS(req.body));
                    const bufferPOSTest = await generatePdfBuffer(printer, docTestPOS(req.body));
                    pdfBuffers.push(bufferPOS, bufferPOSTest);
                }
                pdfBuffers.push(bufferInstall);
            } else {
                return res.status(400).json({ error: `Invalid PDF type: ${type}` });
            }

            if (pdfBuffers.length === 1) {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
                res.send(pdfBuffers[0]);
            } else {
                const mergedPdfBytes = await mergePdfs(pdfBuffers);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
                res.send(mergedPdfBytes);
            }
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
        }
    });

    // Send Email Endpoint
    router.post('/send-email', async (req, res) => {
        const { to, subject, text } = req.body;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            await transporter.sendMail({
                from: `"Office Design Test" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                text: text,
            });

            res.status(200).send({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Failed to send email.' });
        }
    });

    // Test Endpoint
    router.get('/test', (req, res) => {
        res.send('Server OK');
    });
};

// Helper Functions
async function generatePdfBuffer(printer, docDefinition) {
    return new Promise((resolve, reject) => {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];

        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);

        pdfDoc.end();
    });
}

async function mergePdfs(pdfBuffers) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
        const pdfToMerge = await PDFDocument.load(new Uint8Array(pdfBuffer));
        const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());

        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return Buffer.from(await mergedPdf.save());
}