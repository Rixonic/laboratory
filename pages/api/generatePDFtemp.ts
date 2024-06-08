import { NextApiRequest, NextApiResponse } from 'next';
import { templateTemp } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { format } from 'date-fns';

// Función para convertir una imagen a base64
function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    
    // Reemplazar variables en la plantilla con valores del cuerpo de la solicitud
    //const replacedHtml = templateConstance.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
    //    return req.body[variable.trim()] || '';
    //});

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log(req.body)
        const { temp, timestamp } = req.body;

        console.log(temp)
        console.log(timestamp)

        const formattedTimestamps = timestamp.map(timestamp =>
            format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
          );

        // Reemplazar los datos en la plantilla HTML
        const replacedHtml = templateTemp
            .replace('{{temp}}', JSON.stringify(temp))
            .replace('{{time}}', JSON.stringify(formattedTimestamps));

        // Convertir las imágenes a base64
        const logoBase64 = imageToBase64(`C:\\Users\\franc\\Desktop\\sjd-sql\\utils\\templates\\LogoSJD-Granada.png`);
        //const firmaBase64 = imageToBase64(`C:\\signature\\firmaJP.png`);
        let htmlWithBase64Images = replacedHtml.replace('./LogoSJD-Granada.png', `data:image/png;base64,${logoBase64}`)
        // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML


        await page.goto('about:blank');
        
        await page.setContent(htmlWithBase64Images, { waitUntil: 'networkidle2' });

        //await page.waitForFunction(() => !!document.querySelector('#temperatureChart canvas'));

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape:true
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