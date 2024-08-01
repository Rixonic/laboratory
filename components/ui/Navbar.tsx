import { useContext } from 'react';

import {  Box, Link, Toolbar, Typography } from '@mui/material';

import { UiContext } from '../../context';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

import { drawerWidth } from '../constants';
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));


export const Navbar = () => {

    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
    //const { toggleSideMenu } = useContext( UiContext );

    return (
        <AppBar open={isMenuOpen}>
            <Toolbar>

                
                <Box flex={ 1 } display={"flex"} gap={2} >
                  <Typography variant='h6' display='flex' fontWeight={"bold"} color={"black"}></Typography>
                  <Typography variant='h6' sx={{ display: { xs: 'none', sm: 'flex' } }} color={"black"}></Typography>
                </Box>

                <Box flex={ 1 } />

                {/* Pantallas pequeñas
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={ toggleSideMenu }
                >
                    <SearchOutlined />
                </IconButton> */}



                <Link display='flex' alignItems="baseline" href='/'>
                        <Typography variant='h6'>Laboratorio |</Typography>
                        <Typography sx={{ ml: 0.5 }}>HSJD</Typography>
                    </Link>  


            </Toolbar>
        </AppBar>
    )
}
