import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '../../../database';
import { IEquipment } from '../../../interfaces/equipments';
import { Equipment } from '../../../models';
import { Sequelize,QueryTypes } from 'sequelize';

type Data = 
| { message: string }
| IEquipment[]
| IEquipment;

interface EquipmentWithChildren extends IEquipment {
    associatedEquip?: IEquipment[];
}

const query = `
WITH RECURSIVE EquipmentHierarchy AS (
    -- Ancla: Selecciona los equipos que no tienen padre
    SELECT 
      "_id", "equip", "equipId", "model", "brand", "sector", "location", "headquarter", "images", "ecri", "serialNumber", "criticalType", "perfomance", "duePerfomance", "electricalSecurity", "dueElectricalSecurity", "parentId", "createdAt", "updatedAt"
    FROM 
      "Equipments" 
    WHERE 
      "parentId" IS NULL
  
    UNION ALL
  
    -- Paso recursivo: Selecciona los equipos que tienen como padre a los equipos encontrados en el paso anterior
    SELECT 
      e."_id", e."equip", e."equipId", e."model", e."brand", e."sector", e."location", e."headquarter", e."images", e."ecri", e."serialNumber", e."criticalType", e."perfomance", e."duePerfomance", e."electricalSecurity", e."dueElectricalSecurity", e."parentId", e."createdAt", e."updatedAt"
    FROM 
      "Equipments" AS e
    INNER JOIN 
      EquipmentHierarchy AS eh ON e."parentId" = eh."_id"
  )
  
  -- Seleccionar todos los equipos y sus respectivos padres
  SELECT 
    "_id", "equip", "equipId", "model", "brand", "sector", "location", "headquarter", "images", "ecri", "serialNumber", "criticalType", "perfomance", "duePerfomance", "electricalSecurity", "dueElectricalSecurity", "parentId", "createdAt", "updatedAt"
  FROM 
    EquipmentHierarchy;
`;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getEquipments( req, res );
            
        case 'PUT':
            return updateEquipment( req, res );

        case 'POST':
            return createEquipment( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getEquipments = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { sector, location } = req.query;


    const organizeEquipments = (equipments: IEquipment[]): IEquipment[] => {
        const equipmentMap = new Map<number, EquipmentWithChildren>();
    
        // Primero, mapeamos cada equipo por su _id para facilitar el acceso
        equipments.forEach(equip => {
            if (!equipmentMap.has(equip._id)) {
                equipmentMap.set(equip._id, { ...equip, associatedEquip: [] });
            }
        });
    
        // Luego, recorremos nuevamente los equipos para asignar los hijos a sus respectivos padres
        equipments.forEach(equip => {
            const parent = equipmentMap.get(equip.parentId);
            if (parent) {
                parent.associatedEquip.push(equipmentMap.get(equip._id)!);
            }
        });
    
        // Finalmente, filtramos los equipos para obtener solo los padres y los devolvemos
        return Array.from(equipmentMap.values()).filter(equip => !equip.parentId);
    };
    
    // En la función getEquipments, después de obtener los resultados de la consulta

    
    // Organizamos los equipos según la lógica definida
    

    await db.connect();

    try {

        const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
            host: 'localhost',
            dialect: 'postgres'
        });

        const [results, metadata] = await sequelize.query(query);
        const organizedEquipments = organizeEquipments(results as any);


        await db.disconnect();

        res.status(200).json(organizedEquipments);
    } catch (error) {
        console.error(error);
        await db.disconnect();
        res.status(500).json({ message: 'Internal Server Error' });
    }
}



const updateEquipment = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IEquipment;

    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }
    /*
    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }
    */

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {
        
        await db.connect();
        const equipment = await Equipment.findByPk(_id);
        if ( !equipment ) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        equipment.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                // Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        });

        Object.assign(equipment, req.body);
        await equipment.save(); 
        await db.disconnect();
        

        return res.status(200).json( equipment );
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createEquipment = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log(req.body)
    const { images = [] } = req.body as IEquipment;
    
    //test
    /*
    if ( images.length < 2 ) {                                                          //modificar?
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    */


    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        await db.connect();

        const equipment = await Equipment.create( req.body );
        await db.disconnect();

        res.status(201).json( equipment );


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

