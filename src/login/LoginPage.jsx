import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Select, MenuItem, FormControl, Button, TextField, Snackbar, IconButton, Tooltip, Box, Typography, Link,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import { handleLoginTokenListeners, nativeEnvironment, nativePostMessage } from '../common/components/NativeInterface';
import { useCatch } from '../reactHelper';
import Loader from '../common/components/Loader';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], country: values[1].country, name: values[1].name }));

  const [failed, setFailed] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false); // State baru untuk melacak kegagalan pertama

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => !state.session.server.attributes['ui.disableLoginLanguage']);
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = '';
      try {
        const expiration = dayjs().add(6, 'months').toISOString();
        const response = await fetch('/api/session/token', {
          method: 'POST',
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = '';
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        navigate('/');
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setFailed(true);
      setFailedOnce(true); // Menandai bahwa terjadi kegagalan login
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(`/api/session?token=${encodeURIComponent(token)}`);
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      navigate('/');
    } else {
      throw Error(await response.text());
    }
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  if (openIdForced) {
    handleOpenIdLogin();
    return (<Loader />);
  }

  // Kontrol di pojok kanan atas: dropdown bahasa dan pengaturan server
  const topRightControls = (
    <>
      {nativeEnvironment && changeEnabled && (
        <Tooltip title={t('settingsServer')}>
          <IconButton onClick={() => navigate('/change-server')}>
            <LockOpenIcon />
          </IconButton>
        </Tooltip>
      )}
      {languageEnabled && (
        <FormControl variant="outlined" size="small">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Language Select' }}
            sx={{
              minWidth: 120,
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {languageList.map((it) => (
              <MenuItem key={it.code} value={it.code}>
                <Box component="span" sx={{ mr: 1 }}>
                  <ReactCountryFlag countryCode={it.country} svg />
                </Box>
                {it.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );

  // Konten footer: Tautan Register dan Reset Password
  const footerContent = (
    <Box>
      <Typography variant="body2" style={{ color: '#555' }}>
        {t('wantToRegister')}
        <Link
          href="/register"
          style={{ color: '#1976d2', textDecoration: 'none', marginLeft: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
          onClick={(e) => { e.preventDefault(); navigate('/register'); }}
        >
          {t('registerNow')}
        </Link>
      </Typography>
      {failedOnce && (
        <Typography variant="body2" style={{ color: '#555', marginTop: '8px' }}>
          <Link
            href="/reset-password"
            style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
            onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
            onClick={(e) => { e.preventDefault(); navigate('/reset-password'); }}
          >
            Forgot your password?
          </Link>
        </Typography>
      )}
    </Box>
  );

  return (
    <LoginLayout
      topRightControls={topRightControls}
      childrenFooter={footerContent}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        width="100%"
      >
        <TextField
          required
          error={failed}
          label={t('userEmail')}
          name="email"
          value={email}
          autoComplete="email"
          autoFocus={!email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={failed && 'Invalid username or password'}
          fullWidth
        />
        <TextField
          required
          error={failed}
          label={t('userPassword')}
          name="password"
          value={password}
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        {codeEnabled && (
          <TextField
            required
            error={failed}
            label={t('loginTotpCode')}
            name="code"
            value={code}
            type="number"
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
        )}
        <Box width="100%" display="flex" flexDirection="column" gap={2} mt={2}>
          <Button
            onClick={handlePasswordLogin}
            variant="contained"
            color="primary"
            disabled={!email || !password || (codeEnabled && !code)}
            fullWidth
            sx={{
              padding: '12px',
              fontSize: '1rem',
              textTransform: 'none',
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
              },
            }}
          >
            {t('loginLogin')}
          </Button>
          {openIdEnabled && (
            <Button
              onClick={() => handleOpenIdLogin()}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                padding: '12px',
                fontSize: '1rem',
                textTransform: 'none',
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, background-color 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {t('loginOpenId')}
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="large" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </LoginLayout>
  );
};

export default LoginPage;