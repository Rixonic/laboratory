import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'date-fns';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

import { db } from '../../../database';
import { Requerimient } from '../../../models'
import { IRequerimient } from '../../../interfaces';
import { templateRequerimient, bodyItems } from '../../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

interface reqBody {
    id : string;
    userId      : string;
    sign        : boolean
}

type Data =
    | { message: string }
    | IRequerimient[]
    | IRequerimient;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getConstances(req, res);

        case 'PUT':
            return updateConstance(req, res);

        case 'POST':
            return createConstance(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' });
    }


}

const getConstances = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const requerimients = await Requerimient.findAll({raw: true});
    const updatedRequerimients = requerimients.map(requerimient => {
        const formattedDate = format(new Date(requerimient.createdAt), 'dd/MM/yyyy');
        return {
            ...requerimient,
            createdAt: formattedDate
        };
    });

    await db.disconnect();

    res.status(200).json(updatedRequerimients);

}


const updateConstance = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const authorizedChatID = process.env.TELEGRAM_BOT_CHATID;
    const { id, userId, sign } = req.body as reqBody;

    try {
        await db.connect();
        if (authorizedChatID == userId) {
            await Requerimient.update( { isSigned: sign } , {
                where: {
                    requerimientId: id
                }
              });
            await db.disconnect();
            return res.status(200).json({ message: 'Requerimiento actualizado' });
        } else {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }
}

const createConstance = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const requerimient = req.body as IRequerimient;
    try {
        await db.connect();
        const requerimiento = await Requerimient.create(req.body);
        await db.disconnect();
        const pdfBuffer = await generatePDFrequerimient (requerimiento)
        await sendTelegramMessage(requerimiento,pdfBuffer);
        res.status(201).json(requerimiento);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}

const sendTelegramMessage = async (requerimient: IRequerimient, pdfBuffer: Buffer) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_API;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_BOT_CHATID;

    const { requerimientId,_id } = requerimient;
    const message = `Requerimiento: ${requerimientId}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: 'Firmar', callback_data: JSON.stringify({ "id": requerimientId, "sign": true , type:"requerimient"}) },
                { text: 'Rechazar', callback_data: JSON.stringify({ "id": requerimientId, "sign": false, type:"requerimient" }) }
            ]
        ]
    };
    
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', pdfBuffer, {
        filename: `Requerimiento - ${requerimient.requerimientId}.pdf`,
        contentType: 'application/pdf'
    });
    formData.append('caption', message);
    formData.append('reply_markup', JSON.stringify(keyboard));

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders() // Añade los headers correspondientes
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

// Función para convertir una imagen a base64
function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

async function generatePDFrequerimient(requerimiento: IRequerimient) {
    const requerimient = {
        createdAt: format(new Date(requerimiento.createdAt), 'dd/MM/yyyy'),
        requerimientId  : requerimiento.requerimientId,
        severity        : requerimiento.severity,
        expectedMonth   : requerimiento.expectedMonth,
        service         : requerimiento.service,
        destination     : requerimiento.destination,
        comment         : requerimiento.comment,
        createdBy       : requerimiento.createdBy,
    }
    
    const items = requerimiento.items;

    console.log("requerimient:",requerimient)
   
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
        return requerimient[variable.trim()] || '';
    });


    // Reemplazar listItems en la plantilla con el string generado
    
    //console.log(replacedHtml)

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Convertir las imágenes a base64
        const firmaBase64 = imageToBase64(`C:\\signature\\firmaFC.png`);
        const firmaJPBase64 = imageToBase64(`C:\\signature\\firmaJP.png`);

        // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML
        let htmlWithBase64Images = replacedHtml.replace('./firma.png', `data:image/png;base64,${firmaBase64}`)
        
        if (requerimiento.isSigned){
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
        return pdfBuffer
    } catch (error) {
        console.error('Error generando el PDF:', error);
    }
}