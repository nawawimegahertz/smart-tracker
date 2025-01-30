import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography, Badge,
} from '@mui/material';

// import reportIcon from '../attributes/BottomMenuIcons/report-icon.png';
// import settingsIcon from '../attributes/BottomMenuIcons/setting-icon.png';
// import mapIcon from '../attributes/BottomMenuIcons/map-icon.png';
// import personIcon from '../attributes/BottomMenuIcons/person-icon.png';
// import logoutIcon from '../attributes/BottomMenuIcons/logout-icon.png';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return 'account';
    } if (location.pathname.startsWith('/settings')) {
      return 'settings';
    } if (location.pathname.startsWith('/reports')) {
      return 'reports';
    } if (location.pathname === '/') {
      return 'map';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'reports':
        navigate('/reports/combined');
        break;
      case 'settings':
        navigate('/settings/preferences');
        break;
      case 'account':
        setAnchorEl(event.currentTarget);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <Paper square elevation={3}>
      <BottomNavigation value={currentSelection()} onChange={handleSelection} showLabels>
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={(
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <img
                src="https://nawawimegahertz.github.io/svg-icons-cdn/BottomMenuIcons/map-icon.svg"
                alt="Map icon"
                style={{ width: 25, height: 25 }}
              />
            </Badge>
          )}
          value="map"
        />
        {!disableReports && (
          <BottomNavigationAction
            label={t('reportTitle')}
            icon={
            <img 
            src="https://nawawimegahertz.github.io/svg-icons-cdn/BottomMenuIcons/reports-icon.svg"
            alt="Report Icon"
            style={{ width: 25, height: 25 }}     
            />}
            value="reports"
          />
        )}
        <BottomNavigationAction
          label={t('settingsTitle')}
          icon={
          <img src="https://nawawimegahertz.github.io/svg-icons-cdn/BottomMenuIcons/setting-icon.svg"  
          alt="Settings Icon"
          style={{ width: 24, height: 24 }} />
          }
          value="settings"
        />
        {readonly ? (
          <BottomNavigationAction
            label={t('loginLogout')}
            icon=
            {<img
              src="https://nawawimegahertz.github.io/svg-icons-cdn/BottomMenuIcons/logout-icon.svg"
              alt="Logout Icon"
              style={{ width: 25, height: 25 }}
              />}
            value="logout"
          />
        ) : (
          <BottomNavigationAction
            label={t('settingsUser')}
            icon={<img src="https://nawawimegahertz.github.io/svg-icons-cdn/BottomMenuIcons/person-icon.svg"
            alt="Person Icon"
            style={{ width: 24, height: 24 }} />}
            value="account"
          />
        )}
      </BottomNavigation>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAccount}>
          <Typography color="textPrimary">{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;