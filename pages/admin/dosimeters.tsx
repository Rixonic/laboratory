import React, { useContext, useState, useEffect } from 'react'
import { Stack} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import { AdminLayout } from '../../components/layouts'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import {CustomTable,Column} from '../../components/tables'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';

const EquipmentsPage = () => {
  const onDownloadImage = (image: string) => {
    fetch(image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        const defaultFileName = 'dosimetria.pdf';
        link.setAttribute('download', defaultFileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };

  const columns: Column[] = [
    { id: 'headquarter', label: 'Sede', minWidth: 170 },
    { id: 'service', label: 'Servicio', minWidth: 100 },
    { id: 'location', label: 'Sector', minWidth: 100 },
    {
      id: 'month',
      label: 'Mes',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'year',
      label: 'Año',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'document',
      label: 'Descargar',
      minWidth: 70,
      align: 'center',
      format: (value: string) => (
        <IconButton
          onClick={() => onDownloadImage(value)}
        >
          <DownloadIcon />
        </IconButton>
      ),
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/dosimeters');
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  },[]);

  return (
    <AdminLayout
      title={`Dosimetria `}
      subTitle={''}
      icon={<CategoryOutlined />}
    >
      <Stack
        sx={{marginTop:4}}
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={4}
      >
          <CustomTable
            columns={columns}
            data={data}
          />
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/dosimeters/new"
        >
          Agregar
        </Button>
      </Stack>
    </AdminLayout>


  )
}

export default EquipmentsPage;