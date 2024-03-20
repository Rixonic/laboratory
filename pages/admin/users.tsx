import React, { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material'
import useSWR from 'swr';
import { Grid, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (row: IUser) => React.JSX.Element;
}

const UsersPage = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data])


    if (!data && !error) return (<></>);

    const onRoleUpdated = async (userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {

            await tesloApi.put('/admin/users', { userId, role: newRole });

        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert('No se pudo actualizar el role del usuario');
        }

    }

    const onSectorUpdated = async (userId: string, newSector: string) => {

        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            sector: userId === user._id ? newSector : user.sector
        }));

        setUsers(updatedUsers);

        try {

            await tesloApi.put('/admin/users', { userId, sector: newSector });

        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert('No se pudo actualizar el sector del usuario');
        }

    }


    const columns: Column[] = [
        { id: 'name', label: 'Nombre completo', minWidth: 170 },
        { id: 'email', label: 'Usuario', minWidth: 100 },
        {
            id: 'download',
            label: 'Descargar',
            minWidth: 70,
            align: 'center',
            format: (row: IUser) => (
                <Select
                    value={row.role}
                    label="Rol"
                    onChange={({ target }) => onRoleUpdated(row._id, target.value)}
                    sx={{ width: '300px' }}
                >
                    <MenuItem value='admin'> Admin </MenuItem>
                    <MenuItem value='supervisor'> Supervisor </MenuItem>
                    <MenuItem value='tecnico'> Tecnico </MenuItem>
                    <MenuItem value='servicio'> Servicio </MenuItem>
                    <MenuItem value='cliente'> Visitante </MenuItem>

                </Select>
            ),
        },
    ];

    const excludedUserIds = ['64d38bb56782503e279bf36a', '64d38cdb6782503e279bf38b']; // Agrega aquí los IDs de los usuarios que deseas excluir

    const filteredUsers = users.filter(user => !excludedUserIds.includes(user._id));

    const rows = filteredUsers.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,

    }));


    return (
        <AdminLayout
            title={'Usuarios'}
            subTitle={'Mantenimiento de usuarios'}
            icon={<PeopleOutline />}
        >


            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <Paper sx={{ width: '100%' }} >
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ top: 57, minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format
                                                                    ? column.format(row)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Items por pagina"
                            labelDisplayedRows={({ from, to, count }) => `Mostrando items del ${from}al ${to} de ${count} items`}
                        />
                    </Paper>

                </Grid>
            </Grid>


        </AdminLayout>
    )
}

export default UsersPage