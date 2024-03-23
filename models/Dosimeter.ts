import { Sequelize, DataTypes, Model } from "sequelize";
import { IDosimeter, IEquipment } from "../interfaces";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false

  });

  interface DosimeterInstance extends Model<IDosimeter>, IDosimeter {}

const Dosimeter = sequelize.define<DosimeterInstance>('Dosimeter', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    year : { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    month : { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    headquarter : { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    service : { 
        type: DataTypes.STRING, 
        allowNull: false  
    },
    location : { 
        type: DataTypes.STRING,  
        allowNull: false  
    },
    document : { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
  }, {
    tableName: 'Dosimeters'
  });

  Dosimeter.sync() 

  export default Dosimeter;