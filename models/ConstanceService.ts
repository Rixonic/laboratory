/*import mongoose, { Schema, model, Model } from 'mongoose';
import { IConstanceService } from '../interfaces';

const userSchema = new Schema({
    provider        : { type: String, required: true, default:" " },
    invoiceNumber   : { type: String, required: true, default:" " },
    date            : { type: String, required: true },
    amount          : { type: Number, required: true, default:" " },
    concept         : { type: String, required: true, default:" " },
    isSigned        : { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
})

const ConstanceService:Model<IConstanceService> = mongoose.models.ConstanceService || model('ConstanceService',userSchema);

export default ConstanceService;
*/

import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
  });

  interface ConstanceServiceAttributes {
    _id: number;
    provider: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    concept: string;
    isSigned: boolean;
  }
  
  interface ConstanceServiceInstance extends Model<ConstanceServiceAttributes>, ConstanceServiceAttributes {}
  

  const ConstanceService = sequelize.define<ConstanceServiceInstance>('ConstanceService', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    concept: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isSigned: {
        type: DataTypes.BOOLEAN,
        //allowNull: false,
        defaultValue: false
    }
  }, {
    tableName: 'ConstanceServices'
  });

   ConstanceService.sync()
  // `sequelize.define` also returns the model
  console.log(ConstanceService === sequelize.models.User); // true

  export default ConstanceService;