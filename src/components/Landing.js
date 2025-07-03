import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/main');
  };

  return (
    <div className="landing">
      <h1>Welcome to AW139 PAC</h1>
      <p>This tool will guide you step by step to perform the engine power check.</p>
      <button className="btn" onClick={handleStart}>
        Let´s begin
      </button>
    </div>
  );
}
