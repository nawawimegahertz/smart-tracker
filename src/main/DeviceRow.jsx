import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  IconButton, Tooltip, Avatar, ListItemAvatar, ListItemText, ListItemButton,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const BatteryFullIcon = "https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/batteryfull.svg";
const BatteryChargingFullIcon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/batterychargingfull.svg';
const Battery60Icon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/battery60.svg';
const BatteryCharging60Icon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/batterycharging60.svg';
const Battery20Icon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/battery20.svg';
const BatteryCharging20Icon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/batterycharging20.svg';

import ErrorIcon from '../main/toolbar-icons/error.svg';

const EngineIcon = 'https://nawawimegahertz.github.io/svg-icons-cdn/SidebarIcons/engine.svg';

import { devicesActions } from '../store';
import {
  formatAlarm, formatBoolean, formatPercentage, formatStatus, getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import { useAttributePreference } from '../common/util/preferences';

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: '28px',
    height: '28px',
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem',
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  const admin = useAdministrator();

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const secondaryText = () => {
    let status;
    if (item.status === 'online' || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }
    return (
      <>
        {deviceSecondary && item[deviceSecondary] && `${item[deviceSecondary]} • `}
        <span className={classes[getStatusColor(item.status)]}>{status}</span>
      </>
    );
  };

  return (
    <div style={style}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
      >
        {/* Avatar Ikon Kategori Device */}
        <ListItemAvatar>
          <Avatar>
            <img
              className={classes.icon}
              src={mapIcons[mapIconKey(item.category)]}
              alt=""
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item[devicePrimary]}
          primaryTypographyProps={{ noWrap: true }}
          secondary={secondaryText()}
          secondaryTypographyProps={{ noWrap: true }}
        />

        {/* Bagian Status (Alarm, Ignition, Battery) */}
        {position && (
          <>
            {/* Alarm */}
            {position.attributes.hasOwnProperty('alarm') && (
              <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                <IconButton size="small">
                  <img
                    src={ErrorIcon}
                    alt="Error Icon"
                    className={classes.error}
                    style={{ width: 20, height: 20 }}
                  />
                </IconButton>
              </Tooltip>
            )}

            {/* Ignition (Engine) */}
            {position.attributes.hasOwnProperty('ignition') && (
              <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}>
                <IconButton size="small">
                  {position.attributes.ignition ? (
                    <img
                      src={EngineIcon}
                      alt="Engine Icon On"
                      width={20}
                      height={20}
                      className={classes.success}
                    />
                  ) : (
                    <img
                      src={EngineIcon}
                      alt="Engine Icon Off"
                      width={20}
                      height={20}
                      className={classes.neutral}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Battery */}
            {position.attributes.hasOwnProperty('batteryLevel') && (
              <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}>
                <IconButton size="small">
                  {
                    (position.attributes.batteryLevel > 70 && (
                      position.attributes.charge ? (
                        <img
                          src={BatteryChargingFullIcon}
                          alt="Battery Charging Full Icon"
                          className={classes.success}
                          style={{ width: 20, height: 20 }}
                        />
                      ) : (
                        <img
                          src={BatteryFullIcon}
                          alt="Battery Full Icon"
                          className={classes.success}
                          style={{ width: 20, height: 20 }}
                        />
                      )
                    )) || (position.attributes.batteryLevel > 30 && (
                      position.attributes.charge ? (
                        <img
                          src={BatteryCharging60Icon}
                          alt="Battery Charging 60 Icon"
                          className={classes.warning}
                          style={{ width: 20, height: 20 }}
                        />
                      ) : (
                        <img
                          src={Battery60Icon}
                          alt="Battery 60 Icon"
                          className={classes.warning}
                          style={{ width: 20, height: 20 }}
                        />
                      )
                    )) || (
                      position.attributes.charge ? (
                        <img
                          src={BatteryCharging20Icon}
                          alt="Battery Charging 20 Icon"
                          className={classes.error}
                          style={{ width: 20, height: 20 }}
                        />
                      ) : (
                        <img
                          src={Battery20Icon}
                          alt="Battery 20 Icon"
                          className={classes.error}
                          style={{ width: 20, height: 20 }}
                        />
                      )
                    )
                  }
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;