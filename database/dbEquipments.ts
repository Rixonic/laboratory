import { db } from './';
import { Equipment } from '../models';        //Se modifica
import { IEquipment } from '../interfaces';   //Se modifica


export const getEquipmentByEquip = async( equip: string ): Promise<IEquipment | null> => {

    await db.connect();
    const equipment = await Equipment.findOne({ where: { equip: equip } });
    await db.disconnect();

    if ( !equipment ) {
        return null;
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return JSON.parse( JSON.stringify( equipment ) );
}

export const getEquipmentByEquipId = async( equipId: string ): Promise<IEquipment | null> => {

    await db.connect();
    const equipment = await Equipment.findOne({ where: { equipId: equipId } });
    await db.disconnect();

    if ( !equipment ) {
        return null;
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return JSON.parse( JSON.stringify( equipment ) );
}

interface EquipmentEquip {
    equip: string;
}
interface EquipmentEquipId {
    equipId: string;
}

export const getAllEquipments = async(): Promise<IEquipment[]> => {

    await db.connect();
    const equipments = await Equipment.findAll();
    await db.disconnect();


    const updatedEquipments = equipments.map( equipment => {
        equipment.images = equipment.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
        });
        return equipment;
    });


    return JSON.parse( JSON.stringify( updatedEquipments ) );
}
