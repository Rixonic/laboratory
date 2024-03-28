import { useContext, useState } from 'react';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Box, Divider, Drawer, Stack, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, LoginOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { UiContext, AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { drawerWidth } from '../constants';

export const SideMenu = () => {
    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
    const { user, isLoggedIn, logout } = useContext(AuthContext);
    //console.log(user)
    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }


    return (
        <Drawer
            //variant="permanent"
            variant="persistent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
            open={isMenuOpen}

        >
            <Box sx={{ width: drawerWidth - 1, paddingTop: 5 }}>

                <List>

                    <Typography textAlign={'center'} marginBottom={1}>{user?.name}</Typography>

                    <Divider variant="middle" />
                    <ListSubheader>Menu principal</ListSubheader>

                    {
                        isLoggedIn && (
                            <>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/')}>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'} />
                                </ListItem>

                            </>
                        )
                    }


                    {
                        isLoggedIn
                            ? (
                                <ListItem button onClick={logout}>
                                    <ListItemIcon>
                                        <LoginOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Salir'} />
                                </ListItem>
                            )
                            : (
                                <ListItem
                                    button
                                    onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
                                >
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItem>
                            )
                    }

                    {

                        <>
                            <Divider variant="middle" />
                            <ListSubheader>Accesos</ListSubheader>
                            <ListItem
                                button
                                onClick={() => navigateTo('/equipamiento')}>
                                <ListItemIcon>
                                    <CategoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Equipos'} />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => navigateTo('/dosimetros')}>
                                <ListItemIcon>
                                    <CategoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Dosimetros'} />
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => navigateTo('/tickets')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Tickets'} />
                            </ListItem>
                        </>
                    }
                    {/* Admin */}
                    {
                        user?.locations?.includes("INGENIERIA") && (
                            <>
                                <Divider variant="middle" />
                                <ListSubheader>Gestion tecnica</ListSubheader>


                                <ListItem
                                    button
                                    onClick={() => navigateTo('/')}>
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/equipamiento')}>
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Equipos'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/requerimient')}>
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Requerimientos'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/users')}>
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )

                    }
                    {
                        (user?.locations?.includes("LABORATORIO") || user?.locations?.includes("INGENIERIA")) && (
                            <>
                                <Divider variant="middle" />
                                <ListSubheader>BMS</ListSubheader>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/laboratory')}>
                                    <ListItemIcon>
                                        <ThermostatIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Laboratorio'} />
                                </ListItem>
                                {user?.locations?.includes("INGENIERIA") && 
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/plc_transfer')}>
                                    <ListItemIcon>
                                        <ThermostatIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'PLC Transferencia'} />
                                </ListItem>
                                }
                            </>
                        ) 
                    }
                </List>
            </Box>
        </Drawer>
    )
}
