// src/2-components/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <header style={{
        backgroundColor: '#20232a',
        color: '#61dafb',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            AW139PAC Engine Monitoring
          </span>

          {!isLanding && (
            <Link
              to="/"
              className="btn"
              style={{
                margin: 0,
                padding: '10px 20px',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Inicio
            </Link>
          )}
        </div>
      </header>

      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </>
  );
}
