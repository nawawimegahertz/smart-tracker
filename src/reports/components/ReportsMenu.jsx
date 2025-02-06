import React from 'react';
import { Divider, List } from '@mui/material';
import StarIcon from "../reports-icons/star.svg";
// import TimelineIcon from '@mui/icons-material/Timeline';
import PauseCircleFilledIcon from "../reports-icons/pause.svg";
import PlayCircleFilledIcon from "../reports-icons/play.svg";
import NotificationsActiveIcon from "../reports-icons/notification.svg";
import FormatListBulletedIcon from "../reports-icons/summary.svg";
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from "../reports-icons/replay.svg";
// import EventRepeatIcon from '@mui/icons-material/EventRepeat';
// import NotesIcon from '@mui/icons-material/Notes';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator, useRestriction } from '../../common/util/permissions';
import MenuItem from '../../common/components/MenuItem';

const ReportsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');

  return (
    <>
      <List>
        <MenuItem
          title={t('reportCombined')}
          link="/reports/combined"
          icon={(
            <img
              src={StarIcon}
              alt="Star Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
          selected={location.pathname === '/reports/combined'}
        />
        {/* <MenuItem
          title={t('reportRoute')}
          link="/reports/route"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/route'}
        /> */}
        <MenuItem
          title={t('reportEvents')}
          link="/reports/event"
          icon={(
            <img
              src={NotificationsActiveIcon}
              alt="Notifications Active Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
          selected={location.pathname === '/reports/event'}
        />
        <MenuItem
          title={t('reportTrips')}
          link="/reports/trip"
          icon={(
            <img
              src={PlayCircleFilledIcon}
              alt="Play Circle Filled Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
          selected={location.pathname === '/reports/trip'}
        />
        <MenuItem
          title={t('reportStops')}
          link="/reports/stop"
          icon={(
            <img
              src={PauseCircleFilledIcon}
              alt="Pause Circle Filled Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
          selected={location.pathname === '/reports/stop'}
        />
        <MenuItem
          title={t('reportSummary')}
          link="/reports/summary"
          icon={(
            <img
              src={FormatListBulletedIcon}
              alt="Format List Bulleted Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
          selected={location.pathname === '/reports/summary'}
        />
        {/* <MenuItem
          title={t('reportChart')}
          link="/reports/chart"
          icon={<TrendingUpIcon />}
          selected={location.pathname === '/reports/chart'}
        /> */}
        <MenuItem
          title={t('reportReplay')}
          link="/replay"
          icon={(
            <img
              src={RouteIcon}
              alt="Route Icon"
              style={{ width: 20, height: 20 }}
            />
          )}
        />
      </List>
      {/* <Divider /> */}
      {/* <List>
        <MenuItem
          title={t('sharedLogs')}
          link="/reports/logs"
          icon={<NotesIcon />}
          selected={location.pathname === '/reports/logs'}
        />
        {!readonly && (
          <MenuItem
            title={t('reportScheduled')}
            link="/reports/scheduled"
            icon={<EventRepeatIcon />}
            selected={location.pathname === '/reports/scheduled'}
          />
        )}
        {admin && (
          <MenuItem
            title={t('statisticsTitle')}
            link="/reports/statistics"
            icon={<BarChartIcon />}
            selected={location.pathname === '/reports/statistics'}
          />
        )}
      </List> */}
    </>
  );
};

export default ReportsMenu;