import { Sequelize, DataTypes, Model } from "sequelize";
import { IDosimeter, IEquipment, IRequerimient } from "../interfaces";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false

  });

  interface RequerimientInstance extends Model<IRequerimient>, IRequerimient {}

const Requerimient = sequelize.define<RequerimientInstance>('Requerimient', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    requerimientId: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    severity:       { 
        type: DataTypes.STRING,
        allowNull: false
    },
    expectedMonth:  { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    service:        { 
        type: DataTypes.STRING,
        allowNull: false
    },
    destination:    { 
        type: DataTypes.STRING,
        allowNull: false
    },
    comment:        { 
        type: DataTypes.STRING,
        allowNull: true  
    },
    createdBy:      { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    isSigned:       { 
        type: DataTypes.BOOLEAN, 
        allowNull: false,
        defaultValue: false 
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('items');
            if (rawValue) {
                return rawValue.map((item: any) => ({
                    item: item.item || '',
                    quantity: item.quantity || 0,
                    type: item.type || '',
                    description: item.description || '',
                    brand: item.brand || '',
                    model: item.model || '',
                    reason: item.reason || '',
                    costCenter: item.costCenter || '',
                    account: item.account || ''
                }));
            } else {
                return [];
            }
        },
        set(value: any[]) {
            this.setDataValue('items', value);
        }
    },
    }, {
    tableName: 'Requerimients'
  });

  Requerimient.sync() 

export default Requerimient;

