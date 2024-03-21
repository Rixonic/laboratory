import { NextApiRequest, NextApiResponse } from 'next';
import { templateConstance } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';

// Función para convertir una imagen a base64
function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

    // Reemplazar variables en la plantilla con valores del cuerpo de la solicitud
    const replacedHtml = templateConstance.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
        return req.body[variable.trim()] || '';
    });

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Convertir las imágenes a base64
        const logoBase64 = imageToBase64(`C:\\signature\\logoSJD.png`);
        const firmaBase64 = imageToBase64(`C:\\signature\\firmaJP.png`);

        // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML
        const htmlWithBase64Images = replacedHtml
            .replace('./Logo Hospital San Juan de Dios -Original-.png', `data:image/png;base64,${logoBase64}`)
            .replace('./firmaJuan.png', `data:image/png;base64,${firmaBase64}`);

        await page.goto('about:blank');
        await page.setContent(htmlWithBase64Images, { waitUntil: 'domcontentloaded' });

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).send('Error generando el PDF');
    }
};