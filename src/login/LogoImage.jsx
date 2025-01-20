import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import Logo from '../resources/images/logo.png'; // Mengganti impor file SVG ke PNG

const useStyles = makeStyles((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '180px',
    maxHeight: '180px',
    width: 'auto',
    height: 'auto',
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const classes = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="" />;
    }
    return <img className={classes.image} src={logo} alt="" />;
  }
  return <img className={classes.image} src={Logo} alt="Default Logo" style={{ color }} />;
};

export default LogoImage;