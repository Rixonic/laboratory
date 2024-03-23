import { db } from '.';
import { Dosimeter } from '../models';        //Se modifica
import { IDosimeter } from '../interfaces';   //Se modifica
import { Op } from 'sequelize';

/*
export const getDosimeterById = async( id: string ): Promise<IDosimeter | null> => {

    await db.connect();
    const dosimeter = await Dosimeter.findOne({ id }).lean();
    await db.disconnect();

    if ( !dosimeter ) {
        return null;
    }

    dosimeter.document = dosimeter.document.includes('http')
        ? dosimeter.document
        : `${process.env.HOST_NAME}equipments/${dosimeter.document}`;

    return JSON.parse( JSON.stringify( dosimeter ) );
}*/

export const getDosimeterByLocation = async (locations: string[]): Promise<IDosimeter | null> => {
    const lowerCaseLocations = locations.map(location => location.toUpperCase());
    
    await db.connect();
    const dosimeter = await Dosimeter.findAll(
        {
            where: {
                location: { [Op.in]: lowerCaseLocations }
            },
          }        
    )
    await db.disconnect();

    if ( !dosimeter ) {
        return null;
    }
    console.log(dosimeter)

    for (let i = 0; i < dosimeter.length; i++) {
        delete dosimeter[i]._id;
      }
    return JSON.parse( JSON.stringify( dosimeter ) );
}