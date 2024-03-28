import { db } from './';
import { Ticket } from '../models';
import { ITicket } from '../interfaces';
import { Op } from 'sequelize';



export const getTicketByTicketId = async (ticketId: string): Promise<ITicket | null> => {

    await db.connect();
    const ticket = await Ticket.findOne({ where: { ticketId: ticketId } });
    await db.disconnect();

    if (!ticket) {
        return null;
    }

    ticket.images = ticket.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}tickets/${image}`
    });

    return JSON.parse(JSON.stringify(ticket));
}

interface TicketTicketId {
    ticketId: string;
}

export const getAllTicketTicketId = async (): Promise<TicketTicketId[]> => {


    await db.connect();
    const ticketId = await Ticket.findAll();
    await db.disconnect();

    return ticketId;
}

export const getAllTicketEquipId = async (): Promise<TicketTicketId[]> => {


    await db.connect();
    const ticketId = await Ticket.findAll();
    await db.disconnect();

    return ticketId;
}

export const getTicketsByEquipmentId = async (equip: string): Promise<ITicket[]> => {
    await db.connect();
    const tickets = await Ticket.findAll({ where: { equipId: equip } })

    await db.disconnect();

    const updatedTickets = tickets.map((ticket) => {
        ticket.images = ticket.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}tickets/${image}`;
        });
        return ticket;
    });

    return JSON.parse(JSON.stringify(updatedTickets));
}

export const getTicketsByLocation = async (locations: string[]): Promise<ITicket[]> => {
    const lowerCaseLocations = locations.map(location => location.toUpperCase());
    await db.connect();
    const tickets = await Ticket.findAll(
        {
            where: {
                location: { [Op.in]: lowerCaseLocations }
            },
          }        
    )
       
    await db.disconnect();
    
    const updatedTickets = tickets.map(ticket => {
        ticket.images = ticket.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}tickets/${image}`
        });

        return ticket;
    })


    return updatedTickets;
}

export const getAllTickets = async (): Promise<ITicket[]> => {
    await db.connect();
    const tickets = await Ticket.findAll();
    await db.disconnect();

    const updatedTickets = tickets.map(ticket => {
        ticket.images = ticket.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}tickets/${image}`
        });
        return ticket;
    });


    return JSON.parse(JSON.stringify(updatedTickets));
}


