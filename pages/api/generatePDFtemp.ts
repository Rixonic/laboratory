import { NextApiRequest, NextApiResponse } from 'next';
import { templateTemp } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { format } from 'date-fns';
import axios from "axios"

// Función para convertir una imagen a base64
function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    console.time('Total request time');
    console.time('Template replacement');
    // Reemplazar variables en la plantilla con valores del cuerpo de la solicitud
    const replacedHtml = templateTemp.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
        return req.body[variable.trim()] || '';
    });
    console.timeEnd('Template replacement');

    try {
        console.time('API request');
        const response = await axios.get(
            `http://10.0.0.124:4000/temperaturaFiltrada/${req.body.sensorId}`,
            {
              params: {
                sensorId: req.body.sensorId,
                date: req.body.date,
              },
            }
          );
          console.timeEnd('API request');

          console.time('Puppeteer launch');
          //console.log(response.data)

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.timeEnd('Puppeteer launch');

        const { temp, timestamp } = response.data;

        console.time('Date formatting');
        const formattedTimestamps = timestamp.map(timestamp =>
            format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
          );
          console.timeEnd('Date formatting');

          console.time('HTML replacement');
        // Reemplazar los datos en la plantilla HTML
        const replacedHtml = templateTemp
            .replace('{{temp}}', JSON.stringify(temp))
            .replace('{{time}}', JSON.stringify(formattedTimestamps));

        const finalHtml = replacedHtml.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
            return req.body[variable.trim()] || '';
        });
        console.timeEnd('HTML replacement');

        console.time('Image to Base64');
        // Convertir las imágenes a base64
        const logoBase64 = imageToBase64(process.env.LOGO_ROUTE);
        //const firmaBase64 = imageToBase64(`C:\\signature\\firmaJP.png`);
        let htmlWithBase64Images = finalHtml.replace('./LogoSJD-Granada.png', `data:image/png;base64,${logoBase64}`)
        // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML

        console.timeEnd('Image to Base64');

        console.time('Puppeteer set content');
        await page.goto('about:blank');
        
        await page.setContent(htmlWithBase64Images, { waitUntil: 'networkidle2' });
        console.timeEnd('Puppeteer set content');

        console.time('Generate PDF');
        //await page.waitForFunction(() => !!document.querySelector('#temperatureChart canvas'));

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape:true
        });

        await browser.close();
        console.timeEnd('Generate PDF');

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error('Error generando el PDF:', error);
        res.status(500).send('Error generando el PDF');
    }
    console.timeEnd('Total request time');
};