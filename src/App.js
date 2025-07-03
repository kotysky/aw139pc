import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'
import Landing from './components/Landing';
import MainCapture from './components/MainCapture';
import Result from './components/Result';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>}/>
      <Route path="/main" element={<Layout><MainCapture /></Layout>} />
      <Route path="/result" element={<Layout><Result /></Layout>} />
    </Routes>
  );
}



