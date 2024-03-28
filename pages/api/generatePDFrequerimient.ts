import { NextApiRequest, NextApiResponse } from 'next';
import { templateRequerimient, bodyItems } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';

// Función para convertir una imagen a base64
function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const items = req.body.items;

    // Generar el string con el formato de bodyItems
    let itemsString = '';
    items.forEach((item, index) => {
        // Reemplazar las variables en bodyItems con los valores del item actual
        const replacedItem = bodyItems.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
            return item[variable.trim()] || '';
        });
        itemsString += replacedItem;
    });
    const replacedHtmlWithItems = templateRequerimient.replace('{{listItems}}', itemsString);

    // Reemplazar variables en la plantilla con valores del cuerpo de la solicitud
    const replacedHtml = replacedHtmlWithItems.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
        return req.body[variable.trim()] || '';
    });


    // Reemplazar listItems en la plantilla con el string generado
    
    //console.log(replacedHtml)

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Convertir las imágenes a base64

        const firmaBase64 = imageToBase64(`/var/www/sjd-sql/utils/signature/firma${req.body.createdBy}.png`);
        const firmaJPBase64 = imageToBase64(`/var/www/sjd-sql/utils/signature/firmaJuan Pablo.png`);

        // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML
        let htmlWithBase64Images = replacedHtml.replace('./firma.png', `data:image/png;base64,${firmaBase64}`)
        
        if(req.body.isSigned){
            htmlWithBase64Images = htmlWithBase64Images.replace('./firmaJP.png', `data:image/png;base64,${firmaJPBase64}`);
        }
        

            
        
        await page.goto('about:blank');
        await page.setContent(htmlWithBase64Images, { waitUntil: 'domcontentloaded' });
        //await page.setContent(replacedHtml, { waitUntil: 'domcontentloaded' });

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape:true,
            
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