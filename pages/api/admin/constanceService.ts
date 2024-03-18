import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'date-fns';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

import { db } from '../../../database';
import { IConstanceService } from '../../../interfaces/constanceService';
import { ConstanceService, Equipment } from '../../../models'
import { Sequelize } from 'sequelize';

interface reqBody {
    constanceId : string;
    userId      : string;
    sign        : boolean
}

type Data =
    | { message: string }
    | IConstanceService[]
    | IConstanceService;

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
    const constanceServices = await ConstanceService.findAll();
    const helper = JSON.parse(JSON.stringify(constanceServices, null, 2))
    const updatedTickets = helper.map(ticket => {
        const formattedDate = format(new Date(ticket.date), 'dd/MM/yyyy');
        return {
            ...ticket,
            id: ticket._id, 
            date: formattedDate
        };
    });

    await db.disconnect();

    res.status(200).json(updatedTickets);

}

const updateConstance = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const authorizedChatID = process.env.TELEGRAM_BOT_CHATID;
    const { constanceId, userId, sign } = req.body as reqBody;

    try {
        await db.connect();
        if (authorizedChatID == userId) {
              await ConstanceService.update({ isSigned: sign }, {
                where: {
                    _id: constanceId
                }
              });
            await db.disconnect();
            return res.status(200).json({ message: 'Constancia actualizada' });
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
    
    const constanceService = req.body as IConstanceService;
    console.log(constanceService)

    try {
        await db.connect();
        const constanceInDB = await ConstanceService.create(req.body);
        console.log(constanceInDB)
        //const constance = new ConstanceService(req.body);
        //await constance.save();
        await db.disconnect();

        await sendTelegramMessage(constanceInDB);

        res.status(201).json(constanceInDB);


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}

const sendTelegramMessage = async (constance: IConstanceService) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_API;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_BOT_CHATID;

    const { _id, provider, date, amount, concept } = constance;
    const formattedDate = format(new Date(date), 'dd/MM/yyyy');

    const message = `Nueva constancia creada:
Proveedor: ${provider}
Fecha: ${formattedDate}
Monto: ${amount}
Concepto: ${concept}`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: 'Firmar', callback_data: JSON.stringify({"constanceId": _id,"sign": true}) },
                { text: 'Rechazar', callback_data: JSON.stringify({"constanceId": _id,"sign": false}) }
            ]
        ]
    };

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const body = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        reply_markup: keyboard
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log('Telegram API response:', result);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}