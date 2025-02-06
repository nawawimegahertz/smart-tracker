import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton,
} from '@mui/material';
import MenuIcon from '../attributes/navbar-icons/menu.svg';

const Navbar = ({ setOpenDrawer, title }) => (
  <AppBar position="sticky" color="inherit">
    <Toolbar>
        <IconButton
          color="error"
          edge="start"
          onClick={() => setOpenDrawer(true)}
        >
          <MenuIcon style={{ width: '25px', height: '25px' }} />
        </IconButton>
      <Typography variant="h6" noWrap>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
