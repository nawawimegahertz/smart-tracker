import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableHead, TableRow, TableBody, TableCell, TablePagination,
} from '@mui/material';
import {
  formatDistance, formatTime,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import scheduleReport from './common/scheduleReport';

const SummaryReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const distanceUnit = useAttributePreference('distanceUnit');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSubmit = useCatch(async ({ deviceIds, from, to }) => {
    const query = new URLSearchParams({ from, to, daily: true });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/summary?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'summary';
    report.attributes.daily = true;
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'deviceId':
        return devices[value].name;
      case 'startTime':
        return formatTime(value, 'date');
      case 'startOdometer':
      case 'endOdometer':
      case 'distance':
        return formatDistance(value, distanceUnit, t);
      default:
        return value;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedItems = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportSummary']}>
      <div className={classes.header}>
        <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} multiDevice loading={loading} />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedDevice')}</TableCell>
            <TableCell>{t('sharedDistance')}</TableCell>
            <TableCell>{t('reportStartOdometer')}</TableCell>
            <TableCell>{t('reportEndOdometer')}</TableCell>
            <TableCell>{t('reportStartDate')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? paginatedItems.map((item) => (
            <TableRow key={(`${item.deviceId}_${Date.parse(item.startTime)}`)}>
              <TableCell>{devices[item.deviceId].name}</TableCell>
              <TableCell>{formatValue(item, 'distance')}</TableCell>
              <TableCell>{formatValue(item, 'startOdometer')}</TableCell>
              <TableCell>{formatValue(item, 'endOdometer')}</TableCell>
              <TableCell>{formatValue(item, 'startTime')}</TableCell>
            </TableRow>
          )) : (<TableShimmer columns={5} />)}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </PageLayout>
  );
};

export default SummaryReportPage;
