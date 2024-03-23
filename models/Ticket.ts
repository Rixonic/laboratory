import { Sequelize, DataTypes, Model } from "sequelize";
import {  ITicket } from "../interfaces";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false

});

interface TicketInstance extends Model<ITicket>, ITicket { }

const Ticket = sequelize.define<TicketInstance>('Ticket', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ticketId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue:[]
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Solicitud creada'
    },
    priority: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['ALTA', 'MEDIA', 'BAJA']]
        },
        allowNull: true,
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estimatedFinish: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assignedTo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    finishBy: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    sector: {
        type: DataTypes.STRING
    },
    equipId: {
        type: DataTypes.STRING
    },
    comments: {
        type: DataTypes.ARRAY(DataTypes.JSONB)
        //user: { type: String },
        //comment: { type: String }, // Cambia el tipo del campo a String
        //createdAt: { type: Date, default: Date.now }
    },
    diagnostic: {
        type: DataTypes.JSONB
        //user: { type: String, default: '' },
        //observation: { type: String, default: '' },
    },
    isTechnician: {
        type: DataTypes.BOOLEAN
    },
    isSupervisor: {
        type: DataTypes.BOOLEAN
    },
    isService: {
        type: DataTypes.BOOLEAN
    },
    finishAt: {
        type: DataTypes.DATEONLY
    },
}, {
    tableName: 'Tickets'
});

Ticket.sync({ alter: true })

export default Ticket;