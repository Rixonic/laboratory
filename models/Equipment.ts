/*import mongoose, { Schema, model, Model } from 'mongoose';
import { IEquipment } from '../interfaces';

const equipmentSchema = new Schema({
    equipId: { type: String, required: true,unique: true },
    model: { type: String, required: true, default: '' },
    brand: { type: String, required: true, default: '' },
    sector: { type: String, required: true, default: '' },
    equip: { type: String, required: true, default: '' },
    location: {
        type: String,
        enum: {
            values: ['QUIROFANO','ENDOSCOPIA','HEMODINAMIA','ENFERMERIA','NEONATOLOGIA','CONSULTORIOS'],
            message: '{VALUE} no es un locacion válida'
        }
    },
    headquarter: [{
        type: String,
        enum: {
            values: ['CASTELAR','RAMOS MEJIA'],
            message: '{VALUE} no es un locacion válida'
        }
    }],
    images: [{ type: String }],
    ecri: { type: String, required: true, default: '' },
    serialNumber: { type: String, required: true , default: '' }, //agregar el unique: true cuando se corriga el numero de serie
    criticalType: {
        type: String,
        enum: {
            values: ['CRITICO','NO CRITICO'],
            message: '{VALUE} no es un tipo válido'
        },
    },
    perfomance  : { type: Date },
    duePerfomance: { type: Date },
    electricalSecurity: { type: Date },
    dueElectricalSecurity: { type: Date },

},{
    timestamps: true
});
equipmentSchema.add({associatedEquip: [equipmentSchema]})

equipmentSchema.index({ title: 'text', tags: 'text' });


const Equipment: Model<IEquipment> = mongoose.models.Equipment || model('Equipment', equipmentSchema );


export default Equipment;*/

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
import { IEquipment } from "../interfaces";

const sequelize = new Sequelize('dbSJD', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
  });
  export type ICriticalType = 'CRITICO'|'NO CRITICO';
  export type ILocation = 'QUIROFANO'|'ENDOSCOPIA'|'HEMODINAMIA'|'ENFERMERIA'|'NEONATOLOGIA'|'CONSULTORIOS';
  

  interface EquipmentInstance extends Model<IEquipment>, IEquipment {}
  

  const Equipment = sequelize.define<EquipmentInstance>('Equipment', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    equip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    equipId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
      },
    brand: {
          type: DataTypes.STRING,
          allowNull: false
      },
    sector: {
        type: DataTypes.STRING,
        allowNull: false
      },
    location: {
          type: DataTypes.STRING,
          allowNull: false
      },
    headquarter: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['RAMOS MEJIA', 'CASTELAR']]
          }
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    ecri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    criticalType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['CRITICO', 'NO CRITICO']]
          }
    },
    associatedEquip: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['CRITICO', 'NO CRITICO']]
          }
    },
    isSigned: {
        type: DataTypes.BOOLEAN,
        //allowNull: false,
        defaultValue: false
    }
  }, {
    tableName: 'ConstanceServices'
  });

   Equipment.sync()
  // `sequelize.define` also returns the model
  console.log(Equipment === sequelize.models.Equipment); // true

  export default Equipment;