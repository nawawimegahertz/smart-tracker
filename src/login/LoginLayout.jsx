import React from 'react';
import LogoImage from './LogoImage';

const LoginLayout = ({ children, topRightControls = null, childrenFooter = null }) => {
  const styles = {
    root: {
      display: 'flex',
      minHeight: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '16px',
      position: 'relative', // Untuk penempatan topRightControls
    },
    topRight: {
      position: 'fixed', // Agar tetap berada di posisi saat scroll
      top: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      zIndex: 1000, // Agar selalu di atas elemen lain
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      padding: '32px',
      backgroundColor: '#fff',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    logoContainer: {
      marginBottom: '10px',
    },
    title: {
      margin: '16px 0',
      fontWeight: 700,
      textAlign: 'center',
      color: '#333',
      fontSize: '1.5rem',
      marginBottom: '16px',
    },
    form: {
      width: '100%',
    },
    footer: {
      marginTop: '24px',
      width: '100%',
      textAlign: 'center',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.root}>
      {topRightControls && <div style={styles.topRight}>{topRightControls}</div>}
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <LogoImage color="#1976d2" />
        </div>
        <h1 style={styles.title}>GPS Anda. Hak Anda.</h1>
        <form style={styles.form}>{children}</form>
        {childrenFooter && <div style={styles.footer}>{childrenFooter}</div>}
      </div>
    </div>
  );
};

export default LoginLayout;