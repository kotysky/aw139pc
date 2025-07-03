import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Result() {
  const location = useLocation();
  const { eng1, eng2, meteo } = location.state || {};

  console.log("Datos recibidos:", { eng1, eng2, meteo });

  const allOk = eng1[0]?.ENG1_TEST_OK && eng2[0]?.ENG2_TEST_OK;

  const diff = (val, ref) => {
    const num = (val - ref).toFixed(1);
    return num > 0 ? `+${num}` : num;
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>TEST RESULT</h2>

      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: allOk ? 'green' : 'red', margin: '1rem' }}>
        {allOk ? '✅ Test OK' : '❌ Test Fail'}
      </div>

      {meteo && (
        <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#444' }}>
          <p>📍 <strong>Closest METAR Location:</strong> {meteo.icao}</p>
          <p>🌡️ <strong>Temp:</strong> {meteo.temperature} °C | <strong>QNH:</strong> {meteo.qnh} hPa | <strong>Pressure Alt:</strong> {meteo.pressure_altitude} ft</p>
        </div>
      )}

      <table style={{ margin: '2rem auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th></th>
            <th>ENGINE 1</th>
            <th>ENGINE 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ITT</strong></td>
            <td>{eng1[0]?.ITT1} (MAX: {eng1[0]?.ITT_ref})</td>
            <td>{eng2[0]?.ITT2} (MAX: {eng2[0]?.ITT_ref})</td>
          </tr>
          <tr>
            <td><strong>NG</strong></td>
            <td>{eng1[0]?.NG1} (MAX: {eng1[0]?.NG_ref})</td>
            <td>{eng2[0]?.NG2} (MAX: {eng2[0]?.NG_ref})</td>
          </tr>
          <tr>
            <td><strong> ITT MARIGN</strong></td>
            <td>{diff(eng1[0]?.ITT1, eng1[0]?.ITT_ref)}</td>
            <td>{diff(eng2[0]?.ITT2, eng2[0]?.ITT_ref)}</td>
          </tr>
          <tr>
            <td><strong>NG MARGIN</strong></td>
            <td>{diff(eng1[0]?.NG1, eng1[0]?.NG_ref)}</td>
            <td>{diff(eng2[0]?.NG2, eng2[0]?.NG_ref)}</td>
          </tr>
          <tr>
            <td><strong>STATUS</strong></td>
            <td style={{ color: eng1[0]?.ENG1_TEST_OK ? 'green' : 'red' }}>
              {eng1[0]?.ENG1_TEST_OK ? '✅ OK' : '❌ FAIL'}
            </td>
            <td style={{ color: eng2[0]?.ENG2_TEST_OK ? 'green' : 'red' }}>
              {eng2[0]?.ENG2_TEST_OK ? '✅ OK' : '❌ FAIL'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
