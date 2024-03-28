import { Sequelize, DataTypes, Model } from "sequelize";
import { IEquipment } from "../interfaces";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    //logging: false

  });

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
    perfomance: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    electricalSecurity: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Puede ser nulo si no tiene un equipo padre
        defaultValue : null
    }
  }, {
    tableName: 'Equipments'
  });

  // `sequelize.define` also returns the model
  
  Equipment.hasMany(Equipment, { as: 'children', foreignKey: 'parentId' });
  Equipment.belongsTo(Equipment, { as: 'parent', foreignKey: 'parentId' });

{  Equipment.sync() }

  console.log(Equipment === sequelize.models.Equipment); // true

  export default Equipment;