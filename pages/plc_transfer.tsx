import React, { useState, useEffect } from "react";
import { ShopLayout } from "../components/layouts";
import { CustomTable, Column } from "../components/tables";
import axios from "axios";
import { addHours, format, subHours } from "date-fns";

const timeZone = "America/Buenos_Aires"; // Por ejemplo, "America/Buenos_Aires"

const columns: Column[] = [
  
  { id: 'E3TimeStamp', label: 'TimeStamp', minWidth: 100,
  format: (row: any) => (
    <>{format(addHours(new Date(row.E3TimeStamp), 3), 'dd/MM/yyyy HH:mm:ss')}</>
  ), },
  { id: 'Area', label: 'Area', minWidth: 170 },
  {
    id: 'Message',
    label: 'Mensaje',
    minWidth: 70,
    align: 'center',
  },
  {
    id: 'Source',
    label: 'Origen',
    minWidth: 70,
    align: 'center',

  },
];

const PlcTransfer = ({  }) => {

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.2.57:4000/alarms');
        setData(response.data);
        console.log(response.data)
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
  },[]);

  return (
    <ShopLayout title={"Laboratorio"} pageDescription={""}>

      <CustomTable
        data={data}
        columns={columns}
      />
    </ShopLayout>
  );
};

export default PlcTransfer;


